
(function(){
  'use strict';

  var $ = require('jquery'),
      Backbone = require('backbone'),
      Account = require('./models/Account'),
      StatusCollection = require('./collections/Status'),
      IndexView = require('./views/Index'),
      RegisterView = require('./views/Register'),
      LoginView = require('./views/Login'),
      ForgotPasswordView = require('./views/ForgotPassword'),
      ProfileView = require('./views/Profile');

  Backbone.$ = $;

  // SocialRouter
  var Router = Backbone.Router.extend({
    routes: {
      'index': 'index',
      'login': 'login',
      'register': 'register',
      'forgotpassword': 'forgotpassword',
      'profile:id': 'profile'
    },
    initialize: function(options) {
      this.app = options.app;
    },
    index: function() {
      var statusCollection = new StatusCollection();

      statusCollection.url = '/accounts/me/activity';

      this.app.changeView(new IndexView({
        collection: statusCollection
      }));

      statusCollection.fetch();
    },
    login: function() {
      this.app.changeView(new LoginView());
    },
    forgotPassword: function() {
      this.app.changeView(new ForgotPasswordView());
    },
    register: function() {
      this.app.changeView(new RegisterView());
    },
    profile: function(id) {
      var account = new Account({ id: id });

      this.app.changeView(new ProfileView({
        model: account
      }));

      account.fetch();
    }
  });

  module.exports = Router;
})();
