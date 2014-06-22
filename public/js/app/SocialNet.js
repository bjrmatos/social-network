
(function(window){
  'use strict';

  var $ = require('jquery'),
      _ = require('underscore'),
      Backbone = require('backbone'),
      Router = require('./router');

  Backbone.$ = $;

  var SocialNet = {};

  _.extend(SocialNet, Backbone.Events);

  // check if the user is log-in
  var checkLogin = function checkLogin(callback) {
    $.ajax('/account/authenticated', {
      type: 'GET'
    })
    .done(function() {
      console.log('ALL OK!!');
      return callback(true);
    })
    .fail(function() {
      console.log('Your are not logged-in!!');
      return callback(false);
    });
  };

  SocialNet.currentView = null;

  SocialNet.init = function() {
    var router = new Router({ app: this });
    this.router = router;
    this.listenTo(Backbone, 'redirect', this.redirect);
  };

  // SocialNet.changeView = function(view) {
  //   if (null != this.currentView) {
  //     // Remove all callbacks for all events asociate in this object
  //     // (Delete Objects listen [observers] -> View events)
  //     this.currentView.off();
  //     // Remove the element, DOM events and call stopListening
  //     // to remove any bound events that the view has listenTo'd
  //     // (Delete View listen -> Objects events)
  //     this.currentView.remove();
  //   }

  //   this.currentView = view;
  //   this.currentView.render();
  // };

  SocialNet.changeView = function(view) {
    if (null != this.currentView) {
      // Remove subviews
      if (this.currentView.removeSubViews) {
        this.currentView.removeSubViews();
      }

      // Remove all callbacks for all events asociate in this object
      // (Delete Objects listen [observers] -> View events)
      this.currentView.off();
      // Don't call to .remove() because all the views render on top of
      // $('#content'), calling .remove() delete the element
      this.currentView.undelegateEvents(); // kill events asociated in the view
      this.currentView.stopListening();
    }

    this.currentView = view;
    this.currentView.render();
  };

  SocialNet.redirect = function(opt) {
    var options = {
      url: null,
      refresh: false,
      trigger: false
    };

    _.extend(options, opt);

    if (options.url == null) { return; }

    if (options.refresh) {
      return window.location.href = options.url;
    }

    this.router.navigate(options.url, { trigger: options.trigger });
  };

  SocialNet.run = function() {
    checkLogin(_.bind(function(authenticated) {
      /**
      *
      * start the history and hash based events
      * and check for the proper init page.
      *
      * <!-- Passing silent: true, for don't launch
      * the initial route, because first we check for
      * the user is logged-in and redirect based on it. -->
      *
      **/

      /**

        TODO:
        - Check if exists a better pattern for manage authentication
          in backbone apps

      **/

      Backbone.history.start();

      // if is not logged-in refirect to login
      if (!authenticated) {
        this.router.navigate('login', {trigger: true});
      } else {
        // Take the current path (fragment) and navigate to it
        this.router.navigate(Backbone.history.fragment || 'index', {trigger: true});
      }
    }, this));
  };

  module.exports = SocialNet;
})(global);
