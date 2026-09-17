---
layout: post
title: "TBT #11: APL\\360 Revisited"
categories: [tbt, programming-history, retrocomputing, languages]
tags: [apl, apl360, throwback-thursday, iverson, ibm, mainframe, array-languages, rust, sw-apl, cor24, sw-mlpl, notation, interpreters]
keywords: "APL\\360, APL, Kenneth Iverson, Adin Falkoff, IBM System/360, IBM 2741, Selectric typeball, array language, sw-apl, clean-room interpreter, Rust, workspaces, del editor, six-space prompt, I-beams, APL2, Dyalog, J, K, BQN, NumPy, notation as a tool of thought, COR24 APL, sw-MLPL"
author: Software Wrighter
abstract: "APL\\360 was the first APL you could actually type at --- IBM's 1968 implementation of Iverson's notation, used from a typewriter terminal with a special typeball. This is a look at what it did and did not do, why its ideas turned up in half the languages and libraries that followed, and a third APL of my own: sw-apl, a clean-room APL\\360 in Rust that keeps the glyphs, the six-space prompt, the del editor, and the workspaces, and is checked against the printed examples in IBM's own manuals."
series: "Throwback Thursday"
series_part: 11
date: 2026-09-17 00:15:00 -0700
repo_url: "https://github.com/sw-vibe-coding/sw-apl"
repo_urls:
  - url: "https://github.com/sw-vibe-coding/sw-apl"
    title: "sw-apl"
  - url: "https://github.com/sw-embed/sw-cor24-apl"
    title: "sw-cor24-apl"
  - url: "https://github.com/sw-ml-study/sw-mlpl"
    title: "sw-mlpl"
---

<img src="{{ '/assets/images/posts/sw-apl-marker.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

The first APL post here was [a horse race](/2026/01/29/tbt-apl-horse-race/) --- my first program, typed at an IBM 2741 in 1972. This one is about the language it was written in, APL\360, and about building one of my own: not the APL I use for machine learning, and not the tiny one that runs on an FPGA, but the original, as true to the 1968 system as the manuals allow.

</div>

