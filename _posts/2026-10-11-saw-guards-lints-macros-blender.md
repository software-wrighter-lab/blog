---
layout: post
title: "Saw #14: Guards, Lints, Macros as a Test Bench, and Blender"
categories: [tools, languages, process]
tags: [sharpen-the-saw, xetal, x-etal, git-hooks, linting, macros, language-design, cross-reference, xetal-doc, blender, 3d-graphics, juliamono, blog-tooling, claude-code]
keywords: "Sharpen the Saw, git pre-commit hook, pre-push hook, merge conflict markers, blog validation, lead image check, JuliaMono, xetal doc, cross-reference site, xetal lint, clippy-style linter, X_eTaL macros, Tags macro library, records and choices, equation macros, Blender extension, bpy, EEVEE, 3D scene generation"
abstract: "A short one. This week's sharpening was guards and benches: the blog now refuses to commit or push a merge conflict, checks its own thumbnails and lead images, and draws every code sample in one font. X_eTaL gained a cross-reference tool and a clippy-style linter, and settled on trying new language features as macros before any new syntax. And an X_eTaL program can now drive Blender, the start of 3D scenes, animation and rendering from an array language."
series: "Sharpen the Saw Sundays"
series_part: 14
date: 2026-10-11 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
  - url: "https://github.com/softwarewrighter/X_eTaL-libraries"
    title: "X_eTaL-libraries"
  - url: "https://github.com/softwarewrighter/X_eTaL-extensions"
    title: "X_eTaL-extensions"
---

<!-- DRAFT (2026-10-11). The lead image is a frame of the Blender cubes scene, re-rendered with a transparent background. -->

<img src="{{ '/assets/images/posts/saw-blender-cubes.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

Most of this week went into the Array Languages series, so this Saw is short. It covers what changed in how I work rather than what I built: guards that stop mistakes before they ship, two new tools in the language, a rule for growing the language, and one new capability that points somewhere new.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **X_eTaL** | [the language](https://github.com/softwarewrighter/X_eTaL) --- `xetal doc` and `xetal lint` |
| **Tags** | [X_eTaL-libraries: Tags](https://github.com/softwarewrighter/X_eTaL-libraries/tree/main/libs/Tags) --- named choices and tagged tuples, as macros only |
| **Blender** | [X_eTaL-extensions: blender](https://github.com/softwarewrighter/X_eTaL-extensions/tree/main/extensions/blender) --- X_eTaL writes the Python that runs Blender |
| **The series** | [Array Languages #1](/2026/10/07/array-languages-xetal/) through [#5](/2026/10/11/array-languages-xetal-ml/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="clearfix" markdown="1">

## Guards on the blog

Publishing every day for a week showed where the blog needed checks rather than care:

- **No conflict markers, ever.** Carrying a fix from the drafts branch to the published one ran into merge conflicts. None reached the site, but only a manual check stood in the way. Now a script refuses conflict markers and unmerged files, and git hooks run it before every commit and every push, as does the validation that publishing runs.
- **Thumbnails and lead images checked.** Every post leads with its own image, and validation fails on a duplicate. A new check builds the site and confirms that each card on the abstracts page shows the same image as its post, light and dark versions included.
- **One font for code.** Every code sample on the site, past and future, is drawn in JuliaMono, served from the blog itself. It covers every APL and X_eTaL symbol, and a small script rebuilds it when a post needs a character it lacks.

</div>

<div class="clearfix" markdown="1">

## Two tools in the language

- **`xetal doc`, the cross-reference.** It builds a searchable site from a program and everything it imports, every call linked to its definition and every function findable by its type. The X_eTaL repositories publish one beside their demos. [Array Languages #3](/2026/10/09/array-languages-xetal-libraries/) has the details.
- **`xetal lint`, new this week.** A linter in the spirit of Rust's clippy: a catalog of lints in groups, each with an explanation, and levels set in the source with `# lint:` comments. The first lints check names against the style guide, flag a binding that is never used, and check that a function's name ends in `!` exactly when the function has an effect. The language's own libraries and demos were cleaned up to pass it.

## Macros as the test bench

The bigger change is a rule. X_eTaL should stay small, so a new language feature is tried as a macro first, and the grammar changes only when a change is justified. Three experiments are running that way:

- **Records and choices.** A proposal for records and named choices starts from what records are for: reading parts by name, adding a part safely, updating one part, and keeping a `State` from passing as a `Config`. Its first option is built as a macro library, Tags, to try. One line, `"Color: black red green"`, writes a constant per choice; another, `"State: w m v k"`, writes a constructor, a test, and a getter and setter per part. Nothing is added to the language.
- **Math equations for ML.** Macros that take an equation, starting with the convolution's triple sum, and give back math notation, the array code it expands to, and a computation that runs. [Array Languages #5](/2026/10/11/array-languages-xetal-ml/) says more.
- **Networks and native bindings.** Two macro libraries already in use show the pattern works: one writes a neural network and its training step from a line, and another writes every native extension's typed facade.

</div>

<div class="clearfix" markdown="1">

## Looking ahead: Blender

<figure style="float: right; clear: none; margin: 0.2em 0 0.6em 1.5em; max-width: 45%;">
<video autoplay muted loop playsinline preload="auto" class="no-invert" aria-label="Blender's render of an X_eTaL scene: one cube labeled 1, a ten by ten slab labeled 100 and a ten by ten by ten block labeled 1000, the camera orbiting once around them">
<source src="{{ '/assets/videos/saw-blender-orbit.mp4' | relative_url }}" type="video/mp4">
</video>
<figcaption style="font-size: 0.85em;">1, 100 and 1000: cubes built as meshes by X_eTaL, rendered by Blender's EEVEE, the camera orbiting once.</figcaption>
</figure>

New this weekend: a Blender extension. An X_eTaL program writes Python twice over, a launcher and the script Blender runs inside, and the extension runs it with Blender in the background, under a timeout, and reports what happened.

A library on top of it, also done, writes that Python from arrays. Cubes become one mesh whose corners and faces are worked out as X_eTaL arrays. It adds 3D labels, a sun and a sky, and a camera on a pivot that turns once, evenly, so a video loops. Blender's EEVEE renders it, and the scene comes out as PNG stills, an MP4 and `.glb`, `.obj` and `.blend` files. The video here is the first run of the demo that comes next: one cube, a slab of 100 and a block of 1,000. The block's mesh alone has 8,000 vertices.

After that come more advanced meshes and effects. That makes 3D scene generation, animation and rendering something an array program can do, and that will be useful well beyond one demo.

Other things set up this week that will pay off later: the native hook X_eTaL still needs, so extensions can drop their bridge; worked examples under every library function that `xetal doc` can run and check; and the equation-macro proof of concept.

</div>
