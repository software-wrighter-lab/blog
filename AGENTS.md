# Blog working notes

## Layout part names (for tweak requests)

Semantic names + row/column grid. Tweak examples: "swap REEL and LINKS", "KEYS to r4 col-C", "P3.fig left instead of right".

### Named parts

Header:
- `TITLE` — post title
- `META` — date, abstract, series line

Hero region (top of post through intro):
- `TOC` — table of contents, far left (`nav.toc`, floats left ~280px)
- `STAMP` — block-print marker image (`.post-marker`)
- `INTRO` — short intro paragraphs
- `REEL` — primary capture / animation (the hero figure)
- `LINKS` — resource/links box (`.resource-box`, floats right, max-width 420px)
- `KEYS` — combined keys/wager aside (`.aside-box`, floats right 36%, clear:both)

Main region (pane sections, each `.text` / `.fig`):
- `P1`..`P4` — the face sections, staggered fig right/left/right/left, fig 60%
- `GRID` — side-by-side section: `GRID.thumbs` (10 labelled wide-view strips, one per stone, + CSS `:target` lightbox), `GRID.open` (that stone's wide row animating through its time axis); an `<hr>` before it ends the previous stagger section so it stays full width
- `TOUR` — drop-down montage + stone table
- `END` — closing/CTA

### Coordinate grid (current arrangement, Made Visible #4)

```
        col-L        col-C          col-R
r1      ──────────── TITLE ─────────────────
r2      ──────────── META ──────────────────
r3      TOC          STAMP      INTRO
r4      TOC          REEL       LINKS
r5      KEYS         (flow)     (flow)
r6      P1.text                 P1.fig
...staggered: P2 (fig left) → P3 (fig right) → P4 (fig left)
rN      GRID → TOUR → END
```

### Float mechanics that constrain the grid

- Auto-stagger JS wraps top-level h2 sections (`.stagger`, 660px) but **skips the first two h2 sections when `.toc`/`.resource-box` floats exist**; an h2 inside `<div class="clearfix" markdown="1">` escapes staggering. Avoid `overflow:hidden` wrapper divs (BFC narrows beside floats).
- A float placed after a clearfix div starts **below that div's bottom** (enclosed floats count) — put hero floats (REEL, LINKS) outside the intro clearfix div or they stack.
- Second/third left floats sit side by side (TOC → STAMP → REEL columns); floats cannot overlap, so widths must leave a gap. Hero row that fits: TOC 330 + REEL 32% (margin-box ends ~x820) + LINKS 330 (border-box, `table-layout: fixed` needed or the table's min-content keeps the box ~380px and it drops below REEL). Chrome needs ~20px slack — don't tune to the exact pixel.
- A clearfix div's `::after` clears ALL preceding floats in the BFC (TOC included), so its bottom sits below the TOC and any sibling float placed after it starts there. Don't wrap the lede in clearfix when REEL/LINKS follow it.
- Source order matters for co-floats: of two floats that must share a row, the first-placed one gets the row; place LINKS before REEL.
- `.aside-box` has `clear: both` by house design (never beside another box).
- `.aside-box` house margins assume a right float (`0.3em 0 1.2em 1.8em`); when KEYS is floated left, set `margin: 0.3em 1.8em 1.2em 0` inline or body text abuts it.
- The first flowing section after the hero (the overview clearfix div) needs `clear: both` or its text squeezes into the gap between REEL and LINKS.
