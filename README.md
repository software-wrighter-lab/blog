# blog

Software Wrighter Lab — AI coding agents, systems programming, and practical
machine learning.

## Live site

**https://software-wrighter-lab.github.io/blog/**

Built from source by GitHub Actions on every push to `main` and deployed to
GitHub Pages. A custom domain can be pointed here later; see
[docs/workflow.md](docs/workflow.md#urls-and-the-custom-domain).

## Writing

```
git checkout drafts
scripts/new-post "Post Title"
scripts/preview                 # http://localhost:5907, drafts included
scripts/publish <slug>          # or: scripts/publish <slug> 2026-10-10
```

That is the whole workflow. Drafts live on the `drafts` branch, published posts
in `_posts/` on `main`. A post is public when it is a dated file in `_posts/` on
`main` — there is no separate deploy step and no publishing repo.

See [docs/workflow.md](docs/workflow.md) for the full picture, including
scheduling, the front matter schema, and the local Ruby setup.

## History

This repo replaces a three-repository arrangement — `sw-lab` (source),
`blog-planning` (drafts), and `software-wrighter-lab.github.io` (committed build
output). The 112 posts were imported with their original dates and permalinks;
their images were converted from PNG to WebP, which took the image tree from
120MB to 21MB.
