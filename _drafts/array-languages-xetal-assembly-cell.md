---
layout: post
title: "Array Languages #27: The Assembly Cell, a Robot Bench That Builds Circuits in Free Air"
categories: [programming-languages, array-languages, simulation]
tags: [array-languages, xetal, x-etal, xetal-extensions, robotics, simulation, electronics, soldering, ne555, dead-bug, three-js, blender, webassembly, mcp, rust]
keywords: "simulated robot assembly cell, building electronic circuits in 3D, dead-bug construction, free-air circuit, 555 LED blinker, lap joint soldering, robot arm inverse kinematics, soldering simulation, thermal model, netlist to robot program, circuit slicer, X_eTaL extension, Rust simulator, WebAssembly, Three.js player, Blender models, MCP server for an LLM agent"
abstract: "Twenty-seventh in the Array Languages series: the assembly cell, an X_eTaL extension that simulates a robot bench building electronic circuits in free air, in 3D, from the center outward, one command at a time. A Rust simulator decides what is possible (reach, collision, heat, solder); X_eTaL plans the circuit and describes the models; Three.js and Blender only draw. It began with four robot arms and became a bench: a turntable, one slender arm, pincers and an iron that feeds its own solder. Lap joints, a 555 LED blinker planned from its netlist by search and built whole, every step tried on the simulator, and an MCP server so an LLM agent can drive it."
series: "Array Languages"
series_part: 27
date: 2026-11-28 00:15:00 -0800
# video_url: "Mike: TODO, the 555 blinker video's YouTube URL once it is published"
# video_title: "Mike: TODO"
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-extensions"
    title: "X_eTaL-extensions"
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
---