**sw-apl** is a clean-room APL\360 interpreter written in Rust. It keeps what made the original what it was: the traditional glyphs, typed as Unicode; the six-space indent prompt and printer-style transcript; defining functions with `∇` behind a numbered prompt; the caret under the point of an error; the settings as commands. Every APL\360 primitive and operator works on arrays of any rank, functions take locals and recurse, `→` branches to labels, and the horse race from 1972 runs. It is deliberately not APL2 and not Dyalog: flat arrays only, no nested arrays, no each. Its behavior is checked against the printed examples in IBM's APL\360 manuals, character for character.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **sw-apl** | [sw-vibe-coding/sw-apl](https://github.com/sw-vibe-coding/sw-apl) · [language reference](https://github.com/sw-vibe-coding/sw-apl/blob/main/docs/language.md) · [del editor guide](https://github.com/sw-vibe-coding/sw-apl/blob/main/docs/del-editor-guide.md) · [glyph table](https://github.com/sw-vibe-coding/sw-apl/blob/main/docs/glyphs.txt) · [parity checklist](https://github.com/sw-vibe-coding/sw-apl/blob/main/docs/parity.md) · [samples](https://github.com/sw-vibe-coding/sw-apl/tree/main/samples) |
| **The other two APLs** | [sw-cor24-apl](https://github.com/sw-embed/sw-cor24-apl) on the COR24 · [in the browser](https://sw-embed.github.io/web-sw-cor24-apl/) · [sw-MLPL](https://github.com/sw-ml-study/sw-mlpl) |
| **IBM documents** | APL\360 User's Manual, APL\360 Primer --- scanned at [bitsavers](http://bitsavers.org/pdf/ibm/apl/) |
| **Prior post** | [TBT #1: My First Program Was a Horse Race](/2026/01/29/tbt-apl-horse-race/) |
| **GNU APL** | [gnu.org/software/apl](https://www.gnu.org/software/apl/) --- an APL2 implementation |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Three APLs

I have now written three, and they are three different answers to what APL is for.

The first is [sw-cor24-apl](https://github.com/sw-embed/sw-cor24-apl): a tiny integer-subset APL in C for the COR24, a 24-bit soft CPU on an FPGA, talking over a UART. It has integer scalars, vectors, and matrices, `iota`, `rho`, `take`, `drop`, reduce, and a bump-allocated heap of 4,096 words --- and because the target has no APL keyboard, it spells the primitives as ASCII keywords. It exists to prove that an array language fits in an embedded machine. It runs [in the browser](https://sw-embed.github.io/web-sw-cor24-apl/) on an emulated COR24.

The second is [sw-MLPL](https://github.com/sw-ml-study/sw-mlpl), which is not an APL at all but a descendant: an APL2-inspired language for machine learning, with nested arrays, records, autograd, and native model helpers, written to be typed on an ordinary keyboard. It takes the whole-array way of thinking and points it at tensors.

The third is sw-apl, and it goes the other direction --- back to the source. What I keep coming back to about APL\360 is that it is *simpler* than every descendant, and loses very little for it. The notation is small enough to hold in your head and powerful enough that most programs are one line. Every later APL added something, and each addition is defensible; but the 1968 language is the one where you can see the whole idea at once.

## What APL\360 was

Kenneth Iverson published *A Programming Language* in 1962 as a notation --- a way of writing algorithms on paper, used at Harvard and then at IBM to describe the System/360 itself. APL\360, built by Iverson, Adin Falkoff, and a small group at IBM's Watson Research Center and released in 1968, was the first implementation you could type at. It ran as a time-sharing system on a System/360, serving dozens of typewriter terminals, and it was interactive in a decade when most computing was a card deck submitted in the morning and a printout collected after lunch.

You used it from an IBM 2741, a Selectric typewriter wired to a phone line, fitted with the APL typeball so that the keys produced `⍳` and `⍴` and `⌈` instead of the usual characters. The session was a piece of paper. APL\360 indented its prompt six spaces; you typed on the same line; the answer came back flush left. That layout is why an APL transcript is readable at a glance forty years later --- input is indented, output is not --- and it is why sw-apl prints exactly that way.

None of those characters had anywhere to live. The System/360 was an EBCDIC machine, and EBCDIC had no code for `⍳` or `⍴` or `⌈`; ASCII, standardized in 1963, did not either, and Unicode was twenty-five years away. APL\360 handled its alphabet by owning the whole path from the keyboard: the 2741 sent the tilt-and-rotate code of whatever typeball was mounted, and the APL typeball simply put different characters on the same keys, so the system translated the terminal's codes into a character set of its own. The glyphs existed on paper and in the interpreter and nowhere else. IBM later defined EBCDIC code pages for the APL character set, and Unicode finally gave the symbols standard code points in 1993, in the *APL functional symbols* range. That is what sw-apl reads: source is UTF-8, the lexer works in Unicode code points, and the glyph table lists exactly which ones are APL.

```text
      2+3×4
14
      ⍳10
1 2 3 4 5 6 7 8 9 10
      +/⍳10
55
      2 3⍴⍳6
1 2 3
4 5 6
```

The evaluation rule is the thing people remember: right to left, no operator precedence. `2+3×4` is 14 because `×` takes `4` on its right and `3` on its left, then `+` takes the result. A function's right argument is *everything* to its right; its left argument is the single array immediately to its left. It is the opposite of the school rule, and it is what makes a line like `(+/X)÷⍴X` --- the average --- read as a single thought.

Everything worked on whole arrays. Scalar functions --- `+ - × ÷ ⌈ ⌊ * ⍟ | ! ○` and the comparisons --- extended element by element, with a scalar pairing against every element of a vector. Mixed functions rearranged: `⍳` generated indices, `⍴` gave or set a shape, `,` raveled or catenated, `⌽` reversed, `⍉` transposed, `↑` and `↓` took and dropped, `/` compressed, `⊥` and `⊤` decoded and encoded in any radix, `⍋` and `⍒` graded. Operators took functions as arguments: reduce `f/`, scan `f\`, inner product `f.g`, outer product `∘.f`. There was one numeric type as far as you could tell, comparison had a tolerance --- APL\360 called it fuzz --- and `0÷0` was 1. The session's settings were commands, not variables: `)ORIGIN 0` set the index origin, `)DIGITS` the print precision, `)WIDTH` the line width; and system information --- the time, the date, the workspace available, the line number --- came from the I-beam functions, `⌶` followed by a number.

Functions were defined with the del editor, a line editor rather than a screen one --- the terminal was a printer, so there was no screen to edit on. You typed `∇` and a header, and the system took over the session, prompting with a bracketed line number and taking your function one line at a time until a closing `∇` gave the session back:

```text
      ∇R←AVG X
[1]   R←(+/X)÷⍴X
[2]   ∇
      AVG 3 1 4 1 5
2.8
```

Later you reopened the same function by name, and then the bracket became a command rather than a prompt: append a line, insert one between two others, change a line, delete a line, list one line, list the whole function, or edit the header. There was no cursor and nothing to scroll: you edited by naming a line number and saying what to do with it, and the terminal printed the result. And a closing `⍫` instead of `∇` locked the function so it could be run but never listed or edited again. sw-apl works the same way; the [del editor guide](https://github.com/sw-vibe-coding/sw-apl/blob/main/docs/del-editor-guide.md) in the repository is the how-to.

Control flow was `→` --- branch to a line number, with the idiom `→(N>0)/LOOP` meaning *branch to LOOP if N>0, otherwise fall through*, because compressing a one-element vector by a false condition leaves nothing to branch to. Names were dynamically scoped: a local shadowed a global for everything called beneath it, as in LISP. And when something went wrong, you got the error name, the statement echoed, and a caret under the point of detection:

```text
      2 3+4 5 6
LENGTH ERROR
      2 3+4 5 6
         ^
```

Your work lived in a workspace. `)SAVE` kept it under your account; `)LOAD` brought it back; `)LIB` listed a library; `)LOAD 1 CLASS` fetched a public workspace from library 1. Numbered public libraries were how IBM distributed teaching material and utilities, and library 1 held the workspaces a new user was told to load first. Those are the workspaces this project is ultimately for: to find the self-study material that taught APL to its first users, load it, and run it, without a mainframe emulator between you and it.

## What it did not do

The absences define it as much as the primitives. APL\360 had no nested arrays --- an element was a number or a character, never an array --- and so no `each`, no enclose, no pick. Those came with APL2 in 1984 and changed the language's character --- and they are what you get from [GNU APL](https://www.gnu.org/software/apl/), which is an APL2 implementation; it is the APL the [horse race](/2026/01/29/tbt-apl-horse-race/) ran on, and it has everything in this paragraph that sw-apl deliberately does not. There were no dfns, no diamonds, no lowercase, no strings other than character vectors. There were no user-defined operators. Files, in the sense a FORTRAN programmer meant, did not exist; the workspace was the persistence. There were no quad system variables: `⎕IO`, `⎕PP`, `⎕CT` and the rest arrived with APLSV in 1973, along with shared variables and the `⍎` execute and `⍕` format primitives, and every APL since has used them. In APL\360 the same things were `)ORIGIN`, `)DIGITS`, and the I-beams.

sw-apl draws the line at APL\360 itself, not at APLSV a few years later: the primitives, the session, and the system interface as it was --- `)ORIGIN`, `)DIGITS`, and `)WIDTH` for the settings, I-beams for system information --- and nothing from APL2 onward. A 1970 transcript sets its origin with `)ORIGIN 0`, and so does this one.

## The idioms

APL programmers accumulated one-liners the way other communities accumulate libraries, and a handful of them show what the language is like to think in. Each is one expression with no loop anywhere.

```text
      X←3 1 4 1 5 9 2 6
      (+/X)÷⍴X                   ⍝ average
