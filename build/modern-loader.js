const importUtils = require('./import-utils.js');
const path = require('path');
const rollup = require('rollup');
const resolveNode = require('./resolve-node.js');
const transformFutureModules = require('./transform-future-modules.js');


/**
 * Rewrites the given file to operate correctly as an ES6 module. This is not
 * used in production.
 *
 * While this (currently) internally uses Rollup, it does not read file contents
 * from disk, or have any knowledge of external modules (aside resolving the
 * correct path to node_modules/ content).
 *
 * @param {string} id
 * @param {string|{code: string, map: Object}} content
 * @param {?function(RollupWarning): void} onwarn
 * @return {{code: string, map: SourceMap}|null}
 */
module.exports = async (id, content, onwarn=null) => {
  id = path.resolve(id);

  // If this is not a JS file, then skip Rollup and just rewrite it for the module case.
  const ext = path.extname(id);
  if (ext !== '.js' && ext !== '.mjs') {
    if (!content) {
      throw new Error(`got no content for: ${id}`);
    }

    const transformed = await transformFutureModules(id, content.code || content);
    content = typeof transformed === 'string' ? {code: transformed} : transformed;

    // HTML Modules can have further imports, so rewrite them too.
    // TODO(samthor): can we return this from transformFutureModules?
    if (ext !== '.html') {
      return content;
    }
  }

  const virtualPlugin = {
    load(idToLoad) {
      if (idToLoad !== id) {
        throw new Error(`got load request for non-main ID: ${idToLoad}`);
      }
      return content;
    },
    async resolveId(importee, importer) {
      // Resolve ourselves, and anything that Rollup doesn't need to (./, ../, etc).
      if (importee === id || importUtils.alreadyResolved(importee)) {
        return importee;
      }
      // Otherwise, use our custom Node resolver. This works around issues in the defacto standard
      // module 'rollup-plugin-node-resolve', such as:
      //  * lets us point to the nearest node_modules/ only (including a symlink)
      //  * resolved IDs that return as an object aren't passed to .external (below)
      return resolveNode(importee, importer);
    },
  };

  // Rollup can be relatively slow (~10's of ms) but often this is happening in parallel. We are
  // literally only here to rewrite imports into node_modules. This can probably be done faster.
  const bundle = await rollup.rollup({
    input: id,
    plugins: [virtualPlugin],
    external(id, parentId, isResolved) {
      if (isResolved) {
        return true;
      }
    },
    // This is true for sanity as Rollup never even gets to load anything but the primary module,
    // so we should only end up with a single result (checked below).
    preserveModules: true,
    onwarn,
  });

  const out = await bundle.generate({
    name: id,
    format: 'es',
    sourcemap: true,
    treeshake: false,  // we want to cache the results
  });

  if (out.output.length !== 1) {
    throw new Error(`unexpected Rollup length: ${out.output.length}`);
  }
  const first = out.output[0];
  return {code: first.code, map: first.map};
};