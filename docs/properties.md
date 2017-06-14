## Pages

| key | source | notes |
|:--- |:--- |:--- |
| `ssl` | `env["SSL"] or :test` | check the SSL environment variable or use the value of `:test` |
| `schema` | `:ssl ? "https" : "http"` | |
| `subdomain_isolation` | `env["SUBDOMAIN_ISOLATION"]` | |
| `test` | `:env === "test"` | |
| `dotcom` | `:env === "dotcom"` | |
| `enterprise` | `:env === "enterprise"` | |
| `development` | `:env === "development"` | |
| `custom_domains_enabled` | `:dotcom or :test` | |
| `env` | `env["PAGES_ENV"] or env["JEKYLL_ENV"] or "development"` | |
| `github_url` | `if :dotcom then "https://github.com" else :schema://:github_hostname` | figure out the hostname based on the environment |
| `api_url` | `env["PAGES_API_URL"] or env["API_URL"] or "https://api.github.com"` | |
| `help_url` | `env["PAGES_HELP_URL"] or env["HELP_URL"] or "https://help.github.com"` | |
| `github_hostname` | `env["PAGES_GITHUB_HOSTNAME"] or env["GITHUB_HOSTNAME"] or "github.com"` | |
| `pages_hostname` | `env["PAGES_PAGES_HOSTNAME"] or (if :development then "localhost:4000" else env["PAGES_HOSTNAME"] or "github.io" endif)` | this uses localhost:4000 when in development mode |
| `pages_build` | `env["PAGES_BUILD_ID"]` | only when `env["PAGES_BUILD_ID"]` is not empty |

## Repository

| key | source | notes |
|:--- |:--- |:--- |
| `nwo` | `repository.full_name` | "name with owner" found from git information or from the repositories full name |
| `owner` | `nwo.split('/')[0]` | first part of the nwo |
| `name` | `nwo.split('/')[1]` | last part of the nwo |
| `repository` | `repos/:owner/:name` | repository information downloaded from the github api using the `owner` and `name` |
| `pages_info` | `/repos/:owner/:name/pages` | github pages information for the specified repository downloaded from the github api using the `owner` and `name` |
| `language` | `:repository.language` | |
| `tagline` | `:repository.description` | |
| `owner_url` | `:pages.github_url/:owner` | |
| `owner_gravatar_url` | `:owner_url.png` | |
| `repository_url` | `:owner_url/:name` | |
| `repo_clone_url` | `:repository_url.git` | |
| `zip_url` | `:repository_url/zipball/:git_ref` | |
| `tar_url` | `:repository_url/tarball/:git_ref` | |
| `releases_url` | `:repository_url/releases` | |
| `issues_url` | `:repository_url/issues` | only if `repository.has_issues` is `true` |
| `wiki_url` | `:repository_url/wiki` | only if `repository.has_wiki` is `true` |
| `show_downloads` | `:repository.has_downloads` | |
| `organization_repository` | `/orgs/:owner` | try to get organization information from the github api using the `owner` to determine if the repository belongs to an organization |
| `owner_public_repositories` | `/users/:owner/repos` or `/orgs/:owner/repos` | public repositories for either a user or organization based if the owner is a user or organization |
| `organization_public_members` | `/orgs/:owner/members` | only when `organization_repository` is `true` |
| `contributors` | `/repos/:owner/:repo/contributors` | |
| `releases` | `/repos/:owner/:repo/releases` | |
| `git_ref` | `:pages_info.source.branch` or `master` or `gh-pages` | if `:pages_info.source` then use the `branch`, otherwise when the repo is a `user_page` then use `master` or else use `gh-pages` |
| `user_page` | `:primary` | |
| `project_page` | not `:user_page` | |
| `github_repo` | not `:pages.enterprise` and `:owner === 'github'` | |
| `primary` | `:pages.enterprise ? (:name === :owner.:pages.github_hostname) : user_page_domains.has(name)` | figure out if the repository is for an owner or if it's for a specific "project" or repository |
| `user_page_domains` | `[:default_user_domain, :owner.github.com]` | `:owner.github.com` is only added if `:pages.enterprise` is `false` |
| `default_user_domain` | `if :github_repo then :owner.:pages.github_hostname else if :pages.enterprise then :pages.pages_hostname else :owner.:pages.pages_hostname` | |
| `cname` | `:pages_info.cname` | only when `pages.custom_domains_enabled` is `true` |
| `html_url` | `:pages_info.html_url` | |
| `uri` | `url.parse(:html_url)` | parse the `html_url` into a `uri` object |
| `url_without_path` | `url.stringify(omit(uri, 'path'))` | |
| `domain` | `:uri.host` | |
| `url_schema` | `:uri.schema` | |
| `baseurl` | `:uri.path` | |

