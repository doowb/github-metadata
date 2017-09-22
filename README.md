# github-metadata [![NPM version](https://img.shields.io/npm/v/github-metadata.svg?style=flat)](https://www.npmjs.com/package/github-metadata) [![NPM monthly downloads](https://img.shields.io/npm/dm/github-metadata.svg?style=flat)](https://npmjs.org/package/github-metadata)  [![NPM total downloads](https://img.shields.io/npm/dt/github-metadata.svg?style=flat)](https://npmjs.org/package/github-metadata) [![Linux Build Status](https://img.shields.io/travis/doowb/github-metadata.svg?style=flat&label=Travis)](https://travis-ci.org/doowb/github-metadata) [![Windows Build Status](https://img.shields.io/appveyor/ci/doowb/github-metadata.svg?style=flat&label=AppVeyor)](https://ci.appveyor.com/project/doowb/github-metadata)

> Gather GitHub metadata about a repository.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save github-metadata
```

Install with [yarn](https://yarnpkg.com):

```sh
$ yarn add github-metadata
```

## Usage

```js
var metadata = require('github-metadata');
```

## API

### [metadata](index.js#L45)

Gather GitHub metadata for the specified repository. This attempts to get the same metadata that's used by Jekyll and specified in the [Github docs](https://help.github.com/articles/repository-metadata-on-github-pages/). Some of the metadata requires authenticating which requires either passing a `username` and `password` or `token` on the `options` object. It's best to use a [personal access token](https://github.com/settings/tokens) from GitHub. See the [results](#results) section to see what the returned metadata object looks like

**Params**

* `options` **{Object}**: Options object containing authentication and repository details.
* `options.owner` **{String}**: The user or organization that owns the repository. This is the first path segment after "https://github.com/".
* `options.repo` **{String}**: The repository name to get metadata for. This is the second path segment after "https://github.com/".
* `options.exclude` **{Array}**: Optionally pass a list of top-level properties to exclude from the metadata by not downloading it from GitHub.
* `options.username` **{String}**: Optionally supply a GitHub username for authentication. This is only necessary when using `username/password` for authentication.
* `options.password` **{String}**: Optionally supply a GitHub password for authentication. This is only necessary when using `username/password` for authentication.
* `options.token` **{String}**: Optionally supply a GitHub [personal access token](https://github.com/settings/tokens) for authentication. This is only necessary with using oauth (instead of `username/password`) for authentication.
* `returns` **{Promise}**: Returns a Promise that will have the repositories metadata when resolved.

**Example**

```js
var options = {
  token: 'XXXXXXXXXX' // get this from GitHub,
  owner: 'doowb',
  repo: 'github-metadata'
};

metadata(options)
  .then(function(data) {
    console.log(data);
    //=> {
    //=>   // this object contains all of the metadata that was gather from GitHub
    //=> }
  })
  .catch(console.error);
