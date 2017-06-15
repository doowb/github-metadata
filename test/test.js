'use strict';

require('mocha');
var githubAuth = require('bot-github-auth')();
var extend = require('extend-shallow');
var assert = require('assert');
var metadata = require('..');

describe('github-metadata', function() {
  this.timeout(10000);
  this.slow(8000);

  it('should export a function', function() {
    assert.equal(typeof metadata, 'function');
  });

  it('should get metadata for a user page when the owner is a user', function(cb) {
    var options = {owner: 'doowb', repo: 'doowb.github.com'};
    githubAuth()
      .then(function(auth) {
        metadata(extend(options, auth), function(err, data) {
          if (err) return cb(err);
          assert.equal(typeof data, 'object');
          assert.equal(typeof data.site, 'object');
          assert.equal(typeof data.site.github, 'object');
          assert.equal(Array.isArray(data.site.github.public_repositories), true);
          assert.equal(Array.isArray(data.site.github.organization_members), false);
          assert.equal(Array.isArray(data.site.github.contributors), true);
          assert.equal(Array.isArray(data.site.github.collaborators), true);
          assert.equal(Array.isArray(data.site.github.branches), true);
          assert.equal(Array.isArray(data.site.github.teams), true);
          assert.equal(Array.isArray(data.site.github.releases), true);
          assert.equal(Array.isArray(data.site.github.tags), true);
          assert.equal(typeof data.site.github.languages, 'object');
          assert.equal(typeof data.site.github.repository, 'object');
          assert.equal(typeof data.site.github.pages_info, 'object');
          assert.equal(typeof data.site.github.pages, 'object');
          assert.equal(typeof data.site.github.hostname, 'string');
          assert.equal(typeof data.site.github.pages_hostname, 'string');
          assert.equal(typeof data.site.github.api_url, 'string');
          assert.equal(typeof data.site.github.help_url, 'string');
          assert.equal(typeof data.site.github.environment, 'string');
          assert.equal(typeof data.site.github.pages_env, 'string');
          assert.equal(typeof data.site.github.url, 'string');
          assert.equal(typeof data.site.github.project_title, 'string');
          assert.equal(typeof data.site.github.repository_name, 'string');
          assert.equal(typeof data.site.github.repository_nwo, 'string');
          assert.equal(typeof data.site.github.project_tagline, 'string');
          assert.equal(typeof data.site.github.owner_name, 'string');
          assert.equal(typeof data.site.github.owner_gravatar_url, 'string');
          assert.equal(typeof data.site.github.repository_url, 'string');
          assert.equal(typeof data.site.github.language, 'string');
          assert.equal(typeof data.site.github.owner_url, 'string');
          assert.equal(typeof data.site.github.zip_url, 'string');
          assert.equal(typeof data.site.github.tar_url, 'string');
          assert.equal(typeof data.site.github.clone_url, 'string');
          assert.equal(typeof data.site.github.releases_url, 'string');
          assert.equal(typeof data.site.github.issues_url, 'string');
          assert.equal(typeof data.site.github.wiki_url, 'string');
          assert.equal(typeof data.site.github.show_downloads, 'boolean');
          assert.equal(typeof data.site.github.is_user_page, 'boolean');
          assert.equal(typeof data.site.github.is_project_page, 'boolean');

          assert.equal(data.site.github.is_user_page, true);
          assert.equal(data.site.github.is_project_page, false);
          cb();
        });
      });
  });

  it('should get metadata for a user page when the owner is an organization', function(cb) {
    var options = {owner: 'boilerplates', repo: 'boilerplates.github.io'};
    githubAuth()
      .then(function(auth) {
        metadata(extend(options, auth), function(err, data) {
          if (err) return cb(err);
          assert.equal(typeof data, 'object');
          assert.equal(typeof data.site, 'object');
          assert.equal(typeof data.site.github, 'object');
          assert.equal(Array.isArray(data.site.github.public_repositories), true);
          assert.equal(Array.isArray(data.site.github.organization_members), true);
          assert.equal(Array.isArray(data.site.github.contributors), true);
          assert.equal(Array.isArray(data.site.github.collaborators), true);
          assert.equal(Array.isArray(data.site.github.branches), true);
          assert.equal(Array.isArray(data.site.github.teams), true);
          assert.equal(Array.isArray(data.site.github.releases), true);
          assert.equal(Array.isArray(data.site.github.tags), true);
          assert.equal(typeof data.site.github.languages, 'object');
          assert.equal(typeof data.site.github.repository, 'object');
          assert.equal(typeof data.site.github.pages_info, 'object');
          assert.equal(typeof data.site.github.pages, 'object');
          assert.equal(typeof data.site.github.hostname, 'string');
          assert.equal(typeof data.site.github.pages_hostname, 'string');
          assert.equal(typeof data.site.github.api_url, 'string');
          assert.equal(typeof data.site.github.help_url, 'string');
          assert.equal(typeof data.site.github.environment, 'string');
          assert.equal(typeof data.site.github.pages_env, 'string');
          assert.equal(typeof data.site.github.url, 'string');
          assert.equal(typeof data.site.github.project_title, 'string');
          assert.equal(typeof data.site.github.repository_name, 'string');
          assert.equal(typeof data.site.github.repository_nwo, 'string');
          assert.equal(typeof data.site.github.project_tagline, 'string');
          assert.equal(typeof data.site.github.owner_name, 'string');
          assert.equal(typeof data.site.github.owner_gravatar_url, 'string');
          assert.equal(typeof data.site.github.repository_url, 'string');
          assert.equal(typeof data.site.github.language, 'string');
          assert.equal(typeof data.site.github.owner_url, 'string');
          assert.equal(typeof data.site.github.zip_url, 'string');
          assert.equal(typeof data.site.github.tar_url, 'string');
          assert.equal(typeof data.site.github.clone_url, 'string');
          assert.equal(typeof data.site.github.releases_url, 'string');
          assert.equal(typeof data.site.github.issues_url, 'string');
          assert.equal(typeof data.site.github.wiki_url, 'string');
          assert.equal(typeof data.site.github.show_downloads, 'boolean');
          assert.equal(typeof data.site.github.is_user_page, 'boolean');
          assert.equal(typeof data.site.github.is_project_page, 'boolean');

          assert.equal(data.site.github.is_user_page, true);
          assert.equal(data.site.github.is_project_page, false);
          cb();
        });
      });
  });

  it('should get metadata for a project page when the owner is a user', function(cb) {
    var options = {owner: 'doowb', repo: 'github-metadata'};
    githubAuth()
      .then(function(auth) {
        metadata(extend(options, auth), function(err, data) {
          if (err) return cb(err);
          assert.equal(typeof data, 'object');
          assert.equal(typeof data.site, 'object');
          assert.equal(typeof data.site.github, 'object');
          assert.equal(Array.isArray(data.site.github.public_repositories), true);
          assert.equal(Array.isArray(data.site.github.organization_members), false);
          assert.equal(Array.isArray(data.site.github.contributors), true);
          assert.equal(Array.isArray(data.site.github.collaborators), true);
          assert.equal(Array.isArray(data.site.github.branches), true);
          assert.equal(Array.isArray(data.site.github.teams), true);
          assert.equal(Array.isArray(data.site.github.releases), true);
          assert.equal(Array.isArray(data.site.github.tags), true);
          assert.equal(typeof data.site.github.languages, 'object');
          assert.equal(typeof data.site.github.repository, 'object');
          assert.equal(typeof data.site.github.pages_info, 'object');
          assert.equal(typeof data.site.github.pages, 'object');
          assert.equal(typeof data.site.github.hostname, 'string');
          assert.equal(typeof data.site.github.pages_hostname, 'string');
          assert.equal(typeof data.site.github.api_url, 'string');
          assert.equal(typeof data.site.github.help_url, 'string');
          assert.equal(typeof data.site.github.environment, 'string');
          assert.equal(typeof data.site.github.pages_env, 'string');
          assert.equal(typeof data.site.github.url, 'string');
          assert.equal(typeof data.site.github.project_title, 'string');
          assert.equal(typeof data.site.github.repository_name, 'string');
          assert.equal(typeof data.site.github.repository_nwo, 'string');
          assert.equal(typeof data.site.github.project_tagline, 'string');
          assert.equal(typeof data.site.github.owner_name, 'string');
          assert.equal(typeof data.site.github.owner_gravatar_url, 'string');
          assert.equal(typeof data.site.github.repository_url, 'string');
          assert.equal(typeof data.site.github.language, 'string');
          assert.equal(typeof data.site.github.owner_url, 'string');
          assert.equal(typeof data.site.github.zip_url, 'string');
          assert.equal(typeof data.site.github.tar_url, 'string');
          assert.equal(typeof data.site.github.clone_url, 'string');
          assert.equal(typeof data.site.github.releases_url, 'string');
          assert.equal(typeof data.site.github.issues_url, 'string');
          assert.equal(typeof data.site.github.wiki_url, 'string');
          assert.equal(typeof data.site.github.show_downloads, 'boolean');
          assert.equal(typeof data.site.github.is_user_page, 'boolean');
          assert.equal(typeof data.site.github.is_project_page, 'boolean');

          assert.equal(data.site.github.is_user_page, false);
          assert.equal(data.site.github.is_project_page, true);
          cb();
        });
      });
  });

  it('should get metadata for a project page when the owner is an organization', function(cb) {
    var options = {owner: 'assemble', repo: 'assemble.io'};
    githubAuth()
      .then(function(auth) {
        metadata(extend(options, auth), function(err, data) {
          if (err) return cb(err);
          assert.equal(typeof data, 'object');
          assert.equal(typeof data.site, 'object');
          assert.equal(typeof data.site.github, 'object');
          assert.equal(Array.isArray(data.site.github.public_repositories), true);
          assert.equal(Array.isArray(data.site.github.organization_members), true);
          assert.equal(Array.isArray(data.site.github.contributors), true);
          assert.equal(Array.isArray(data.site.github.collaborators), true);
          assert.equal(Array.isArray(data.site.github.branches), true);
          assert.equal(Array.isArray(data.site.github.teams), true);
          assert.equal(Array.isArray(data.site.github.releases), true);
          assert.equal(Array.isArray(data.site.github.tags), true);
          assert.equal(typeof data.site.github.languages, 'object');
          assert.equal(typeof data.site.github.repository, 'object');
          assert.equal(typeof data.site.github.pages_info, 'object');
          assert.equal(typeof data.site.github.pages, 'object');
          assert.equal(typeof data.site.github.hostname, 'string');
          assert.equal(typeof data.site.github.pages_hostname, 'string');
          assert.equal(typeof data.site.github.api_url, 'string');
          assert.equal(typeof data.site.github.help_url, 'string');
          assert.equal(typeof data.site.github.environment, 'string');
          assert.equal(typeof data.site.github.pages_env, 'string');
          assert.equal(typeof data.site.github.url, 'string');
          assert.equal(typeof data.site.github.project_title, 'string');
          assert.equal(typeof data.site.github.repository_name, 'string');
          assert.equal(typeof data.site.github.repository_nwo, 'string');
          assert.equal(typeof data.site.github.project_tagline, 'string');
          assert.equal(typeof data.site.github.owner_name, 'string');
          assert.equal(typeof data.site.github.owner_gravatar_url, 'string');
          assert.equal(typeof data.site.github.repository_url, 'string');
          assert.equal(typeof data.site.github.language, 'string');
          assert.equal(typeof data.site.github.owner_url, 'string');
          assert.equal(typeof data.site.github.zip_url, 'string');
          assert.equal(typeof data.site.github.tar_url, 'string');
          assert.equal(typeof data.site.github.clone_url, 'string');
          assert.equal(typeof data.site.github.releases_url, 'string');
          assert.equal(typeof data.site.github.issues_url, 'string');
          assert.equal(typeof data.site.github.wiki_url, 'string');
          assert.equal(typeof data.site.github.show_downloads, 'boolean');
          assert.equal(typeof data.site.github.is_user_page, 'boolean');
          assert.equal(typeof data.site.github.is_project_page, 'boolean');

          assert.equal(data.site.github.is_user_page, false);
          assert.equal(data.site.github.is_project_page, true);
          cb();
        });
      });
  });
});
