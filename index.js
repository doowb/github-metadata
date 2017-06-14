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
    .then(pagedData('site.github.public_repositories', '/orgs/:owner/repos', opts))
    .then(pagedData('site.github.organization_members', '/orgs/:owner/members', opts))
    .then(pagedData('site.github.contributors', '/repos/:owner/:repo/contributors', opts))
    .then(pagedData('site.github.collaborators', '/repos/:owner/:repo/collaborators', opts))
    .then(pagedData('site.github.branches', '/repos/:owner/:repo/branches', opts))
    .then(getData('site.github.languages', '/repos/:owner/:repo/languages', opts))
    .then(pagedData('site.github.teams', '/repos/:owner/:repo/teams', opts))
    .then(pagedData('site.github.releases', '/repos/:owner/:repo/releases', opts))
    .then(pagedData('site.github.tags', '/repos/:owner/:repo/tags', opts))
    .then(getData('site.github.repository', '/repos/:owner/:repo', opts))
    .then(getData('site.github.pages_info', '/repos/:owner/:repo/pages', opts))
    .then(createPagesData(opts))
    .then(copyProperties(opts))
    .then(function(context) {
      cb(null, context);
    })
    .catch(cb);
};

function createPagesData(options) {
  var opts = extend({}, options);
  return function(context) {
    var pages = {};
    setValue(pages, 'env', env('PAGES_ENV', env('JEKYLL_ENV', 'development')));
    setValue(pages, 'test', pages.env === 'test');
    setValue(pages, 'dotcom', pages.env === 'dotcom');
    setValue(pages, 'enterprise', pages.env === 'enterprise');
    setValue(pages, 'development', pages.env === 'development');
    setValue(pages, 'ssl', env('SSL', pages.test));
    setValue(pages, 'schema', pages.ssl ? 'https' : 'http');
    setValue(pages, 'subdomain_isolation', env('SUBDOMAIN_ISOLATION'));
    setValue(pages, 'custom_domains_enabled', pages.dotcom || pages.test);
    setValue(pages, 'github_hostname', env('PAGES_GITHUB_HOSTNAME', env('GITHUB_HOSTNAME', 'github.com')));
    setValue(pages, 'pages_hostname', env('PAGES_PAGES_HOSTNAME', pages.development ? 'localhost:4000' : env('PAGES_HOSTNAME', 'github.io')));
    setValue(pages, 'github_url', pages.dotcom ? 'https://github.com' : `${pages.schema}://${pages.github_hostname}`);
    setValue(pages, 'api_url', env('PAGES_API_URL', env('API_URL', 'https://api.github.com')));
    setValue(pages, 'help_url', env('PAGES_HELP_URL', env('HELP_URL', 'https://help.github.com')));
    setValue(pages, 'pages_build', env('PAGES_BUILD_ID'));

    setValue(context, 'site.github.pages', pages);
    return context;
  };
}

function copyProperties(options) {
  var opts = extend({}, options);
  return function(context) {
    var pages = extend({}, getValue(context, 'site.github.pages'));
    var pagesProps = {
      'github_hostname': 'site.github.hostname',
      'pages_hostname': 'site.github.pages_hostname',
      'api_url': 'site.github.api_url',
      'help_url': 'site.github.help_url',
      'env': ['site.github.environment', 'site.github.pages_env']
    };

    var pagesInfo = extend({}, getValue(context, 'site.github.pages_info'));
    var pagesInfoProps = {
      cname: 'site.github.url'
    };

    var repo = extend({}, getValue(context, 'site.github.repository'));
    var repoProps = {
      'name': ['site.github.project_title', 'site.github.repository_name'],
      'full_name': 'site.github.repository_nwo',
      'description': 'site.github.project_tagline',
      'owner.login': 'site.github.owner_name',
      'owner.avatar_url': 'site.github.owner_gravatar_url',
      'html_url': ['site.github.repository_url', 'site.github.url'],
      'language': 'site.github.language',
      'has_downloads': 'site.github.show_downloads'
    };

    copyAll(pages, context, pagesProps);
    copyAll(pagesInfo, context, pagesInfoProps);
    copyAll(repo, context, repoProps);

    setValue(context, 'site.github.owner_url', `${getValue(pages, 'github_url')}/${opts.owner}`);
    setValue(context, 'site.github.owner_gravatar_url', `${getValue(context, 'site.github.owner_url')}.png}`);

    var githubRepo = !pages.enterprise && opts.owner === 'github';
    var defaultUserDomain = githubRepo
      ? `${opts.owner}.${pages.github_hostname}`
      : (pages.enterprise ? pages.pages_hostname : `${opts.owner}.${pages.pages_hostname}`);

    var userPageDomains = [defaultUserDomain];
    if (pages.enterprise === false) {
      userPageDomains.push(`${opts.owner}.github.com`);
    }

    var primary = pages.enterprise
      ? repo.name.toLowerCase() === `${opts.owner.toLowerCase()}.${pages.github_hostname}`
      : userPageDomains.indexOf(repo.name.toLowerCase()) !== -1;

    var userPage = primary;
    var repoUrl = `${getValue(context, 'site.github.owner_url')}/${repo.name}`;
    var gitRef = koalas(getValue(pagesInfo, 'source.branch'), userPage ? 'master' : 'gh_pages');

    setValue(context, 'site.github.zip_url', `${repoUrl}/zipball/${gitRef}`);
    setValue(context, 'site.github.tar_url', `${repoUrl}/tarball/${gitRef}`);
    setValue(context, 'site.github.clone_url', `${repoUrl}.git`);
    setValue(context, 'site.github.releases_url', `${repoUrl}/releases`);
    setValue(context, 'site.github.issues_url', `${repoUrl}/issues`);
    if (repo.has_wiki) {
      setValue(context, 'site.github.wiki_url', `${repoUrl}/wiki`);
    }
    setValue(context, 'site.github.is_user_page', userPage);
    setValue(context, 'site.github.is_project_page', !userPage);
    return context;
  };
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