```

## Results

The following object represents the GitHub metadata that is returned for the [assemble/assemble](https://github.com/assemble/assemble) repository. The items from the properties that contain long arrays have been removed and replaced with `...`. See the [full JSON object](docs/results.json) and the [GitHub API documentation](https://developer.github.com/v3/) for more information about the items in those arrays.

```js
{
  "public_repositories": [
    ...
  ],
  "organization_members": [
    ...
  ],
  "contributors": [
    ...
  ],
  "collaborators": [
    ...
  ],
  "branches": [
    ...
  ],
  "languages": {
    "CSS": 483616,
    "JavaScript": 102873,
    "HTML": 44790
  },
  "teams": [
    ...
  ],
  "releases": [
    ...
  ],
  "tags": [
    ...
  ],
  "repository": {
    "id": 5916767,
    "name": "assemble",
    "full_name": "assemble/assemble",
    "owner": {
      "login": "assemble",
      "id": 2645080,
      "avatar_url": "https://avatars3.githubusercontent.com/u/2645080?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/assemble",
      "html_url": "https://github.com/assemble",
      "followers_url": "https://api.github.com/users/assemble/followers",
      "following_url": "https://api.github.com/users/assemble/following{/other_user}",
      "gists_url": "https://api.github.com/users/assemble/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/assemble/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/assemble/subscriptions",
      "organizations_url": "https://api.github.com/users/assemble/orgs",
      "repos_url": "https://api.github.com/users/assemble/repos",
      "events_url": "https://api.github.com/users/assemble/events{/privacy}",
      "received_events_url": "https://api.github.com/users/assemble/received_events",
      "type": "Organization",
      "site_admin": false
    },
    "private": false,
    "html_url": "https://github.com/assemble/assemble",
    "description": "Static site generator and rapid prototyping framework for Node.js, Grunt.js, and Yeoman and Gulp. Render templates with Handlebars, Lo-Dash or any template engine. Used by Less.js / lesscss.org, Topcoat, Web Experience Toolkit, and hundreds of other projects to build sites, themes, components, documentation, blogs and gh-pages.",
    "fork": false,
    "url": "https://api.github.com/repos/assemble/assemble",
    "forks_url": "https://api.github.com/repos/assemble/assemble/forks",
    "keys_url": "https://api.github.com/repos/assemble/assemble/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/assemble/assemble/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/assemble/assemble/teams",
    "hooks_url": "https://api.github.com/repos/assemble/assemble/hooks",
    "issue_events_url": "https://api.github.com/repos/assemble/assemble/issues/events{/number}",
    "events_url": "https://api.github.com/repos/assemble/assemble/events",
    "assignees_url": "https://api.github.com/repos/assemble/assemble/assignees{/user}",
    "branches_url": "https://api.github.com/repos/assemble/assemble/branches{/branch}",
    "tags_url": "https://api.github.com/repos/assemble/assemble/tags",
    "blobs_url": "https://api.github.com/repos/assemble/assemble/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/assemble/assemble/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/assemble/assemble/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/assemble/assemble/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/assemble/assemble/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/assemble/assemble/languages",
    "stargazers_url": "https://api.github.com/repos/assemble/assemble/stargazers",
    "contributors_url": "https://api.github.com/repos/assemble/assemble/contributors",
    "subscribers_url": "https://api.github.com/repos/assemble/assemble/subscribers",
    "subscription_url": "https://api.github.com/repos/assemble/assemble/subscription",
    "commits_url": "https://api.github.com/repos/assemble/assemble/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/assemble/assemble/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/assemble/assemble/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/assemble/assemble/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/assemble/assemble/contents/{+path}",
    "compare_url": "https://api.github.com/repos/assemble/assemble/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/assemble/assemble/merges",
    "archive_url": "https://api.github.com/repos/assemble/assemble/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/assemble/assemble/downloads",
    "issues_url": "https://api.github.com/repos/assemble/assemble/issues{/number}",
    "pulls_url": "https://api.github.com/repos/assemble/assemble/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/assemble/assemble/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/assemble/assemble/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/assemble/assemble/labels{/name}",
    "releases_url": "https://api.github.com/repos/assemble/assemble/releases{/id}",
    "deployments_url": "https://api.github.com/repos/assemble/assemble/deployments",
    "created_at": "2012-09-22T20:50:23Z",
    "updated_at": "2017-06-15T01:09:31Z",
    "pushed_at": "2017-05-20T00:33:33Z",
    "git_url": "git://github.com/assemble/assemble.git",
    "ssh_url": "git@github.com:assemble/assemble.git",
    "clone_url": "https://github.com/assemble/assemble.git",
    "svn_url": "https://github.com/assemble/assemble",
    "homepage": "http://assemble.io/",
    "size": 13050,
    "stargazers_count": 3350,
    "watchers_count": 3350,
    "language": "CSS",
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "forks_count": 225,
    "mirror_url": null,
    "open_issues_count": 26,
    "forks": 225,
    "open_issues": 26,
    "watchers": 3350,
    "default_branch": "master",
    "permissions": {
      "admin": true,
      "push": true,
      "pull": true
    },
    "allow_squash_merge": true,
    "allow_merge_commit": true,
    "allow_rebase_merge": true,
    "organization": {
      "login": "assemble",
      "id": 2645080,
      "avatar_url": "https://avatars3.githubusercontent.com/u/2645080?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/assemble",
      "html_url": "https://github.com/assemble",
      "followers_url": "https://api.github.com/users/assemble/followers",
      "following_url": "https://api.github.com/users/assemble/following{/other_user}",
      "gists_url": "https://api.github.com/users/assemble/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/assemble/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/assemble/subscriptions",
      "organizations_url": "https://api.github.com/users/assemble/orgs",
      "repos_url": "https://api.github.com/users/assemble/repos",
      "events_url": "https://api.github.com/users/assemble/events{/privacy}",
      "received_events_url": "https://api.github.com/users/assemble/received_events",
      "type": "Organization",
      "site_admin": false
    },
    "network_count": 225,
    "subscribers_count": 121
  },
  "pages_info": {
    "message": "Not Found",
    "documentation_url": "https://developer.github.com/v3"
  },
  "pages": {
    "env": "development",
    "test": false,
    "dotcom": false,
    "enterprise": false,
    "development": true,
    "ssl": false,
    "schema": "http",
    "custom_domains_enabled": false,
    "github_hostname": "github.com",
    "pages_hostname": "localhost:4000",
    "github_url": "http://github.com",
    "api_url": "https://api.github.com",
    "help_url": "https://help.github.com"
  },
  "hostname": "github.com",
  "pages_hostname": "localhost:4000",
  "api_url": "https://api.github.com",
  "help_url": "https://help.github.com",
  "environment": "development",
  "pages_env": "development",
  "url": "https://github.com/assemble/assemble",
  "project_title": "assemble",
  "repository_name": "assemble",
  "repository_nwo": "assemble/assemble",
  "project_tagline": "Static site generator and rapid prototyping framework for Node.js, Grunt.js, and Yeoman and Gulp. Render templates with Handlebars, Lo-Dash or any template engine. Used by Less.js / lesscss.org, Topcoat, Web Experience Toolkit, and hundreds of other projects to build sites, themes, components, documentation, blogs and gh-pages.",
  "owner_name": "assemble",
  "owner_gravatar_url": "http://github.com/assemble.png}",
  "repository_url": "https://github.com/assemble/assemble",
  "language": "CSS",
  "show_downloads": true,
  "owner_url": "http://github.com/assemble",
  "zip_url": "http://github.com/assemble/assemble/zipball/gh_pages",
  "tar_url": "http://github.com/assemble/assemble/tarball/gh_pages",
  "clone_url": "http://github.com/assemble/assemble.git",
  "releases_url": "http://github.com/assemble/assemble/releases",
  "issues_url": "http://github.com/assemble/assemble/issues",
  "wiki_url": "http://github.com/assemble/assemble/wiki",
  "is_user_page": false,
  "is_project_page": true
}
```

## About

### Related projects

* [assemble](https://www.npmjs.com/package/assemble): Get the rocks out of your socks! Assemble makes you fast at creating web projects… [more](https://github.com/assemble/assemble) | [homepage](https://github.com/assemble/assemble "Get the rocks out of your socks! Assemble makes you fast at creating web projects. Assemble is used by thousands of projects for rapid prototyping, creating themes, scaffolds, boilerplates, e-books, UI components, API documentation, blogs, building websit")
* [github-base](https://www.npmjs.com/package/github-base): JavaScript wrapper that greatly simplifies working with GitHub's API. | [homepage](https://github.com/jonschlinkert/github-base "JavaScript wrapper that greatly simplifies working with GitHub's API.")

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

Please read the [contributing guide](.github/contributing.md) for advice on opening issues, pull requests, and coding standards.

### Building docs

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

### Running tests

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

### Author

**Brian Woodward**

* [github/doowb](https://github.com/doowb)
* [twitter/doowb](https://twitter.com/doowb)

### License

Copyright © 2017, [Brian Woodward](https://doowb.com).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.6.0, on September 21, 2017._