
/**
 * Loads the passed script.
 *
 * @param {string} src
 * @param {?string=} type
 * @return {!Promise<void>}
 */
export function script(src, type=null) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    if (type) {
      script.type = type;
    }
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.append(script);
  });
}

/**
 * @param {string} src to load as global CSS
 * @return {!Promise<void>}
 */
export function css(src) {
  return new Promise((resolve, reject) => {
    const css = document.createElement('link');
    css.href = src;
    css.type = 'stylesheet';
    css.onload = () => resolve();
    css.onerror = reject;
    document.head.append(css);
  });
}
