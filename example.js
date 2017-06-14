'use strict';

var metadata = require('./');
var githubAuth = require('bot-github-auth')();

githubAuth()
  .then(function(auth) {
    metadata(auth, function(err, data) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(data);
    });
  })
