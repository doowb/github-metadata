'use strict';

var extend = require('extend-shallow');
var GitHub = require('github-base');
var setValue = require('set-value');
var getValue = require('get-value');
var koalas = require('koalas');

/**
 * Gather GitHub metadata for the specified repository. This attempts to get the same metadata
 * that's used by Jekyll and specified in the [Github docs](https://help.github.com/articles/repository-metadata-on-github-pages/).
 * Some of the metadata requires authenticating which requires either passing a `username` and `password` or `token` on the `options` object.
 * It's best to use a [personal access token](https://github.com/settings/tokens) from GitHub.
 * See the [results](#results) section to see what the returned metadata object looks like
 *
 * ```js
 * var options = {
 *   token: 'XXXXXXXXXX' // get this from GitHub,
 *   owner: 'doowb',
 *   repo: 'github-metadata'
 * };
 *
 * metadata(options, function(err, data) {
 *   if (err) {
 *     console.error(err);
 *     return;
 *   }
 *   console.log(data);
 *   //=> {
 *   //=>   site: {
 *   //=>     github: {
 *   //=>       // this object contains all of the metadata that was gather from GitHub
 *   //=>     }
 *   //=>   }
 *   //=> }
 * });
 * ```
 *
 * @name metadata
 * @param  {Object} `options` Options object containing authentication and repository details.
 * @param  {String} `options.owner` The user or organization that owns the repository. This is the first path segment after "https://github.com/".
 * @param  {String} `options.repo` The repository name to get metadata for. This is the second path segment after "https://github.com/".
 * @param  {String} `options.username` Optionally supply a GitHub username for authentication. This is only necessary when using `username/password` for authentication.
 * @param  {String} `options.password` Optionally supply a GitHub password for authentication. This is only necessary when using `username/password` for authentication.
 * @param  {String} `options.token` Optionally supply a GitHub [personal access token](https://github.com/settings/tokens) for authentication. This is only necessary with using oauth (instead of `username/password`) for authentication.
 * @param  {Function} `cb` Callback function that will receive `err` and `data` arguments. `err` will be undefined if there were no errors.
 * @api public
 */

