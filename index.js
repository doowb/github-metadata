'use strict';

var GitHubContent = require('github-content');
var extend = require('extend-shallow');
var GitHub = require('github-base');
var setValue = require('set-value');
var getValue = require('get-value');
var koalas = require('koalas');
var https = require('https');

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
 * metadata(options)
 *   .then(function(data) {
 *     console.log(data);
 *     //=> {
 *     //=>   // this object contains all of the metadata that was gather from GitHub
 *     //=> }
 *   })
 *   .catch(console.error);
 * ```
 *
 * @param  {Object} `options` Options object containing authentication and repository details.
 * @param  {String} `options.owner` The user or organization that owns the repository. This is the first path segment after "https://github.com/".
 * @param  {String} `options.repo` The repository name to get metadata for. This is the second path segment after "https://github.com/".
 * @param  {Array}  `options.exclude` Optionally pass a list of top-level properties to exclude from the metadata by not downloading it from GitHub.
 * @param  {String} `options.username` Optionally supply a GitHub username for authentication. This is only necessary when using `username/password` for authentication.
 * @param  {String} `options.password` Optionally supply a GitHub password for authentication. This is only necessary when using `username/password` for authentication.
 * @param  {String} `options.token` Optionally supply a GitHub [personal access token](https://github.com/settings/tokens) for authentication. This is only necessary with using oauth (instead of `username/password`) for authentication.
 * @return {Promise} Returns a Promise that will have the repositories metadata when resolved.
 * @api public
 */

module.exports = function metadata(options) {
  var opts = extend({}, options);
  var context = {};

  var github = new GitHub(opts);
  var content = new GitHubContent(opts);
  var pagedData = paged.bind(null, github);
  var getData = get.bind(null, github);

  return repoExists(`https://github.com/${opts.owner}/${opts.repo}`)
    .then(function(exists) {
      if (exists === false) {
        throw new Error(`Unable to find repository "${opts.owner}/${opts.repo}"`);
      }
      return context;
    })
    .then(orgData(github, opts))
    .then(pagedData('contributors', '/repos/:owner/:repo/contributors', opts))
    .then(pagedData('collaborators', '/repos/:owner/:repo/collaborators', opts))
    .then(pagedData('branches', '/repos/:owner/:repo/branches', opts))
    .then(getData('languages', '/repos/:owner/:repo/languages', opts))
    .then(pagedData('teams', '/repos/:owner/:repo/teams', opts))
    .then(pagedData('releases', '/repos/:owner/:repo/releases', opts))
    .then(pagedData('tags', '/repos/:owner/:repo/tags', opts))
    .then(getData('repository', '/repos/:owner/:repo', opts))
    .then(getData('pages_info', '/repos/:owner/:repo/pages', opts))
    .then(file(content, 'package', 'package.json', opts))
    .then(createPagesData(opts))
    .then(copyProperties(opts));
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
    if (exclude('org', opts)) {
      return Promise.resolve(context);
    }

    return Promise.resolve({})
      .then(get(github, 'org', '/orgs/:owner', opts))
      .then(function(orgInfo) {
        var err = getValue(orgInfo, 'org.message');
        if (err && err === 'Not Found') {
          return Promise.resolve(context)
            .then(paged(github, 'public_repositories', '/users/:owner/repos', opts));
        }

        return Promise.resolve(context)
          .then(paged(github, 'public_repositories', '/orgs/:owner/repos', opts))
          .then(paged(github, 'organization_members', '/orgs/:owner/members', opts));
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
    setValue(pages, 'pages_hostname', env('PAGES_PAGES_HOSTNAME', env('PAGES_HOSTNAME', 'github.io')));
    setValue(pages, 'github_url', pages.dotcom ? 'https://github.com' : `${pages.schema}://${pages.github_hostname}`);
    setValue(pages, 'api_url', env('PAGES_API_URL', env('API_URL', 'https://api.github.com')));
    setValue(pages, 'help_url', env('PAGES_HELP_URL', env('HELP_URL', 'https://help.github.com')));
    setValue(pages, 'pages_build', env('PAGES_BUILD_ID'));

    setValue(context, 'pages', pages);
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
    var pages = extend({}, getValue(context, 'pages'));
    var pagesProps = {
      'github_hostname': 'hostname',
      'pages_hostname': 'pages_hostname',
      'api_url': 'api_url',
      'help_url': 'help_url',
      'env': ['environment', 'pages_env']
    };

    // setup properties to be copied from the `pages_info` object (downloaded from github)
    var pagesInfo = extend({}, getValue(context, 'pages_info'));
    var pagesInfoProps = {
      cname: 'url'
    };

    // setup properties to be copied from the `repository` object (downloaded from github)
    var repo = extend({}, getValue(context, 'repository'));
    var repoProps = {
      'name': ['project_title', 'repository_name'],
      'full_name': 'repository_nwo',
      'owner.login': 'owner_name',
      'owner.avatar_url': 'owner_gravatar_url',
      'html_url': ['repository_url', 'url'],
      'language': 'language',
      'has_downloads': 'show_downloads'
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
    setValue(context, 'project_tagline', koalas(getValue(repo, 'description'), ''));
    setValue(context, 'owner_url', ownerUrl);
    setValue(context, 'owner_gravatar_url', `${ownerUrl}.png}`);
    setValue(context, 'zip_url', `${repoUrl}/zipball/${gitRef}`);
    setValue(context, 'tar_url', `${repoUrl}/tarball/${gitRef}`);
    setValue(context, 'clone_url', `${repoUrl}.git`);
    setValue(context, 'releases_url', `${repoUrl}/releases`);
    setValue(context, 'issues_url', `${repoUrl}/issues`);
    if (repo.has_wiki) {
      setValue(context, 'wiki_url', `${repoUrl}/wiki`);
    }
    setValue(context, 'is_user_page', userPage);
    setValue(context, 'is_project_page', !userPage);
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
      if (exclude(prop, opts)) {
        resolve(context);
        return;
      }

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
      if (exclude(prop, opts)) {
        resolve(context);
        return;
      }

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
 * Get a file from GitHub content
 *
 * ```js
 * Promise.resolve({})
 *   .then(file(content, 'package', 'package.json', {owner: 'assemble', repo: 'assemble'}))
 *   .then(function(context) {
 *     console.log(context);
 *     //=> {package: { ... }}
 *   });
 * ```
 * @param  {Object} `github` github-content instance.
 * @param  {String} `prop` Property to use when setting the results on the context.
 * @param  {String} `path` github content path to use to get the file.
 * @param  {Object} `options` Options used for replacing path placeholders.
 * @return {Function} Returns a function to be used in a Promise chain. Takes a `context` object to set the results on.
 */

function file(github, prop, path, options) {
  var opts = extend({}, options);
  return function(context) {
    return new Promise(function(resolve, reject) {
      if (exclude(prop, opts)) {
        resolve(context);
        return;
      }

      github.file(path, opts, function(err, res) {
        if (err) {
          reject(err);
          return;
        }
        setValue(context, prop, transform(res));
        resolve(context);
      });
    });
  };
}

/**
 * Transform function used in `file` to transform the contents from the
 * results object into a JavaScript object. If the file was not found
 * an empty object is returned.
 *
 * @param  {Object} `res` results from `file` with `path` and `contents` properties.
 * @return {Object} The resulting object of calling `JSON.parse` on `res.contents`.
 */

function transform(res) {
  var contents = res.contents.toString();
  if (contents.indexOf('404:') === 0) {
    return {};
  }
  try {
    return JSON.parse(contents);
  } catch (err) {
    return {};
  }
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
 * Checks if a repository exists.
 *
 * @param  {String} `url` Repository url to check.
 * @param  {Function} `cb` Callback with `err` and `exists` arguments.
 */

function repoExists(url) {
  return new Promise(function(resolve) {
    https.get(url, function(res) {
      resolve(String(res.statusCode) !== '404');
    }).on('error', function(err) {
      resolve(false);
    });
  });
}

function exclude(prop, options) {
  if (typeof options.exclude === 'undefined' || !Array.isArray(options.exclude)) {
    return false;
  }

  return options.exclude.indexOf(prop) !== -1;
}
