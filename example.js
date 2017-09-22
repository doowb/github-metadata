'use strict';

var githubAuth = require('bot-github-auth')();
var extend = require('extend-shallow');
var metadata = require('./');

var options = {
  owner: 'assemble',
  repo: 'assemble',
  exclude: ['org'] // don't get org information
};

githubAuth()
  .then(function(auth) {
    var opts = extend({}, options, auth);
    metadata(opts, function(err, data) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(JSON.stringify(data, null, 2));
    });
  })