module.exports = function(options, cb) {
  var opts = extend({}, options);
  var context = {};

  var github = new GitHub(options);
  var pagedData = paged.bind(null, github);
  var getData = get.bind(null, github);

  Promise.resolve(context)
    .then(orgData(github, opts))
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

/**
 * Determine if the `owner` is an organization or not.
 * Get the public repositories for the `owner` and the organization members
 * if the `owner` is an organization.
 *
 * @param  {Object} `github` github-base instance
 * @param  {Object} `options` Options with `owner` property
 * @return {Function} Returns a function to be used in the Promise chain that takes a `context` to populate with information
 */

function orgData(github, options) {
  var opts = extend({}, options);
  return function(context) {
    return Promise.resolve({})
      .then(get(github, 'org', '/orgs/:owner', opts))
      .then(function(orgInfo) {
        var err = getValue(orgInfo, 'org.message');
        if (err && err === 'Not Found') {
          return Promise.resolve(context)
            .then(paged(github, 'site.github.public_repositories', '/users/:owner/repos', opts));
        }

        return Promise.resolve(context)
          .then(paged(github, 'site.github.public_repositories', '/orgs/:owner/repos', opts))
          .then(paged(github, 'site.github.organization_members', '/orgs/:owner/members', opts));
      });
  };
}

/**
 * Gather `pages` data from the environment to be used in other places.
 *
 * @param  {Object} `options` Options to be used in computed values.
 * @return {Function} Returns a function to be used in the Promise chain. The function takes a context to add computed values to
 */

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

/**
 * Copy properties from objects on the `context` to other properties on the `context`.
 * The new properties are the normalized values that github pages would expected.
 *
 * @param  {Object} `options` Options used when computing values.
 * @return {Function} Returns a function to be used in the Promise chain. The function takes a context to add computed values to.
 */

function copyProperties(options) {
  var opts = extend({}, options);
  return function(context) {

    // setup properties to be copied from the `pages` object (created above)
    var pages = extend({}, getValue(context, 'site.github.pages'));
    var pagesProps = {
      'github_hostname': 'site.github.hostname',
      'pages_hostname': 'site.github.pages_hostname',
      'api_url': 'site.github.api_url',
      'help_url': 'site.github.help_url',
      'env': ['site.github.environment', 'site.github.pages_env']
    };

    // setup properties to be copied from the `pages_info` object (downloaded from github)
    var pagesInfo = extend({}, getValue(context, 'site.github.pages_info'));
    var pagesInfoProps = {
      cname: 'site.github.url'
    };

    // setup properties to be copied from the `repository` object (downloaded from github)
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

    // copy all of the properties setup above
    copyAll(pages, context, pagesProps);
    copyAll(pagesInfo, context, pagesInfoProps);
    copyAll(repo, context, repoProps);

    // compute intermidate variables to be used in computed properties
    var ownerUrl = `${getValue(pages, 'github_url')}/${opts.owner}`;
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
    var repoUrl = `${ownerUrl}/${repo.name}`;
    var gitRef = koalas(getValue(pagesInfo, 'source.branch'), userPage ? 'master' : 'gh_pages');

    // set computed properties
    setValue(context, 'site.github.owner_url', ownerUrl);
    setValue(context, 'site.github.owner_gravatar_url', `${ownerUrl}.png}`);
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

/**
 * Get paged results from the github api.
 * Use this when the expected value from github is an array of items.
 *
 * ```js
 * Promise.resolve({})
 *   .then(paged(github, 'repositories', '/users/:owner/repos', {owner: 'doowb'}))
 *   .then(function(context) {
 *     console.log(context);
 *     //=> {repositories: [ ... ]}
 *   });
 * ```
 * @param  {Object} `github` github-base instance.
 * @param  {String} `prop` Property to use when setting the results on the context.
 * @param  {String} `path` github api path to use to get results.
 * @param  {Object} `options` Options used for replacing path placeholders.
 * @return {Function} Returns a function to be used in a Promise chain. Takes a `context` object to set the results on.
 */

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

/**
 * Get results from the github api.
 * Use this when the expected value from github is an object (for a single item).
 *
 * ```js
 * Promise.resolve({})
 *   .then(paged(github, 'org', '/orgs/:owner', {owner: 'assemble'}))
 *   .then(function(context) {
 *     console.log(context);
 *     //=> {org: { ... }}
 *   });
 * ```
 * @param  {Object} `github` github-base instance.
 * @param  {String} `prop` Property to use when setting the results on the context.
 * @param  {String} `path` github api path to use to get results.
 * @param  {Object} `options` Options used for replacing path placeholders.
 * @return {Function} Returns a function to be used in a Promise chain. Takes a `context` object to set the results on.
 */

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

/**
 * Helper function for getting a value from `process.env` or using the provided `fallback`.
 *
 * ```js
 * var val = env('GITHUB_HOSTNAME', 'github.com');
 * ```
 * @param  {String} `key` key used to lookup a value from `process.env`.
 * @param  {Mixed} `fallback` Default to fallback on when the value is not on `process.env`.
 * @return {Mixed} Either the value if found on `process.env` or the `fallback`.
 */

function env(key, fallback) {
  return koalas(process.env[key], fallback);
}

/**
 * Copy a property from the `provider` to the `receiver`.
 *
 * @param  {Object} `provider` Object with the property being copied.
 * @param  {Object} `receiver` Object that will receive the copied property.
 * @param  {String} `from` Name of the property to copy from the provider.
 * @param  {String|Array} `to` Name of the property or properties to set on the receiver.
 */

function copy(provider, receiver, from, to) {
  if (Array.isArray(to)) {
    to.forEach(function(prop) {
      copy(provider, receiver, from, prop);
    });
    return;
  }
  setValue(receiver, to, getValue(provider, from));
}

/**
 * Copy many properties from the provider to the receiver.
 *
 * @param  {Object} `provider` Object with the properties to copy.
 * @param  {Object} `receiver` Object that will receive the properties.
 * @param  {Object} `props` Object of `from` => `to` properties to copy many properties.
 */

function copyAll(provider, receiver, props) {
  var keys = Object.keys(props);
  var len = keys.length;
  for (var i = 0; i < len; i++) {
    var key = keys[i];
    copy(provider, receiver, key, props[key]);
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
