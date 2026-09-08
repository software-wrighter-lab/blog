# Drafts

Work in progress. Nothing here is on the site.

These live on the `drafts` branch rather than `main` so that the default view of
this repository shows the published blog. Publishing a post moves it from here
to `_posts/` on `main`:

```
scripts/publish <slug> [YYYY-MM-DD]
```

Preview them locally with `scripts/preview`, which serves the site including
drafts and future-dated posts.

Draft filenames carry no date --- `scripts/publish` assigns one, so a draft that
sits for three weeks does not publish with a stale date. The imported drafts
still have a `date:` in their front matter recording the date they were
originally aimed at; publish overwrites it with whatever date you actually pass.

Note this branch is public like every other branch of a public repository ---
drafts are unpublished, not private.
