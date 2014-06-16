
(function(){
  'use strict';

  var $ = require('jquery'),
      Backbone = require('backbone'),
      Account = require('./models/Account'),
      StatusCollection = require('./collections/Status'),
      ContactCollection = require('./collections/Contact'),
      IndexView = require('./views/Index'),
      RegisterView = require('./views/Register'),
      LoginView = require('./views/Login'),
      ForgotPasswordView = require('./views/ForgotPassword'),
      ProfileView = require('./views/Profile'),
      ContactsView = require('./views/Contacts'),
      AddContactView = require('./views/AddContact');

  Backbone.$ = $;

  // SocialRouter
  var Router = Backbone.Router.extend({
    routes: {
      'index': 'index',
      'addcontact': 'addcontact',
      'login': 'login',
      'register': 'register',
      'forgotpassword': 'forgotpassword',
      'profile/:id': 'profile',
      'contacts/:id': 'contacts'
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
    addcontact: function() {
      this.app.changeView(new AddContactView());
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
    },
    contacts: function(id) {
      var contactId = id ? id : 'me',
          contactCollection = new ContactCollection();

      contactCollection.url = '/account/' + contactId + '/contacts';

      this.app.changeView(new ContactsView({
        collection: contactCollection
      }));

      contactCollection.fetch();
    }
  });

  module.exports = Router;
})();
