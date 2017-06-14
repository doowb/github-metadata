'use strict';

var extend = require('extend-shallow');
var GitHub = require('github-base');
var setValue = require('set-value');
var getValue = require('get-value');
var koalas = require('koalas');

module.exports = function(options, cb) {
  var opts = extend({}, options);
  var context = {};

  var github = new GitHub(options);
  var pagedData = paged.bind(null, github);
  var getData = get.bind(null, github);

  Promise.resolve(context)
    .then(pagedData('site.github.public_repositories', '/orgs/:org/repos', opts))
    .then(pagedData('site.github.organization_members', '/orgs/:org/members', opts))
    .then(pagedData('site.github.contributors', '/repos/:owner/:repo/contributors', opts))
    .then(pagedData('site.github.collaborators', '/repos/:owner/:repo/collaborators', opts))
    .then(pagedData('site.github.branches', '/repos/:owner/:repo/branches', opts))
    .then(getData('site.github.languages', '/repos/:owner/:repo/languages', opts))
    .then(pagedData('site.github.teams', '/repos/:owner/:repo/teams', opts))
    .then(pagedData('site.github.releases', '/repos/:owner/:repo/releases', opts))
    .then(pagedData('site.github.tags', '/repos/:owner/:repo/tags', opts))
    .then(getData('site.github.repository', '/repos/:owner/:repo', opts))
    .then(getData('site.github.pages', '/repos/:owner/:repo/pages', opts))
    .then(copyProperties)
    .then(function(context) {
      cb(null, context);
    })
    .catch(cb);
};

function copyProperties(context) {
  var pages = extend({}, getValue(context, 'site.github.pages'));
  var pagesProps = {
    cname: 'site.github.url'
  };

  var repo = extend({}, getValue(context, 'site.github.repository'));
  var repoProps = {
    'name': ['site.github.project_title', 'site.github.repository_name'],
    // 'tagline': 'site.github.project_tagline',
    'description': 'site.github.project_tagline',
    'owner.login': 'site.github.owner_name',
    'owner.html_url': 'site.github.owner_url',
    'owner.avatar_url': 'site.github.owner_gravatar_url',
    'html_url': ['site.github.repository_url', 'site.github.url'],
    // 'nwo': 'site.github.repository_nwo',
    // 'zip_url': 'site.github.zip_url',
    // 'tar_url': 'site.github.tar_url',
    'clone_url': 'site.github.clone_url',
    'releases_url': 'site.github.releases_url',
    'issues_url': 'site.github.issues_url',
    // 'wiki_url': 'site.github.wiki_url',
    'language': 'site.github.language',
    // 'user_page': 'site.github.is_user_page',
    // 'project_page': 'site.github.is_project_page',
    // 'show_downloads': 'site.github.show_downloads',
    // 'baseurl': 'site.github.baseurl'
  };

  setValue(context, 'site.github.hostname', env('PAGES_GITHUB_HOSTNAME', 'github.com'));
  // pages_hostname might be localhost:4000 when in development mode
  // this should be more configurable
  setValue(context, 'site.github.pages_hostname', env('PAGES_PAGES_HOSTNAME', 'github.io'));
  setValue(context, 'site.github.api_url', env('PAGES_API_URL', env('API_URL', 'https://api.github.com')));
  setValue(context, 'site.github.help_url', env('PAGES_HELP_URL', env('HELP_URL','https://help.github.com')));
  setValue(context, 'site.github.environment', env('PAGES_ENV', 'development'));
  setValue(context, 'site.github.pages_env', env('PAGES_ENV', 'development'));
  copyAll(pages, context, pagesProps);
  copyAll(repo, context, repoProps);
  return context;
}

function paged(github, prop, path, options) {
  var opts = extend({}, options);
  return function(context) {
    return new Promise(function(resolve, reject) {
      github.paged(path, opts, function(err, data, res) {
        if (err) {
          reject(err);
          return;
        }
        setValue(context, prop, data);
        resolve(context);
      });
    });
  };
}

function get(github, prop, path, options) {
  var opts = extend({}, options);
  return function(context) {
    return new Promise(function(resolve, reject) {
      github.get(path, opts, function(err, data, res) {
        if (err) {
          reject(err);
          return;
        }
        setValue(context, prop, data);
        resolve(context);
      });
    });
  };
}

function env(key, fallback) {
  return koalas(process.env[key], fallback);
}

function copy(provider, reciever, from, to) {
  if (Array.isArray(to)) {
    to.forEach(function(prop) {
      copy(provider, reciever, from, prop);
    });
    return;
  }
  setValue(reciever, to, getValue(provider, from));
}

function copyAll(provider, reciever, props) {
  var keys = Object.keys(props);
  var len = keys.length;
  for (var i = 0; i < len; i++) {
    var key = keys[i];
    copy(provider, reciever, key, props[key]);
  }
}

/**
example from https://help.github.com/articles/repository-metadata-on-github-pages/
{
  "versions": {
      "jekyll": <version>,
      "kramdown": <version>,
      "liquid": <version>,
      "maruku": <version>,
      "rdiscount": <version>,
      "redcarpet": <version>,
      "RedCloth": <version>,
      "jemoji": <version>,
      "jekyll-mentions": <version>,
      "jekyll-redirect-from": <version>,
      "jekyll-sitemap": <version>,
      "github-pages": <version>,
      "ruby": <version>"
  },
  "hostname": "github.com",
  "pages_hostname": "github.io",
  "api_url": "https://api.github.com",
  "help_url": "https://help.github.com",
  "environment": "dotcom",
  "pages_env": "dotcom",
  "public_repositories": [ Repository Objects ],
  "organization_members": [ User Objects ],
  "build_revision": "cbd866ebf142088896cbe71422b949de7f864bce",
  "project_title": "metadata-example",
  "project_tagline": "A GitHub Pages site to showcase repository metadata",
  "owner_name": "github",
  "owner_url": "https://github.com/github",
  "owner_gravatar_url": "https://github.com/github.png",
  "repository_url": "https://github.com/github/metadata-example",
  "repository_nwo": "github/metadata-example",
  "repository_name": "metadata-example",
  "zip_url": "https://github.com/github/metadata-example/zipball/gh-pages",
  "tar_url": "https://github.com/github/metadata-example/tarball/gh-pages",
  "clone_url": "https://github.com/github/metadata-example.git",
  "releases_url": "https://github.com/github/metadata-example/releases",
  "issues_url": "https://github.com/github/metadata-example/issues",
  "wiki_url": "https://github.com/github/metadata-example/wiki",
  "language": null,
  "is_user_page": false,
  "is_project_page": true,
  "show_downloads": true,
  "url": "http://username.github.io/metadata-example", // (or the CNAME)
  "baseurl": "/metadata-example",
  "contributors": [ User Objects ],
  "releases": [ Release Objects ]
}

**/
