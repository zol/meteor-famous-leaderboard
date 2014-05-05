/* Owner: zol@percolatestudio.com
 * @license MPL 2.0
 * @copyright Percolate Studio Pty Ltd. 2014
 */

define('ReactiveSurface', ["famous/core/Surface"], function(require, exports, module) {
  var Surface = require('famous/core/Surface');

  /**
   * A surface containing a reactive Meteor Blaze UI Component.
   *   This extends the Surface class.
   *
   * @class ReactiveSurface
   * @extends Surface
   * @constructor
   * @param {Object} [options] overrides of default options
   * @param {Component} [options.template] Component to render
   */
  function ReactiveSurface(options) {
    Surface.apply(this, arguments);
  
    if (! UI.isComponent(options.template))
      throw new Error("Component required here");
    if (options.template.isInited)
      throw new Error("Can't render component instance");

    this._template = options.template;

    if (typeof options.data !== 'function') {
      this._data = function() { return options.data; };
    } else {
      this._data = options.data;
    }
  }

  ReactiveSurface.prototype = Object.create(Surface.prototype);
  ReactiveSurface.prototype.constructor = ReactiveSurface;

  /**
   * noop.
   *
   * @method setContent
   *
   */
  ReactiveSurface.prototype.setContent = function setContent() {};

  /**
   * Render and insert the UI component into the DOM.
   *
   * @private
   * @method deploy
   * @param {Node} target document parent of this container
   */
  ReactiveSurface.prototype.deploy = function deploy(target) {
    UI.insert(UI.render(this._template.extend({data: this._data})), target);
  };

  /**
   * Remove the UI component from the DOM via jQuery, Blaze will cleanup.
   *
   * @private
   * @method recall
   */
  ReactiveSurface.prototype.recall = function recall(target) {
    $(target).empty();
  };


  module.exports = ReactiveSurface;
});