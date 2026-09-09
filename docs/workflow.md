# Authoring and publishing workflow

One repository. Four commands.

```
scripts/new-post "Title"   ->   edit markdown   ->   scripts/preview   ->   scripts/publish <slug>
```

Nothing else. No local build to copy, no second repository to push to, no
`deploy.sh`.

## Where things live

```
_drafts/          unpublished posts (drafts branch only), never built
_posts/           published posts, YYYY-MM-DD-slug.md
_layouts/         home.html, post.html
_includes/        head, header, footer, toc, search, post-meta, youtube-embed,
                  toggles
_sass/            custom-dark.scss
assets/           main.scss, js/, images/
scripts/          new-post, preview, publish, validate
docs/             this file (excluded from the build)
*.html            the index pages: abstracts, series, categories, tags,
                  index-all, search
```

## The four commands

### `scripts/new-post "Recursive Language Models"`

Run from the `drafts` branch; it refuses elsewhere. Creates
`_drafts/recursive-language-models.md` with the full front matter template,
including the optional `series` / `papers` / `repo_url` / `video_url` fields
commented out. Drafts carry no date --- the date is assigned at publish time, so
a draft that sits for three weeks does not publish with a stale date.

### `scripts/preview`

Serves the site at <http://localhost:5907> with `--drafts --future --livereload`,
so you see unpublished and future-dated posts alongside the real ones. This is
strictly more than the public site shows.

`scripts/preview --no-drafts` shows exactly what a visitor gets.

### `scripts/publish <slug> [YYYY-MM-DD]`

Moves `_drafts/<slug>.md` on `drafts` to `_posts/<date>-<slug>.md` on `main`,
sets the date in the front matter, runs `scripts/validate`, commits, and pushes
both branches. Refuses to run with uncommitted draft edits, which would
otherwise publish a stale version. With no date it publishes today. With a
future date it schedules (see below).

`scripts/publish --list` shows what is currently in `_drafts/`.

### `scripts/validate`

Front matter lint. Runs automatically inside `publish` and again in CI. Checks
that every post has a title, date, and abstract; that the filename date matches
the front matter date; that a post with a `series` also has a `series_part`
(without it, `series.html` sorts nil against Integer and the whole build dies);
and that the time of day will not make a *scheduled* post slip a day.

## Front matter that drives the indexes

Most indexes build themselves from the posts collection: home, abstracts,
series, categories, tags, `search.json`, `feed.xml`, `sitemap.xml`, and the
Alphabetical, Chronological and KWIC tabs of `/index-all/`. Write a post and it
appears in all of them.

Three tabs on `/index-all/` do **not** work that way. They are built purely from
front matter:

| Tab | Built from |
|-----|-----------|
| Code | `repo_url`, or `repo_urls` (a list of `{url, title}`) |
| Videos | `video_url` + `video_title`, or `video_urls` + `video_titles` |
| Papers | `papers` (a list of `{title, url}`) |

A post that links a repository in its prose but declares no `repo_url` is simply
absent from the Code tab. Nothing fails --- the post builds, renders, and reaches
every other index --- so the gap stays invisible until someone opens the tab and
notices a project missing. This has already happened once, to four posts at
once.

`scripts/validate` now warns when a post's body links a GitHub repository or a
video but the matching front matter is absent. It is a warning, not an error,
because not every link in a body is the post's own project.

## How publishing actually works

A post is public when it is a file in `_posts/` with a date in the past, on
`main`. That is the entire gate. There is no `published:` flag and no separate
deploy step.

Pushing to `main` triggers `.github/workflows/pages.yml`, which builds with
Jekyll and deploys to GitHub Pages. Every index --- home, index-all, categories,
tags, series, abstracts, `search.json`, `feed.xml`, `sitemap.xml` --- is
regenerated from the posts collection on every build. None of them are stored in
the repository, and none are ever edited by hand.

## Scheduling

```
scripts/publish rlm-recursive-language-models 2026-10-10
```

This puts a post dated in the future into `_posts/` on `main`. Jekyll's default
`future: false` excludes it from every build until its date arrives. A daily
GitHub Actions cron rebuilds the site at 00:20 America/Los_Angeles, and on the
morning of the 10th that build includes it. The post goes live with no action
from you.

