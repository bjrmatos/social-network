
(function(){
  'use strict';

  var $ = require('jquery'),
      Backbone = require('backbone'),
      Router = require('./router');

  Backbone.$ = $;

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
      console.log('SOMETHING FAIL!!');
      return callback(false);
    });
  };

  exports.currentView = null;

  exports.init = function() {
    var router = new Router({ app: this });
    this.router = router;
  };

  // exports.changeView = function(view) {
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

  exports.changeView = function(view) {
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

  exports.run = function() {
    checkLogin(function(authenticated) {
      // start the history and hash based events
      // and check for the proper init page
      Backbone.history.start();

      // if is not logged-in refirect to login
      if (!authenticated) {
        this.router.navigate('login', {trigger: true});
      } else {
        // TODO: Implement logic to take the path to redirect from the url
        this.router.navigate('index', {trigger: true});
      }
    });
  };
})();
