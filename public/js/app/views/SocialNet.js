/* jshint camelcase: false */

(function(){
  'use strict';

  var $ = require('jquery'),
      _ = require('underscore'),
      Backbone = require('backbone');

  Backbone.$ = $;

  var SocialNetView = Backbone.View.extend({
    requireLogin: true,
    _subviews_: [],
    // method for optimal control subviews in a parent view
    assignSubView: function(selector, view) {
      var selectors;

      if (_.isObject(selector)) {
        selectors = selector;
      } else {
        selectors = {};
        selectors[selector] = view;
      }

      if (!selectors) {
        return;
      }

      _.each(selectors, function(view, selector) {
        this.addSubView(view);
        view.setElement(this.$(selector)).render();
      }, this);
    },
    addSubView: function(view) {
      this._subviews_.push(view);
    },
    // method for clean subviews properly
    // TODO: Iterate for each subview to see
    // if they have subviews and remove it
    removeSubViews: function() {
      if (this._subviews_.length > 1) {
        _.each(this._subviews_, function(view) {
          view.off();
          view.remove();
        });
      }
    }
  });

  module.exports = SocialNetView;
})();