The one sharp edge: posts are dated `00:15:00` local, five minutes *before* the
cron. A post dated later in the day is still in the future when the cron fires
and slips to the next day. `scripts/publish` sets the time for you; `validate`
warns if a hand-edited future post gets it wrong.

## Branches

Two long-lived branches:

| Branch | Contains | Purpose |
|--------|----------|---------|
| `main` | Theme, config, scripts, `_posts/`, images | What GitHub Pages deploys, and what anyone browsing this repo sees first |
| `drafts` | Everything on `main`, plus `_drafts/` | Where writing happens |

`scripts/publish` merges `main` back into `drafts` after every publish, so the
drafts branch keeps tracking the live theme and scripts.

## URLs and the custom domain

The site is served from a custom domain:

```
https://blog.softwarewrighter.com/
```

A custom domain on a *project* repo serves the repo at the domain **root**, not
under the repo name. So `_config.yml` sets `baseurl: ""` even though the repo is
called `blog`, and `./CNAME` holds the bare domain (Jekyll copies it into the
build, which keeps the domain set across deploys).

If the domain is ever removed, the site falls back to the project address
`https://software-wrighter-lab.github.io/blog/` and `baseurl` must become
`"/blog"` to match. Those two settings move together --- `url` and `baseurl` in
`_config.yml`, plus `CNAME`. Nothing else changes, because every URL in the
templates and in post bodies goes through Jekyll's `relative_url` filter and
nothing hardcodes a leading `/assets/...`.

**Two traps here, both of which this repo has already hit:**

*Getting the baseurl wrong is quiet.* Permalinks are directories, so every page
still loads --- while every stylesheet, script, and image 404s, and the nav links
point at a path that does not exist. If the site renders as unstyled text, check
`baseurl` before anything else.

*Applying `relative_url` twice is quiet too*, as long as the baseurl is empty,
because then the filter is a no-op. Serve the same site from a subpath and every
double-filtered URL doubles its prefix. `abstracts.html` had exactly this bug: it
scrapes the first `<img src>` out of already-rendered post HTML, which already
carries the baseurl. If you add a template that pulls a URL out of
`post.content`, do not put it through `relative_url` again.

## Local toolchain

Jekyll 4.4 needs Ruby >= 2.7; macOS system Ruby is 2.6 and will not work.

```
brew install ruby
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
exec zsh
bundle install
```

Note that `/usr/bin/bundle` belongs to system Ruby and fails against this
`Gemfile.lock`; the PATH line above is what makes `bundle` resolve to the
Homebrew one.

CI does not depend on any of this --- GitHub Actions installs its own Ruby 3.3.
The local toolchain is only needed for `scripts/preview`.

## What was dropped from the three-repo setup

- **`sw-lab` / `sw-lab.github.io` split.** `deploy.sh` built the site locally
  and pushed `_site` into a separate publishing repo, which meant the built
  output was version-controlled, the two repos could drift, and the cron and a
  manual deploy could race. GitHub Actions now builds from source on every push;
  `_site` is generated and gitignored.
- **`blog-planning`.** Drafts live on the `drafts` branch of this repo.
- **`validate-deploy.sh`, `validate-scheduled.sh`, `test-site.sh`,
  `deploy.sh`, `schedule-post.sh`, `serve.sh`** --- six scripts that existed to
  police the two-repo deploy. Replaced by `validate`, `publish`, and `preview`.

## Known gaps

- Two decorative gutter images referenced by the Forth rabbit-hole posts of
  2026-04-25 and 2026-04-26 do not exist and never did; they are broken on the
  old site too. Either add the art or drop the two `<img>` tags.
- Search has no relevance ranking --- it returns the most recent matches, not the
  best. Inherited from simple-jekyll-search; fixing it means swapping in Lunr or
  Fuse.
- Post images are decorative WebP at full source resolution (~1600-2700px wide)
  displayed at a few hundred pixels. Resizing them would cut the 21MB further,
  at some risk to how they render.