3.875
      X[⍋X]                      ⍝ sort: grade up, then index
1 1 2 3 4 5 6 9
      (X>3)/X                    ⍝ compress: keep the elements over 3
4 5 9 6
      +/X=1                      ⍝ how many ones
2
      (⍳5)∘.×⍳5                  ⍝ outer product: a times table
1  2  3  4  5
2  4  6  8 10
3  6  9 12 15
4  8 12 16 20
5 10 15 20 25
      2⊥1 0 1 1                  ⍝ decode: binary to decimal
11
      (2 2⍴1 2 3 4)+.×2 2⍴5 6 7 8   ⍝ inner product: matrix multiply
19 22
43 50
```

The sort idiom is the one I would show someone first. There is no sort primitive; `⍋X` gives the permutation that *would* sort `X`, and `X[⍋X]` applies it. Grade separates *the order* from *the rearrangement*, so sorting one array by another is `Y[⍋X]` and there is nothing more to learn. The compress idiom is the second: a boolean vector on the left of `/` selects, and since comparisons produce booleans, *keep the elements over 3* is written exactly as it is said. The outer product is the third, because a whole table falls out of a single `∘.×`, and because the same shape --- `∘.=` for a match matrix, `∘.<` for a comparison --- turns up everywhere once you have seen it.

## The same APL, off the mainframe

APL\360 was not the only APL of its era, and the interesting comparisons are not with other languages but with the same language on smaller machines. APL\1130 arrived in 1968 as well, a single-user APL for the [IBM 1130](/2026/02/26/ibm-1130-system-emulator/) --- one person, one machine, no time-sharing, and a workspace small enough that fitting your program into it was part of the exercise. The commercial time-sharing services, I.P. Sharp and STSC, ran their own APLs on their own iron and competed on the libraries and the data they gave you access to, not on the notation.

Then it went on a desk. The IBM 5100 of 1975 was a fifty-pound "portable" with a five-inch screen showing sixteen lines of sixty-four characters, a tape cartridge for storage, APL glyphs printed on the keys, and a switch on the front to choose between APL and BASIC. It came six years before the 5150, the one IBM called the PC. What makes it remarkable is how the language got in there: rather than write a new interpreter for a small machine, IBM put a processor card in it that emulated a System/360, and ran the mainframe APL interpreter on that. I serviced the 5100 series as an IBM customer engineer, and the part of that story you learn with the covers off is that the emulation was deliberately slowed --- fast enough to be a fine desktop APL, not fast enough to sell against the machines in the datacenter. The 5110 added a diskette drive in 1978 and the 5120 put the whole thing on a desk in 1980.

Because it was a mainframe interpreter, the whole language came along --- the same primitives, the same `)SAVE` and `)LOAD`, the same workspace. But it came from the *later* mainframe: the 5100's APL had the quad system variables, `⎕SVO` among them, rather than APL\360's I-beams. That is the line sw-apl is drawn on. The APL most people met on a desk was already APLSV.

The difference that matters for this project is not the language but the paper. On a 2741 the session was a printout: you could read back through a morning's work, and the six-space indent existed so you could tell at a glance what you had typed from what the machine had answered. On the 5100 the session was sixteen lines of glass that scrolled away behind you. The convention survived the move --- the indent is still there in every APL since --- but its reason did not. sw-apl reproduces the printer, because that is the session APL\360 was designed around.

IBM kept at the idea of a mainframe on a desk long after the 5100. Later technical workstations were built on the XT and the AT with their own system-unit-sized box alongside, joined by thick parallel cables; on an IBM 7437 VM/SP Technical Workstation I debugged MVS/370 code locally, which at the time was a genuinely strange thing to be able to do. Every one of those machines put real System/370 hardware under the desk to run the software. This project is the other approach: keep the language, and let the mainframe go.

## Against its contemporaries, and ours

In 1968 the alternatives were FORTRAN IV, COBOL, ALGOL 60, PL/I, LISP 1.5, and the year-old BASIC. Every one of them but LISP and BASIC was a batch language: you wrote a program, submitted it, and read the result later. APL\360 was a conversation. You typed an expression and the answer came back; a program was something you built up from expressions that had already worked. That alone made it the environment of choice for a lot of people who were not programmers --- actuaries, engineers, planners --- and APL time-sharing became a business (I.P. Sharp, STSC) on the strength of it.

The deeper difference was the unit of work. FORTRAN operated on one number at a time and you wrote the loop; APL operated on the array and the loop was the interpreter's problem. That is the idea that outlived the notation. NumPy's broadcasting is APL's scalar extension. MATLAB is an APL whose glyphs were replaced with function names and whose arrays became matrices first. R's vectorized operations, spreadsheet array formulas, `reduce` and `scan` and `outer` in a dozen libraries, the tensor operations in every ML framework --- these are APL's primitives with the typeball removed. Iverson's 1979 Turing Award lecture was titled *Notation as a Tool of Thought*, and the tools of thought spread further than the notation did.

The notation spread too, in a direct line. APL2 (IBM, 1984) added nesting, and it is the APL most people can run today: GNU APL is an APL2, and Dyalog started from it. J (Iverson and Roger Hui, 1990) kept the semantics and moved to ASCII. K and q (Arthur Whitney) stripped the language down again and put it under the world's financial data. Dyalog carried APL forward with lexical dfns and a modern runtime. BQN redesigned the glyphs from scratch in 2020. Each of them is an argument about what APL should have been. sw-apl is not an argument; it is a record of what it was.

## How sw-apl does it

The interpreter is written from the APL\360 language description and from observed terminal behavior, not by translating any existing implementation. The C interpreter for the COR24 and GNU APL --- an APL2, so only where APL2 and APL\360 agree --- are consulted only for expected results.

**Glyphs only, in Unicode.** Input is UTF-8 and the lexer works in Unicode code points --- the encoding APL\360 never had, arriving as it did a quarter century before the APL symbols were given standard positions. There are no keyword aliases --- no `rho` for `⍴` --- and no translation layer. The lexer accepts printable ASCII plus exactly the code points in the glyph table; anything else is `CHARACTER ERROR` naming the code point, and the message tells you which one you meant: `CHARACTER ERROR: U+03C1 (use ⍴ U+2374)` for a Greek rho that looks the same and is not. Typing the glyphs on a modern keyboard is handled outside the interpreter, with Espanso expansions and an Emacs keymap.

**One number.** To the program there is one numeric type. Underneath, integers are exact in 64 bits and promote to floating point on overflow or a fractional result, and comparison is tolerant, the way APL\360's fuzz made it. Booleans are the numbers 0 and 1. Negative literals use the high minus, `¯5`; a leading ASCII minus is the subtract function.

**Flat arrays, right to left.** A value is a shape and a flat vector of numbers or characters. Statements parse right to left with the long right scope; operators bind before functions and take their operands from the left; strands of numeric literals are vectors at lex time. Every scalar and mixed function works at any rank, reduce and scan run along any axis, inner and outer products take any shapes, and axis brackets are accepted only in the seven places APL\360 allows them --- anywhere else is a SYNTAX ERROR with the caret under the bracket.

**Functions, the del way.** `∇` and a header open definition mode; body lines arrive behind the `[n]` prompt; a closing `∇` ends it, and reopening by name gives the bracket commands for appending, inserting, changing, deleting, and listing lines ([guide](https://github.com/sw-vibe-coding/sw-apl/blob/main/docs/del-editor-guide.md)). Names after semicolons are local for the length of the call and come back when it returns, arguments bind into a fresh frame, and the result is whatever the header's result variable holds at exit. Labels are local constants holding their line number, and `→` takes the first element of its argument as the next line, an empty vector as *fall through*, and zero as *return* --- which is the whole of APL\360 control flow, and enough for the conditional branch `→LOOP×⍳COND`, empty and therefore falling through when the condition is false. Recursion works; a recursion with nothing to stop it reaches DEPTH ERROR rather than a crash.

**The session, as printed.** Six spaces, then your input on the same line; output from column one; definition mode prompts with `[n]`; errors as the three-line caret display; output wider than the `)WIDTH` setting wraps with a six-space continuation. Batch mode echoes each input line with the indent, so a transcript from a file reads exactly like a session.

**Workspaces as text.** `)SAVE` writes a plain UTF-8 file --- settings, variables as APL expressions, functions as del definitions --- with a header carrying the workspace id and timestamp so `)LOAD` can print the `SAVED` line. It is human-readable, re-executable, and diffable in git. Numbered libraries map to directories, so `)LOAD 1 CLASS` means what it meant. Every shipped workspace defines a niladic `DESCRIBE` that says what it holds and how to start, and the session says so after a load.

**Checked against the record.** There is no running APL\360 to test against, so the oracle is the paper. The IBM APL\360 User's Manual of 1968, with its 1970 supplement, is the reference, and the standard is that its worked examples --- transcribed into the sample corpus --- reproduce the printed output *character for character*: the indent, the spacing, the high minus, the error lines. Alongside them is a conformance corpus of glyph-form programs, one feature area per file, each pinned as a transcript with reg-rs so any change in behavior shows up as a diff. A parity checklist carries one row per APL\360 feature with the test or transcript that pins it, and it sets the bar plainly: every row done, every sample running without a NOT IMPLEMENTED, everything outside the APL\360 character set a CHARACTER ERROR, and the quad-named system variables of later APLs a SYNTAX ERROR --- because they are not in this language. GNU APL is the secondary oracle, but only where APL2 and APL\360 agree.

What is not there yet is named in the same checklist rather than glossed over: the del editor's bracket commands, quad and quote-quad input, the workspace commands, the I-beams, and domino. The multi-user parts of a 1968 time-sharing system --- `)MSG`, `)PORTS`, sign-on numbers --- are deliberately out of scope and answer with honest stubs; there is no one else on this machine.

## What it looks like

<figure class="no-invert">
<video src="{{ '/assets/videos/sw-apl-mvp.mp4' | relative_url }}" autoplay muted loop playsinline preload="auto" aria-label="Terminal recording of the sw-apl session: scalar arithmetic, iota, reduce, and reshape at the six-space prompt"></video>
<figcaption>A session at the six-space prompt: arithmetic, <code>⍳</code>, <code>+/</code>, reshape, and a LENGTH ERROR --- input indented, output flush left, as a 2741 would have printed it. Recorded from the CLI with <a href="https://github.com/charmbracelet/vhs">VHS</a>.</figcaption>
</figure>

The last line of that session is deliberate: `1 2 3+4 5` is a LENGTH ERROR, and the error prints the way the manual prints it.

Two programs are the real measure. `samples/50-horse-race.apl` is [the horse race](/2026/01/29/tbt-apl-horse-race/) rewritten in pure APL\360 --- the names in a character matrix, the output mixing text and numbers with semicolons, the loop written `→LOOP×⍳~∨/POS≥15` --- with no `⍕`, no `⊃`, nothing from a later APL. And `samples/54-life-function.apl` is Conway's Life on a six-by-six torus as two defined functions, the eight neighbours counted by eight explicit rotations, because `⊖` and `⌽` on a matrix are exactly that and there is nothing else to reach for. Both run. Ask sw-apl for the famous Dyalog Life one-liner instead and you get a CHARACTER ERROR that names the brace as a dfn, not APL\360 --- which is the point.

That is the whole of it: a language small enough to hold in your head, an environment that answers when you type, and a session you can read afterwards as a page. It was true in 1968 at a 2741 and it is true now, at a terminal, without a mainframe in between.
