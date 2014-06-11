'use strict';

var crypto = require('crypto');

module.exports = function(config, mongoose, nodemailer) {
  var StatusSchema = new mongoose.Schema({
    name: {
      first: { type: String },
      last: { type: String }
    },
    status: { type: String }
  });

  var AccountSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: { type: String },
    name: {
      first: { type: String },
      last: { type: String }
    },
    birthday: {
      day: { type: Number, min: 1, max: 31, required: false },
      month: { type: Number, min: 1, max: 12, required: false },
      year: { type: Number }
    },
    photoUrl: { type: String },
    biography: { type: String },
    status: [StatusSchema], // Personal status updates
    activity: [StatusSchema], // All status updates including friends
  });

  var registerCallback = function(err) {
    if (err) {
      return console.log(err);
    }

    return console.log('Account was created');
  };

  AccountSchema.statics.changePassword = function(accountId, newPassword) {
    var shaSum = crypto.createHash('sha256');

    shaSum.update(newPassword);

    var hashedPassword = shaSum.digest('hex');

    Account.update({ _id: accountId },
    { $set: { password: hashedPassword } },
    { upsert: false },
    function(err) {
      console.log('Change password done for account ' + accountId);
    });
  };

  AccountSchema.statics.forgotPassword = function(email, resetPasswordUrl, callback) {
    this.findOne({ email:email }, function(err, doc) {
      if (err) {
        return callback(false);
      }

      var smtpTransport = nodemailer.createTransport('SMTP', config.mail);

      resetPasswordUrl += '?:account=' + doc._id;

      smtpTransport.sendMail({
        from: 'iamtestingmyapp@example.com',
        to: doc.email,
        subject: 'You forgot your password!!',
        text: 'Hit me to get a new password: ' + resetPasswordUrl
      }, function(err) {
        if (err) {
          return callback(false);
        }

        callback(true);
      });
    });
  };

  AccountSchema.statics.login = function(email, password, callback) {
    var shaSum = crypto.createHash('sha256');

    shaSum.update(password);

    this.findOne({ email: email, password: shaSum.digest('hex') },
    function(err, doc) {
      callback(doc);
    });
  };

  AccountSchema.statics.register = function(email, password, firstName, lastName) {
    var shaSum = crypto.createHash('sha256');

    shaSum.update(password);

    console.log('Registering: %s', email);

    var user = new Account({
      email: email,
      name: {
        first: firstName,
        last: lastName
      },
      password: shaSum.digest('hex')
    });

    user.save(registerCallback);
    console.log('Save command was sent');
  };

  var Account = mongoose.model('Account', AccountSchema);
  return Account;
};
