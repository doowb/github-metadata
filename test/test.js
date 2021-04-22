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
    assert.strictEqual(typeof metadata, 'function');
  });

  it('should return an error when the repository does not exist', function() {
    var options = {owner: 'doowb', repo: 'this-repo-does-not-exist'};
    return getAuth(options)
      .then(metadata)
      .then(function() {
        throw new Error('expected an error');
      })
      .catch(function(err) {
        assert.strictEqual(
          err.message,
          `Unable to find repository "${options.owner}/${options.repo}"`
        );
      });
  });

  it('should get metadata for a user page when the owner is a user', function() {
    var options = {owner: 'doowb', repo: 'doowb.github.com'};
    return getAuth(options)
      .then(metadata)
      .then(function(data) {
        assert.strictEqual(typeof data, 'object');
        assert.strictEqual(Array.isArray(data.public_repositories), true);
        assert.strictEqual(Array.isArray(data.organization_members), false);
        assert.strictEqual(Array.isArray(data.contributors), true);
        assert.strictEqual(Array.isArray(data.collaborators), true);
        assert.strictEqual(Array.isArray(data.branches), true);
        assert.strictEqual(Array.isArray(data.teams), true);
        assert.strictEqual(Array.isArray(data.releases), true);
        assert.strictEqual(Array.isArray(data.tags), true);
        assert.strictEqual(typeof data.languages, 'object');
        assert.strictEqual(typeof data.repository, 'object');
        assert.strictEqual(typeof data.pages_info, 'object');
        assert.strictEqual(typeof data.package, 'object');
        assert.strictEqual(typeof data.package.name, 'undefined');
        assert.strictEqual(typeof data.pages, 'object');
        assert.strictEqual(typeof data.hostname, 'string');
        assert.strictEqual(typeof data.pages_hostname, 'string');
        assert.strictEqual(typeof data.api_url, 'string');
        assert.strictEqual(typeof data.help_url, 'string');
        assert.strictEqual(typeof data.environment, 'string');
        assert.strictEqual(typeof data.pages_env, 'string');
        assert.strictEqual(typeof data.url, 'string');
        assert.strictEqual(typeof data.project_title, 'string');
        assert.strictEqual(typeof data.repository_name, 'string');
        assert.strictEqual(typeof data.repository_nwo, 'string');
        assert.strictEqual(typeof data.project_tagline, 'string');
        assert.strictEqual(typeof data.owner_name, 'string');
        assert.strictEqual(typeof data.owner_gravatar_url, 'string');
        assert.strictEqual(typeof data.repository_url, 'string');
        assert.strictEqual(typeof data.language, 'string');
        assert.strictEqual(typeof data.owner_url, 'string');
        assert.strictEqual(typeof data.zip_url, 'string');
        assert.strictEqual(typeof data.tar_url, 'string');
        assert.strictEqual(typeof data.clone_url, 'string');
        assert.strictEqual(typeof data.releases_url, 'string');
        assert.strictEqual(typeof data.issues_url, 'string');
        assert.strictEqual(typeof data.wiki_url, 'string');
        assert.strictEqual(typeof data.show_downloads, 'boolean');
        assert.strictEqual(typeof data.is_user_page, 'boolean');
        assert.strictEqual(typeof data.is_project_page, 'boolean');

        assert.strictEqual(data.is_user_page, true);
        assert.strictEqual(data.is_project_page, false);
      });
  });

  it('should get metadata for a user page when the owner is an organization', function() {
    var options = {owner: 'boilerplates', repo: 'boilerplates.github.io'};
    return getAuth(options)
      .then(metadata)
      .then(function(data) {
        assert.strictEqual(typeof data, 'object');
        assert.strictEqual(Array.isArray(data.public_repositories), true);
        assert.strictEqual(Array.isArray(data.organization_members), true);
        assert.strictEqual(Array.isArray(data.contributors), true);
        assert.strictEqual(Array.isArray(data.collaborators), true);
        assert.strictEqual(Array.isArray(data.branches), true);
        assert.strictEqual(Array.isArray(data.teams), true);
        assert.strictEqual(Array.isArray(data.releases), true);
        assert.strictEqual(Array.isArray(data.tags), true);
        assert.strictEqual(typeof data.languages, 'object');
        assert.strictEqual(typeof data.repository, 'object');
        assert.strictEqual(typeof data.pages_info, 'object');
        assert.strictEqual(typeof data.package, 'object');
        assert.strictEqual(typeof data.package.name, 'undefined');
        assert.strictEqual(typeof data.pages, 'object');
        assert.strictEqual(typeof data.hostname, 'string');
        assert.strictEqual(typeof data.pages_hostname, 'string');
        assert.strictEqual(typeof data.api_url, 'string');
        assert.strictEqual(typeof data.help_url, 'string');
        assert.strictEqual(typeof data.environment, 'string');
        assert.strictEqual(typeof data.pages_env, 'string');
        assert.strictEqual(typeof data.url, 'string');
        assert.strictEqual(typeof data.project_title, 'string');
        assert.strictEqual(typeof data.repository_name, 'string');
        assert.strictEqual(typeof data.repository_nwo, 'string');
        assert.strictEqual(typeof data.project_tagline, 'string');
        assert.strictEqual(typeof data.owner_name, 'string');
        assert.strictEqual(typeof data.owner_gravatar_url, 'string');
        assert.strictEqual(typeof data.repository_url, 'string');
        assert.strictEqual(typeof data.language, 'string');
        assert.strictEqual(typeof data.owner_url, 'string');
        assert.strictEqual(typeof data.zip_url, 'string');
        assert.strictEqual(typeof data.tar_url, 'string');
        assert.strictEqual(typeof data.clone_url, 'string');
        assert.strictEqual(typeof data.releases_url, 'string');
        assert.strictEqual(typeof data.issues_url, 'string');
        assert.strictEqual(typeof data.wiki_url, 'string');
        assert.strictEqual(typeof data.show_downloads, 'boolean');
        assert.strictEqual(typeof data.is_user_page, 'boolean');
        assert.strictEqual(typeof data.is_project_page, 'boolean');

        assert.strictEqual(data.is_user_page, true);
        assert.strictEqual(data.is_project_page, false);
      });
  });

  it('should get metadata for a project page when the owner is a user', function() {
    var options = {owner: 'doowb', repo: 'github-metadata'};
    return getAuth(options)
      .then(metadata)
      .then(function(data) {
        assert.strictEqual(typeof data, 'object');
        assert.strictEqual(Array.isArray(data.public_repositories), true);
        assert.strictEqual(Array.isArray(data.organization_members), false);
        assert.strictEqual(Array.isArray(data.contributors), true);
        assert.strictEqual(Array.isArray(data.collaborators), true);
        assert.strictEqual(Array.isArray(data.branches), true);
        assert.strictEqual(Array.isArray(data.teams), true);
        assert.strictEqual(Array.isArray(data.releases), true);
        assert.strictEqual(Array.isArray(data.tags), true);
        assert.strictEqual(typeof data.languages, 'object');
        assert.strictEqual(typeof data.repository, 'object');
        assert.strictEqual(typeof data.pages_info, 'object');
        assert.strictEqual(typeof data.package, 'object');
        assert.strictEqual(typeof data.package.name, 'string');
        assert.strictEqual(typeof data.pages, 'object');
        assert.strictEqual(typeof data.hostname, 'string');
        assert.strictEqual(typeof data.pages_hostname, 'string');
        assert.strictEqual(typeof data.api_url, 'string');
        assert.strictEqual(typeof data.help_url, 'string');
        assert.strictEqual(typeof data.environment, 'string');
        assert.strictEqual(typeof data.pages_env, 'string');
        assert.strictEqual(typeof data.url, 'string');
        assert.strictEqual(typeof data.project_title, 'string');
        assert.strictEqual(typeof data.repository_name, 'string');
        assert.strictEqual(typeof data.repository_nwo, 'string');
        assert.strictEqual(typeof data.project_tagline, 'string');
        assert.strictEqual(typeof data.owner_name, 'string');
        assert.strictEqual(typeof data.owner_gravatar_url, 'string');
        assert.strictEqual(typeof data.repository_url, 'string');
        assert.strictEqual(typeof data.language, 'string');
        assert.strictEqual(typeof data.owner_url, 'string');
        assert.strictEqual(typeof data.zip_url, 'string');
        assert.strictEqual(typeof data.tar_url, 'string');
        assert.strictEqual(typeof data.clone_url, 'string');
        assert.strictEqual(typeof data.releases_url, 'string');
        assert.strictEqual(typeof data.issues_url, 'string');
        assert.strictEqual(typeof data.wiki_url, 'string');
        assert.strictEqual(typeof data.show_downloads, 'boolean');
        assert.strictEqual(typeof data.is_user_page, 'boolean');
        assert.strictEqual(typeof data.is_project_page, 'boolean');

        assert.strictEqual(data.is_user_page, false);
        assert.strictEqual(data.is_project_page, true);
      });
  });

  it('should get metadata for a project page when the owner is an organization', function() {
    var options = {owner: 'assemble', repo: 'assemble.io'};
    return getAuth(options)
      .then(metadata)
      .then(function(data) {
        assert.strictEqual(typeof data, 'object');
        assert.strictEqual(Array.isArray(data.public_repositories), true);
        assert.strictEqual(Array.isArray(data.organization_members), true);
        assert.strictEqual(Array.isArray(data.contributors), true);
        assert.strictEqual(Array.isArray(data.collaborators), true);
        assert.strictEqual(Array.isArray(data.branches), true);
        assert.strictEqual(Array.isArray(data.teams), true);
        assert.strictEqual(Array.isArray(data.releases), true);
        assert.strictEqual(Array.isArray(data.tags), true);
        assert.strictEqual(typeof data.languages, 'object');
        assert.strictEqual(typeof data.repository, 'object');
        assert.strictEqual(typeof data.pages_info, 'object');
        assert.strictEqual(typeof data.package, 'object');
        assert.strictEqual(typeof data.package.name, 'string');
        assert.strictEqual(typeof data.pages, 'object');
        assert.strictEqual(typeof data.hostname, 'string');
        assert.strictEqual(typeof data.pages_hostname, 'string');
        assert.strictEqual(typeof data.api_url, 'string');
        assert.strictEqual(typeof data.help_url, 'string');
        assert.strictEqual(typeof data.environment, 'string');
        assert.strictEqual(typeof data.pages_env, 'string');
        assert.strictEqual(typeof data.url, 'string');
        assert.strictEqual(typeof data.project_title, 'string');
        assert.strictEqual(typeof data.repository_name, 'string');
        assert.strictEqual(typeof data.repository_nwo, 'string');
        assert.strictEqual(typeof data.project_tagline, 'string');
        assert.strictEqual(typeof data.owner_name, 'string');
        assert.strictEqual(typeof data.owner_gravatar_url, 'string');
        assert.strictEqual(typeof data.repository_url, 'string');
        assert.strictEqual(typeof data.language, 'string');
        assert.strictEqual(typeof data.owner_url, 'string');
        assert.strictEqual(typeof data.zip_url, 'string');
        assert.strictEqual(typeof data.tar_url, 'string');
        assert.strictEqual(typeof data.clone_url, 'string');
        assert.strictEqual(typeof data.releases_url, 'string');
        assert.strictEqual(typeof data.issues_url, 'string');
        assert.strictEqual(typeof data.wiki_url, 'string');
        assert.strictEqual(typeof data.show_downloads, 'boolean');
        assert.strictEqual(typeof data.is_user_page, 'boolean');
        assert.strictEqual(typeof data.is_project_page, 'boolean');

        assert.strictEqual(data.is_user_page, false);
        assert.strictEqual(data.is_project_page, true);
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
        assert.strictEqual(typeof data, 'object');
        assert.strictEqual(Array.isArray(data.public_repositories), false);
        assert.strictEqual(Array.isArray(data.organization_members), false);
        assert.strictEqual(Array.isArray(data.contributors), false);
        assert.strictEqual(Array.isArray(data.collaborators), false);
        assert.strictEqual(Array.isArray(data.branches), true);
        assert.strictEqual(Array.isArray(data.teams), false);
        assert.strictEqual(Array.isArray(data.releases), true);
        assert.strictEqual(Array.isArray(data.tags), true);
        assert.strictEqual(typeof data.languages, 'object');
        assert.strictEqual(typeof data.repository, 'object');
        assert.strictEqual(typeof data.pages_info, 'object');
        assert.strictEqual(typeof data.pages, 'object');
        assert.strictEqual(typeof data.hostname, 'string');
        assert.strictEqual(typeof data.pages_hostname, 'string');
        assert.strictEqual(typeof data.api_url, 'string');
        assert.strictEqual(typeof data.help_url, 'string');
        assert.strictEqual(typeof data.environment, 'string');
        assert.strictEqual(typeof data.pages_env, 'string');
        assert.strictEqual(typeof data.url, 'string');
        assert.strictEqual(typeof data.project_title, 'string');
        assert.strictEqual(typeof data.repository_name, 'string');
        assert.strictEqual(typeof data.repository_nwo, 'string');
        assert.strictEqual(typeof data.project_tagline, 'string');
        assert.strictEqual(typeof data.owner_name, 'string');
        assert.strictEqual(typeof data.owner_gravatar_url, 'string');
        assert.strictEqual(typeof data.repository_url, 'string');
        assert.strictEqual(typeof data.language, 'string');
        assert.strictEqual(typeof data.owner_url, 'string');
        assert.strictEqual(typeof data.zip_url, 'string');
        assert.strictEqual(typeof data.tar_url, 'string');
        assert.strictEqual(typeof data.clone_url, 'string');
        assert.strictEqual(typeof data.releases_url, 'string');
        assert.strictEqual(typeof data.issues_url, 'string');
        assert.strictEqual(typeof data.wiki_url, 'string');
        assert.strictEqual(typeof data.show_downloads, 'boolean');
        assert.strictEqual(typeof data.is_user_page, 'boolean');
        assert.strictEqual(typeof data.is_project_page, 'boolean');

        assert.strictEqual(data.is_user_page, true);
        assert.strictEqual(data.is_project_page, false);
      });
  });
});
