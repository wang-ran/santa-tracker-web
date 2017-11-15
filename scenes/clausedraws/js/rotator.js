/*
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

goog.provide('app.Rotator');
goog.require('app.Constants');


app.Rotator = function($elem) {
  this.elem = $elem;
  this.subscribers = [];

  this.rotateR = this.elem.find('[data-rotate-right]');
  this.rotateL = this.elem.find('[data-rotate-left]');

  this.rotateR.on('click.clausedraws touchend.clausedraws',
      this.rotate.bind(this, 1));
  this.rotateL.on('click.clausedraws touchend.clausedraws',
      this.rotate.bind(this, -1));
};


app.Rotator.prototype.rotate = function(direction) {
  var angle = app.Constants.ROTATE_ANGLE * direction;

  this.subscribers.forEach(function(subscriber) {
    subscriber.callback.call(subscriber.context, angle);
  }, this);
};


app.Rotator.prototype.subscribe = function(callback, context) {
  this.subscribers.push({
    callback: callback,
    context: context
  });
};

