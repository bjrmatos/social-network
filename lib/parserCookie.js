'use strict';

var cookie = require('cookie'),
    signature = require('cookie-signature');

/**
 * Parse a cookie header [foo=bar; cat=meow; dog=ruff]
 * into a object
 */

exports.parse = function(cookieText) {
  return cookie.parse(cookieText);
};

/**
 * Parse signed cookies, returning an object
 * containing the decoded key/value pairs,
 * while removing the signed key from `obj`.
 *
 */

exports.signedCookies = function(obj, secret){
  var cookies = Object.keys(obj);
  var dec;
  var key;
  var ret = Object.create(null);
  var val;

  for (var i = 0; i < cookies.length; i++) {
    key = cookies[i];
    val = obj[key];
    dec = exports.signedCookie(val, secret);

    if (val !== dec) {
      ret[key] = dec;
      delete obj[key];
    }
  }

  return ret;
};

/**
 * Parse a signed cookie string, return the decoded value
 *
 */

exports.signedCookie = function(str, secret){
  return str.substr(0, 2) === 's:' ?
    signature.unsign(str.slice(2), secret) :
    str;
};
