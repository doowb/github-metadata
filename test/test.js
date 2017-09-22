'use strict';

require('mocha');
var githubAuth = require('bot-github-auth')();
var extend = require('extend-shallow');
var assert = require('assert');
var metadata = require('..');

function getAuth(options) {
  return githubAuth()
    .then((auth) => extend(options, auth));
}

describe('github-metadata', function() {
  this.timeout(10000);
  this.slow(8000);

  it('should export a function', function() {
    assert.equal(typeof metadata, 'function');
  });

  it('should return an error when the repository does not exist', function() {
    var options = {owner: 'doowb', repo: 'this-repo-does-not-exist'};
    return getAuth(options)
      .then(metadata)
      .then(function() {
        throw new Error('expected an error');
      })
      .catch(function(err) {
        assert.equal(err.message, `Unable to find repository "${options.owner}/${options.repo}"`);
      });
  });

  it('should get metadata for a user page when the owner is a user', function() {
    var options = {owner: 'doowb', repo: 'doowb.github.com'};
    return getAuth(options)
      .then(metadata)
      .then(function(data) {
        assert.equal(typeof data, 'object');
        assert.equal(Array.isArray(data.public_repositories), true);
        assert.equal(Array.isArray(data.organization_members), false);
        assert.equal(Array.isArray(data.contributors), true);
        assert.equal(Array.isArray(data.collaborators), true);
        assert.equal(Array.isArray(data.branches), true);
        assert.equal(Array.isArray(data.teams), true);
        assert.equal(Array.isArray(data.releases), true);
        assert.equal(Array.isArray(data.tags), true);
        assert.equal(typeof data.languages, 'object');
        assert.equal(typeof data.repository, 'object');
        assert.equal(typeof data.pages_info, 'object');
        assert.equal(typeof data.package, 'object');
        assert.equal(typeof data.package.name, 'undefined');
        assert.equal(typeof data.pages, 'object');
        assert.equal(typeof data.hostname, 'string');
        assert.equal(typeof data.pages_hostname, 'string');
        assert.equal(typeof data.api_url, 'string');
        assert.equal(typeof data.help_url, 'string');
        assert.equal(typeof data.environment, 'string');
        assert.equal(typeof data.pages_env, 'string');
        assert.equal(typeof data.url, 'string');
        assert.equal(typeof data.project_title, 'string');
        assert.equal(typeof data.repository_name, 'string');
        assert.equal(typeof data.repository_nwo, 'string');
        assert.equal(typeof data.project_tagline, 'string');
        assert.equal(typeof data.owner_name, 'string');
        assert.equal(typeof data.owner_gravatar_url, 'string');
        assert.equal(typeof data.repository_url, 'string');
        assert.equal(typeof data.language, 'string');
        assert.equal(typeof data.owner_url, 'string');
        assert.equal(typeof data.zip_url, 'string');
        assert.equal(typeof data.tar_url, 'string');
        assert.equal(typeof data.clone_url, 'string');
        assert.equal(typeof data.releases_url, 'string');
        assert.equal(typeof data.issues_url, 'string');
        assert.equal(typeof data.wiki_url, 'string');
        assert.equal(typeof data.show_downloads, 'boolean');
        assert.equal(typeof data.is_user_page, 'boolean');
        assert.equal(typeof data.is_project_page, 'boolean');

        assert.equal(data.is_user_page, true);
        assert.equal(data.is_project_page, false);
      });
  });

  it('should get metadata for a user page when the owner is an organization', function() {
    var options = {owner: 'boilerplates', repo: 'boilerplates.github.io'};
    return getAuth(options)
      .then(metadata)
      .then(function(data) {
        assert.equal(typeof data, 'object');
        assert.equal(Array.isArray(data.public_repositories), true);
        assert.equal(Array.isArray(data.organization_members), true);
        assert.equal(Array.isArray(data.contributors), true);
        assert.equal(Array.isArray(data.collaborators), true);
        assert.equal(Array.isArray(data.branches), true);
        assert.equal(Array.isArray(data.teams), true);
        assert.equal(Array.isArray(data.releases), true);
        assert.equal(Array.isArray(data.tags), true);
        assert.equal(typeof data.languages, 'object');
        assert.equal(typeof data.repository, 'object');
        assert.equal(typeof data.pages_info, 'object');
        assert.equal(typeof data.package, 'object');
        assert.equal(typeof data.package.name, 'undefined');
        assert.equal(typeof data.pages, 'object');
        assert.equal(typeof data.hostname, 'string');
        assert.equal(typeof data.pages_hostname, 'string');
        assert.equal(typeof data.api_url, 'string');
        assert.equal(typeof data.help_url, 'string');
        assert.equal(typeof data.environment, 'string');
        assert.equal(typeof data.pages_env, 'string');
        assert.equal(typeof data.url, 'string');
        assert.equal(typeof data.project_title, 'string');
        assert.equal(typeof data.repository_name, 'string');
        assert.equal(typeof data.repository_nwo, 'string');
        assert.equal(typeof data.project_tagline, 'string');
        assert.equal(typeof data.owner_name, 'string');
        assert.equal(typeof data.owner_gravatar_url, 'string');
        assert.equal(typeof data.repository_url, 'string');
        assert.equal(typeof data.language, 'string');
        assert.equal(typeof data.owner_url, 'string');
        assert.equal(typeof data.zip_url, 'string');
        assert.equal(typeof data.tar_url, 'string');
        assert.equal(typeof data.clone_url, 'string');
        assert.equal(typeof data.releases_url, 'string');
        assert.equal(typeof data.issues_url, 'string');
        assert.equal(typeof data.wiki_url, 'string');
        assert.equal(typeof data.show_downloads, 'boolean');
        assert.equal(typeof data.is_user_page, 'boolean');
        assert.equal(typeof data.is_project_page, 'boolean');

        assert.equal(data.is_user_page, true);
        assert.equal(data.is_project_page, false);
      });
  });

  it('should get metadata for a project page when the owner is a user', function() {
    var options = {owner: 'doowb', repo: 'github-metadata'};
    return getAuth(options)
      .then(metadata)
      .then(function(data) {
        assert.equal(typeof data, 'object');
        assert.equal(Array.isArray(data.public_repositories), true);
        assert.equal(Array.isArray(data.organization_members), false);
        assert.equal(Array.isArray(data.contributors), true);
        assert.equal(Array.isArray(data.collaborators), true);
        assert.equal(Array.isArray(data.branches), true);
        assert.equal(Array.isArray(data.teams), true);
        assert.equal(Array.isArray(data.releases), true);
        assert.equal(Array.isArray(data.tags), true);
        assert.equal(typeof data.languages, 'object');
        assert.equal(typeof data.repository, 'object');
        assert.equal(typeof data.pages_info, 'object');
        assert.equal(typeof data.package, 'object');
        assert.equal(typeof data.package.name, 'string');
        assert.equal(typeof data.pages, 'object');
        assert.equal(typeof data.hostname, 'string');
        assert.equal(typeof data.pages_hostname, 'string');
        assert.equal(typeof data.api_url, 'string');
        assert.equal(typeof data.help_url, 'string');
        assert.equal(typeof data.environment, 'string');
        assert.equal(typeof data.pages_env, 'string');
        assert.equal(typeof data.url, 'string');
        assert.equal(typeof data.project_title, 'string');
        assert.equal(typeof data.repository_name, 'string');
        assert.equal(typeof data.repository_nwo, 'string');
        assert.equal(typeof data.project_tagline, 'string');
        assert.equal(typeof data.owner_name, 'string');
        assert.equal(typeof data.owner_gravatar_url, 'string');
        assert.equal(typeof data.repository_url, 'string');
        assert.equal(typeof data.language, 'string');
        assert.equal(typeof data.owner_url, 'string');
        assert.equal(typeof data.zip_url, 'string');
        assert.equal(typeof data.tar_url, 'string');
        assert.equal(typeof data.clone_url, 'string');
        assert.equal(typeof data.releases_url, 'string');
        assert.equal(typeof data.issues_url, 'string');
        assert.equal(typeof data.wiki_url, 'string');
        assert.equal(typeof data.show_downloads, 'boolean');
        assert.equal(typeof data.is_user_page, 'boolean');
        assert.equal(typeof data.is_project_page, 'boolean');

        assert.equal(data.is_user_page, false);
        assert.equal(data.is_project_page, true);
      });
  });

  it('should get metadata for a project page when the owner is an organization', function() {
    var options = {owner: 'assemble', repo: 'assemble.io'};
    return getAuth(options)
      .then(metadata)
      .then(function(data) {
        assert.equal(typeof data, 'object');
        assert.equal(Array.isArray(data.public_repositories), true);
        assert.equal(Array.isArray(data.organization_members), true);
        assert.equal(Array.isArray(data.contributors), true);
        assert.equal(Array.isArray(data.collaborators), true);
        assert.equal(Array.isArray(data.branches), true);
        assert.equal(Array.isArray(data.teams), true);
        assert.equal(Array.isArray(data.releases), true);
        assert.equal(Array.isArray(data.tags), true);
        assert.equal(typeof data.languages, 'object');
        assert.equal(typeof data.repository, 'object');
        assert.equal(typeof data.pages_info, 'object');
        assert.equal(typeof data.package, 'object');
        assert.equal(typeof data.package.name, 'string');
        assert.equal(typeof data.pages, 'object');
        assert.equal(typeof data.hostname, 'string');
        assert.equal(typeof data.pages_hostname, 'string');
        assert.equal(typeof data.api_url, 'string');
        assert.equal(typeof data.help_url, 'string');
        assert.equal(typeof data.environment, 'string');
        assert.equal(typeof data.pages_env, 'string');
        assert.equal(typeof data.url, 'string');
        assert.equal(typeof data.project_title, 'string');
        assert.equal(typeof data.repository_name, 'string');
        assert.equal(typeof data.repository_nwo, 'string');
        assert.equal(typeof data.project_tagline, 'string');
        assert.equal(typeof data.owner_name, 'string');
        assert.equal(typeof data.owner_gravatar_url, 'string');
        assert.equal(typeof data.repository_url, 'string');
        assert.equal(typeof data.language, 'string');
        assert.equal(typeof data.owner_url, 'string');
        assert.equal(typeof data.zip_url, 'string');
        assert.equal(typeof data.tar_url, 'string');
        assert.equal(typeof data.clone_url, 'string');
        assert.equal(typeof data.releases_url, 'string');
        assert.equal(typeof data.issues_url, 'string');
        assert.equal(typeof data.wiki_url, 'string');
        assert.equal(typeof data.show_downloads, 'boolean');
        assert.equal(typeof data.is_user_page, 'boolean');
        assert.equal(typeof data.is_project_page, 'boolean');

        assert.equal(data.is_user_page, false);
        assert.equal(data.is_project_page, true);
      });
  });

  it('should get metadata with some properties excluded', function() {
    var options = {
      owner: 'doowb',
      repo: 'doowb.github.com',
      exclude: ['org', 'contributors', 'collaborators', 'teams']
    };

    return getAuth(options)
      .then(metadata)
      .then(function(data) {
        assert.equal(typeof data, 'object');
        assert.equal(Array.isArray(data.public_repositories), false);
        assert.equal(Array.isArray(data.organization_members), false);
        assert.equal(Array.isArray(data.contributors), false);
        assert.equal(Array.isArray(data.collaborators), false);
        assert.equal(Array.isArray(data.branches), true);
        assert.equal(Array.isArray(data.teams), false);
        assert.equal(Array.isArray(data.releases), true);
        assert.equal(Array.isArray(data.tags), true);
        assert.equal(typeof data.languages, 'object');
        assert.equal(typeof data.repository, 'object');
        assert.equal(typeof data.pages_info, 'object');
        assert.equal(typeof data.pages, 'object');
        assert.equal(typeof data.hostname, 'string');
        assert.equal(typeof data.pages_hostname, 'string');
        assert.equal(typeof data.api_url, 'string');
        assert.equal(typeof data.help_url, 'string');
        assert.equal(typeof data.environment, 'string');
        assert.equal(typeof data.pages_env, 'string');
        assert.equal(typeof data.url, 'string');
        assert.equal(typeof data.project_title, 'string');
        assert.equal(typeof data.repository_name, 'string');
        assert.equal(typeof data.repository_nwo, 'string');
        assert.equal(typeof data.project_tagline, 'string');
        assert.equal(typeof data.owner_name, 'string');
        assert.equal(typeof data.owner_gravatar_url, 'string');
        assert.equal(typeof data.repository_url, 'string');
        assert.equal(typeof data.language, 'string');
        assert.equal(typeof data.owner_url, 'string');
        assert.equal(typeof data.zip_url, 'string');
        assert.equal(typeof data.tar_url, 'string');
        assert.equal(typeof data.clone_url, 'string');
        assert.equal(typeof data.releases_url, 'string');
        assert.equal(typeof data.issues_url, 'string');
        assert.equal(typeof data.wiki_url, 'string');
        assert.equal(typeof data.show_downloads, 'boolean');
        assert.equal(typeof data.is_user_page, 'boolean');
        assert.equal(typeof data.is_project_page, 'boolean');

        assert.equal(data.is_user_page, true);
        assert.equal(data.is_project_page, false);
      });
  });
});
