/*
 * Copyright 2015 Google Inc. All rights reserved.
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

goog.provide('Constants');

/**
 * Constants for present havoc game.
 */
Constants = {
  // Configs for keyboard controls
  PLAYER_CONTROLS: {
    ARROWS: {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight'
    },
    WASD: {
      up: 'w',
      down: 's',
      left: 'a',
      right: 'd'
    }
  },
  PLAYER_STEP_SIZE: 2,

  GRID_DIMENSIONS: {
    HEIGHT: 16.0, // height in grid units
    WIDTH: 28.0, // width in grid units
    UNIT_SIZE: 50 // height and width of one grid unit
  }

}