<!-- DRAFT
     Started 2026-11-27 10:30 from X_eTaL-extensions at 2bfa2b6; updated to e19b867 (step 29: wrap joints, the
     live page's run in a worker; models.jpg recopied with the wrap tool; cell-wrap from videos/wrap.webm at 40 s). Sources: extensions/cell/docs/README.md, docs/cell-design.md, docs/plan.md (Saga 17 and its
     decisions C1-C23). Stills from extensions/cell/videos/*.webm (solder at 20 s, lap at 30 s, blinker at 535 s);
     cell-models from docs/models.jpg; cell-four-arms from docs/mcp.jpg (the earlier four-arm cell).
     Lead image: Mike's screenshot of the live page (Dropbox/Screenshots, 2026-11-27 9.54.53), for the first
     paragraph and the abstracts card. Opening: Mike's words (2026-11-27; "set off" read as "set of").
     X_eTaL drawn with the repo's pinned bin/xetal render (8c49bd80). The facade lines run
     2026-11-27 with the extension built locally (target/debug/xetal-x --ext extensions/cell): cell 0.1.0 and the
     parse JSON as shown; cargo test -p xetal-ext-cell passed.
     Updated 2026-11-27 afternoon to X_eTaL-extensions 1c8b0ef (steps 30-31: the feature programs on lap joints;
     the planner plans the blinker by search, nets/blinker.net, 367 commands, 1128.01 simulated s) and to the
     re-cut 555 video (X_eTaL-video lessons/cell-555, working tree: the planned build's join order, grounds to pin 1).
     cell-blinker.webp is still a frame of the earlier hand build (videos/blinker.webm): replace it with a frame of
     the finished planned circuit from the new recording when it exists.
     The 555 video: X_eTaL-video is recording it (full frame, moving camera, 4x, captions); add the video
     link, a frame or two, and Mike's closing. Date 2026-11-28 is tentative.
-->

<img src="{{ '/assets/images/posts/cell-live-lead.webp' | relative_url }}" class="post-marker no-invert" alt="The assembly cell's live page: the controls on the left, a slender orange arm over a turntable with a vise and pincers in the middle, the microscope's close-up below it, and the program's numbered command list on the right" style="width: 205px;">

I've been attending a monthly Electronics meetup Zoom call, and I described a machine that could assemble 3D circuits "in the air" (in a harness with a set of grippers and manipulators). The organizer challenged me to "build it!" So I am starting with X_eTaL to build Blender models and an interactive demo of a machine like I described. I've already made many refinements.

The idea is to provide this "slicer"-like tool via MCP to AI coding agents to model circuits. If/when I build the actual robot assembler, the same MCP could allow an AI coding agent to construct circuits (subject to what parts I have in-stock and can feed to the robot).

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Live page** | [The assembly cell, live](https://softwarewrighter.github.io/X_eTaL-extensions/cell/live/) (runs in your browser) |
| **Video** | Mike: TODO, the 555 blinker video once published |
| **Docs** | [The cell extension](https://github.com/softwarewrighter/X_eTaL-extensions/blob/main/extensions/cell/docs/README.md), [the design](https://github.com/softwarewrighter/X_eTaL-extensions/blob/main/docs/cell-design.md) |
| **Code** | [X_eTaL-extensions](https://github.com/softwarewrighter/X_eTaL-extensions), [X_eTaL](https://github.com/softwarewrighter/X_eTaL) |
| **Related posts** | [X_eTaL-extensions, Extending the Machine](/2026/10/10/array-languages-xetal-extensions/), [X_eTaL and Blender](/2026/10/15/array-languages-xetal-blender/) |
| **The series** | [Array Languages: every post](/series/#array-languages) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## A circuit in free air

The assembly cell is a robot bench, simulated, that builds electronic circuits in free air: no circuit board, no layers, the parts soldered lead to lead in 3D, growing outward from a chip at the center. It is the newest extension in [X_eTaL-extensions](https://github.com/softwarewrighter/X_eTaL-extensions), and it now plans and builds a complete 555 LED blinker.

The strategy is dead-bug construction, done by a machine. Dead-bug is an old way of building a circuit by hand without a circuit board: turn the chip on its back, so its legs stick up like a dead insect's, and solder the parts and wires straight to the legs. It is quick for a prototype, with nothing to design or etch first, and the leads stay short.

It suits a machine, too. With the chip upside down, every leg is bare and reachable, from above and from the sides, and the circuit can grow outward in three dimensions instead of across a flat board. In the cell, the chip goes in a vise legs up, each part is brought in so that its lead lies along a leg, held there, and soldered, and then the next part comes in. Surface-mount parts are planned the same way: held pads up, and wired with very fine enameled wire.

It is virtual first: a simulation that respects the physics that matter here (reach, collision, gravity, heat, solder, wire), driven by commands such as these:

```
pick A R1 grasp=body              # the arm takes the resistor
pinch P1 on=R1.1 at=6             # a pincer holds its lead
present U1.3+R1.1 at=S1           # the turntable brings the joint to the iron
touch S1 at=U1.3+R1.1 dwell=2     # the iron on the joint, 2 s
feed S1 mm=2 rate=1               # solder wire fed into it
inspect U1.3+R1.1                 # how the joint turned out
```

A command that cannot start is refused and changes nothing, saying why: out of reach, past a joint's limit, through a singularity. One that collides stops where it touched. So an agent can try things safely, and still see real failures. And a whole program can be previewed before it runs, the way a slicer previews a 3D printer's moves.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Who does what

The split is the same one the neon city and the other 3D demos use: X_eTaL decides what, Rust decides what is possible, and the players only draw.

| Piece | Made with | Does |
|---|---|---|
| The simulator | Rust (`parry3d` for collision) | the one authority on the cell's state: runs a command, says what happened, keeps the timeline |
| The facade, `ᶜᵉ` | X_eTaL | a program sends commands and reads state, timelines and checks |
| The planner, `ᶜᵖ` | X_eTaL | a netlist to a placement in 3D to a command program |
| The models, `ᶜᵐ` | X_eTaL writing Blender's Python | the arm, tools, stage, microscope and every part, as `.glb` with a rig file |
| The player | Three.js | draws the cell and plays its timeline, with a scrubber |
| The agent's door | Rust, MCP | the simulator's commands as tools for an agent |
| The live page | the simulator as WebAssembly | the cell driven in a browser, nothing installed |

The simulator has no threads, files or clocks; time is the simulation's own. So the same crate runs natively, behind the MCP server, and in the browser as WebAssembly: the live page is a build, not a port. On the live page a program now runs in a background worker, so the page stays responsive while a long one, like the blinker, works through. The same program always gives the same state, to the microsecond.

From X_eTaL, the cell is a handful of functions:

```xetal
"ce:" u̲se< "Cell"
ᶜᵉa̲bout @                                          ⍝ cell 0.1.0
ᶜᵉp̲arse "place A U1 at=0,0,0 rpy=180,0,0"
ᶜᵉr̲un "move A to=0,0,20 rpy=180,0,0\nlift A mm=30"
```

`ᶜᵉp̲arse`{:.language-xetal} checks a program against the command table and returns each command as JSON; `ᶜᵉr̲un`{:.language-xetal} runs it on a new cell and returns each outcome: its start and end times, the motions it was made of, events and warnings.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## From four arms to a bench
{: .pos-left}

<figure class="zoomable outdent-right" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/cell-four-arms.webp' | relative_url }}" class="no-invert" alt="The first version of the cell: four large orange six-axis robot arms around a small work zone, each with its own tool rack, a microscope on a gantry above">
<figcaption>The first cell: four arms, each with its own rack of tools. Click to enlarge.</figcaption>
</figure>

The first design had four six-axis arms around a 60 mm work zone, each with a rack of every tool: two arms to hold the parts, one to solder, one to feed solder and clip heatsinks. It worked, and it kept getting in its own way. Around one small joint the iron, the feeder, the clip and the tweezers all came down from above and met each other.

So it became a bench. A turntable holds the work and turns, tilts and lifts it. One long, slender arm picks and places parts, and can turn the work on its side. The soldering iron is a station on a simple actuator that comes in from the side, with its own solder feeder. Pincers ride a ring around the turntable to hold leads together and to sink heat. As I put it at the time, there is no need for many large robot arms fighting for access in a confined space: the work comes to the tool.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## A joint, command by command
{: .pos-right}

<figure class="zoomable outdent-left" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/cell-solder.webp' | relative_url }}" class="no-invert" alt="The live page running the solder program: the slender arm beside the turntable, a resistor's lead held to the chip by a pincer, the program's 21 commands listed with the pincer step highlighted">
<figcaption>The solder program on the live page. Click to enlarge.</figcaption>
</figure>

The solder program shows one joint end to end. The arm puts a DIP-8 in the vise and brings a resistor's lead to pin 3, 0.1 mm apart. A pincer grips the lead and the arm leaves. The turntable presents the joint to the iron station, which touches it at 350 °C for two seconds and feeds 2 mm of solder wire, which melts, wets the joint and freezes when the iron backs away. The pincer lets go, and the resistor stays.

Under that is a thermal model. Each lead is a chain of 1 mm segments; the iron has a set point and a limited heater; the solder is flux-cored, and wets only while its flux is active. A joint is judged good or not when it freezes, a part can be damaged by too much heat, and a neighboring joint can remelt.

That first joint is judged weak, though: a lead's end against a leg holds by the solder alone.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Lap joints
{: .pos-left}

<figure class="zoomable outdent-right" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/cell-lap.webp' | relative_url }}" class="no-invert" alt="The live page running the lap program: the arm over the turntable, and the microscope's close-up of a resistor lead lying along a chip's leg">
<figcaption>A lap joint, with the microscope's close-up. Click to enlarge.</figcaption>
</figure>

A joint that holds has its lead lying alongside the leg: the end bent so that at least 3.2 mm (1/8 inch) of the two run parallel and touch. Less overlap, or a right-angle butt joint, is not strong enough. More is more metal to heat, for longer, nearer a part's limit, so the inspection flags a lap over 6.4 mm too.

To make one, the arm puts the resistor's lead into a bending rig, pins in slots that bend it 90 degrees 12 mm from the body, then shears it to a 4 mm end and lays that end along the chip's leg:

```
insert A on=R1.1 at=12            # the lead into the bending rig
form angle=90                     # bent 90 degrees there
shear A on=R1.1 at=17.2           # cut: an end of about 4 mm
bring A R1.1 to=U1.3.tip along=-0.934,0.356,0 lap=3.2
...
inspect U1.3+R1.1                 # good; a 3.6 mm lap
```

The microscope, on a pan-tilt head above the work, shows the joint close up.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Wrap joints
{: .pos-right}

<figure class="zoomable outdent-left" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/cell-wrap.webp' | relative_url }}" class="no-invert" alt="The live page running the wrap program: the arm holds the wrap tool over the chip, and the microscope's close-up shows an enameled wire wound round the end of a leg">
<figcaption>A wrap joint: the wire wound round a leg's end, seen through the microscope. Click to enlarge.</figcaption>
</figure>

Where a lap does not fit, on a crowded pin or at a jumper's end, a wire can be wrapped instead. Wound 1.5 turns or more round a lead's end, it holds before the solder flows. The wrap tool sits in the arm's rack: a bit whose sleeve slips over the lead's free end and winds the wire round it, and a small blade.

```
wire S5 awg=30 span=U1.4.tip+U1.5.tip wrap=1.75 enamel=yes
...                               # picked, cut, laid, pinched
tool A wrapper
present U1.4+W1.1 at=S1
wrap A on=W1.1 around=U1.4 turns=1.75
touch S1 at=U1.4+W1.1 dwell=1.5 temp=400
feed S1 mm=2 rate=1
back S1
wait until=U1.4+W1.1 below=100
snip A on=W1.1                    # the blade cuts the tail; the bit lifts off
inspect U1.4+W1.1                 # good; a wrap of 1.75 turns
```

The tool holds the wire while the iron solders, so the joint is already presented at the iron station when it winds. Fewer than 1.5 turns is judged weak, and the tool winds under two: two or more is refused, which keeps the tool simple. The wire is enameled, and the iron burns the enamel off where it heats.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## The 555 blinker
{: .pos-left}

<figure class="zoomable outdent-right" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/cell-blinker.webp' | relative_url }}" class="no-invert" alt="The live page near the end of the blinker program: the finished free-air circuit on the turntable, the program list beside it">
<figcaption>The 555 blinker, nearly done. Click to enlarge.</figcaption>
</figure>

The first whole circuit is a 555 LED blinker: an NE555P, three resistors, a 10 µF electrolytic, a 10 nF disc, a red LED and a 9 V battery snap, seven nets. The planner writes its program from the netlist (more on that below), and builds it dead-bug, every joint a lap. In the order the video shows it:

1. The chip goes in the vise legs up. Enameled jumpers join the legs that share a net while they are still bare: pin 8 to pin 4, then pin 6 to pin 2, laid over the first.
2. Then one part at a time, and each part finished before the next: its lead laid along its pin's leg, soldered, and then its other lead dealt with at once. The first resistor goes on pin 8, and a jumper with lapped ends runs from its other lead to pin 7, the discharge pin, brought in from the side. The second resistor goes on pin 6, with its own jumper to pin 7.
3. The third resistor goes on pin 3, the output. Nothing else of its other net is placed yet, so a pincer bends that free end straight up as a post.
4. The capacitors' straight leads are lowered from above, the disc onto pin 5 and the electrolytic onto pin 2, and a ground jumper runs from each to pin 1.
5. The LED's anode is lapped onto the third resistor's post, and a last ground jumper joins its cathode to pin 1.
6. The battery snap is set flat on the turntable beside the vise, and a jumper rises from each lead, past the jaw, to pin 8 and pin 1.

That is 367 commands and about 19 minutes of simulated time; the video plays it at four times speed.

It ends with the check against the netlist:

```
check: 7 of 7 nets made, nothing damaged: the work matches its netlist
```

What is simulated: every motion and collision, parts resting where they fall, forming and cutting leads and wire, the thermal network, each joint's lap and result, enamel burned off where the iron heats it, shorts, and the connections. What is illustrative: the materials' and machines' numbers, the joint rules' thresholds, and the electrical behavior. The circuit is checked for its connections, not run.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## The planner, in X_eTaL
{: .pos-center}

Writing a program like the blinker's by hand is slow; the first blinker was, written by a script that held the rules by hand. The planner is the slicer: it turns a netlist into a command program, and it is written in X_eTaL, working the placement out as arrays.

It began with four resistors on a DIP-8, each named with the pin it goes on. The blinker's netlist names nets instead, the pins each one joins:

```
circuit blinker
core U1 dip8
net VCC U1.8 U1.4 R1.1 BT1.1
net DIS U1.7 R1.2 R2.1
net THR U1.6 U1.2 R2.2 C1.1
net CTRL U1.5 C2.1
net OUT U1.3 R3.1
net LED R3.2 D1.1
net GND U1.1 C1.2 C2.2 D1.2 BT1.2
```

The planner proposes and the simulator disposes. The planner keeps a session cell in the simulator and tries each step on it (`ᶜᵉa̲ttempt`{:.language-xetal}): a step is kept only if every command in it is ok; otherwise the cell is left as it was, with the reason. For each step the planner has a list of candidates in order (straight, low over the middle of the chip, or routed out to the side and brought in from it; one pincer or the other), and keeps the first the simulator takes. Its rules are the ones the build above follows: the core's shared pins first, then the parts, the ones reaching farthest first so that they are not blocked, each part's other leads finished at once, and kitted parts like the battery snap last. The refusals stay in the program as comments, so you can see what it tried:

```
# refused: no bring A R2.1 to=U1.7.tip along=1,0,0 lap=3.2: collision: arm A's tool with R1.2 lead at 351.898 s
```

The planned blinker checks 7 of 7 nets, every joint a lap. Planning it takes some minutes, since every candidate is simulated. The planner says where and from which way; the simulator works out the motion, and has the last word.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Models, from X_eTaL through Blender
{: .pos-right}

<figure class="zoomable outdent-left" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/cell-models.webp' | relative_url }}" class="no-invert" alt="A contact sheet of every model in the cell, each from four sides: the arm, resistors, a diode, capacitors, DIP chips, an LED, transistors, the tool rack, the gantry, the rotary stage, a parts tray and the tools">
<figcaption>Every model, from four sides. Click to enlarge.</figcaption>
</figure>

Every piece of the cell is described in X_eTaL and built by Blender, through the Blender extension: the arm, the tools, the rack, the trays, the stage and vise, the microscope, and every kind of part, a resistor's color bands worked out from its value (`ᶜᵐb̲ands`{:.language-xetal}). The shapes are generic, imitating no product.

The arm's joints are nodes in the model, each turning about its own axis, with the pivots taken from the simulator. A check reads each model back: every node must be where its rig file says to 0.001 mm, and the arm, posed three ways, must put its flange where the simulator's kinematics does to 0.01 mm. Then the rig file Blender exported is the very file the simulator reads, so shape and kinematics have one source.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## An agent at the bench
{: .pos-left}

`xetal-cell-mcp` serves the cell over MCP, so an agent such as Claude Code can drive it command by command. Every command is a tool, its schema generated from the same command table the parser checks against, so a command added appears in the parser, the tools and the docs at once. There are tools to reset, run a whole program, rewind, inspect and read the state: every arm, part, joint and fixture, and where things are.

The server also serves the live page and pushes each result to it, so you can watch an agent's session as it happens. And the session can be saved as a program, which runs again to the same cell.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## What comes next
{: .pos-center}

The plan has more ahead of it:

- the second circuit, a two-transistor multivibrator, which needs heat management for its transistors;
- surface-mount parts, held pads up and wired with very fine enameled wire, a ball-grid-array chip included;
- sacrificial supports, a steel-wire frame welded on to hold a growing circuit and cut away at the end;
- reading parts from the microscope's picture, and testing each part electrically before it goes in;
- the planner choosing a wrap where a lap does not fit (the blinker needs none);
- the planner offered to agents over MCP, with insulation where nets cross.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Closing
{: .pos-right}

Mike: TODO, a closing in your words.
