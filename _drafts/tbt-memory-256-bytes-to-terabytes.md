---
layout: post
title: "TBT #14: 256 Bytes to Eight Terabytes --- Fifty Years of Memory, in Constant Dollars"
categories: [tbt, programming-history, retrocomputing, hardware, embedded]
tags: [throwback-thursday, memory, ram, dram, core-memory, cosmac-elf, elf-ii, rca-1802, trs-80, ibm-5100, ibm-1130, ibm-1800, ibm-pc, ems, xms, ibm-308x, ibm-3090, rs-6000, pmem, optane, raspberry-pi, esp32, arduino, cor24, inflation, charts]
keywords: "memory size history, RAM price history, dollars per megabyte, McCallum memory prices, constant dollars, CPI, Netronics ELF II 256 bytes, 4K static RAM board price, TRS-80 Expansion Interface 48K, IBM 5100 64K, IBM 1130 core memory words, IBM 1800, IBM PC 640K, EMS expanded memory, IBM 308X 4MB, IBM 3090 Model 200, RS/6000 1GB, Optane PMem 200, 8 TB, Arduino SRAM, ESP32 PSRAM, Raspberry Pi RAM, Luckfox Pico, LicheeRV Nano, Milk-V Duo, Atomic Pi, COR24-TB"
abstract: "The first computer I built from a kit had 256 bytes of memory. The biggest machine on my bench today takes eight terabytes. In between: core memory counted in words, a 4K static RAM card that cost nearly as much as the computer, the 640K wall and the memory that went around it, mainframes measured in megabytes, and a 1996 workstation with a gigabyte. Three charts --- how much, what it cost, how fast --- with the cost restated in 1977, 1985, 1995 and 2016 dollars; the past year, when memory prices went up fivefold for the first time in the series; a second table for the embedded boards, where memory still comes in four distinct sizes; and a question: should we be efficient with memory again?"
series: "Throwback Thursday"
series_part: 14
date: 2026-10-03 00:15:00 -0700
---

<img src="{{ '/assets/images/posts/block-ram.webp' | relative_url }}" class="post-marker no-invert" alt="Three generations of memory: a core plane, a PSRAM chip, a DDR5 SODIMM" style="width: 260px;">

<div style="overflow: hidden;" markdown="1">

The first computer I built from a kit had 256 bytes of memory. Not kilobytes: bytes. It was a Netronics COSMAC ELF II, an RCA 1802 on a board with a hex keypad, and the first thing I bought for it was more memory. The biggest machine on my bench today, a refurbished rack server with persistent memory modules, takes eight terabytes. This post is the road between those two numbers --- what the machines I used had, what a megabyte cost along the way in the money of the day and in constant dollars, and how long an access took --- and then a separate look at the embedded boards, where memory still comes in four distinct sizes.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Price data** | [John C. McCallum's memory price series](https://jcmit.net/memoryprice.htm), as mirrored and extended by the [memory-index project](https://github.com/fromknowware/memory-index/blob/main/research/ram-prices.md) and [AI Impacts](https://aiimpacts.org/trends-in-dram-price-per-gigabyte/) |
| **The last year** | [DDR5 up fivefold in a year](https://xenospectrum.com/en/ddr5-prices-5x-ai-hbm-memory-shortage-2026/) · [server modules fivefold in ten months](https://finance.biggo.com/news/05b5c7a3-e572-46db-bb87-487510fd762c) · [a 32 GB kit at $429](https://tech-insider.org/ddr5-ram-prices-2026-pc-builders/) · [why: HBM for AI](https://www.worldstream.com/en/ddr5-price-surge-server-infrastructure-budget-2026/) |
| **Inflation** | [BLS CPI-U annual averages](https://www.minneapolisfed.org/about-us/monetary-policy/inflation-calculator/consumer-price-index-1913-) via the Minneapolis Fed |
| **The machines** | [ELF II](https://en.wikipedia.org/wiki/ELF_II) · [TRS-80 Model I](https://www.trs-80.com/sub-models-model1.htm) · [IBM 5100](https://en.wikipedia.org/wiki/IBM_5100) · [IBM 1130 System Summary](https://www.bitsavers.org/pdf/ibm/1130/GA26-5917-9_1130_System_Summary_Dec71.pdf) · [IBM 1800](https://ethw.org/IBM_1800) · [IBM PC](https://en.wikipedia.org/wiki/IBM_Personal_Computer) · [Expanded memory](https://en.wikipedia.org/wiki/Expanded_memory) · [IBM 3090](https://en.wikipedia.org/wiki/IBM_3090) · [RS/6000 SP](https://en.wikipedia.org/wiki/IBM_RS/6000_SP) · [DL380 Gen10 Plus QuickSpecs](https://www.fbcinc.com/source/virtualhall_images/NLIT_June_21/Holmans/DL380_Gen_10_(1).pdf) |
| **Earlier posts** | [TBT #13: timelines of the tools](/2026/10/01/tbt-timelines-of-tools/) · [IBM 1130 emulator](/2026/02/26/ibm-1130-system-emulator/) · [TBT #8: BASIC on the TRS-80](/2026/04/16/tbt-cor24-basic-startrek-trs80-robot-chase/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="aside-box" markdown="1">

**On the numbers.** Machine sizes are the configurations I used or the documented maximums, as labeled; the refurbished machines are dated by their hardware, not by when I bought them. Prices are McCallum's lowest quoted price per megabyte for each year, in that year's dollars; the 1978 point is my own purchase. Constant dollars use CPI-U annual averages. Access times are typical for the technology of the year, not a measurement. Hover a point for its source line.

</div>

<style>
.memviz{--s1:#2a78d6;--s2:#eb6834;--s3:#1baf7a;--grid:var(--border-color);--ink:var(--text-color);--ink2:var(--text-secondary);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;width:100%;height:auto;display:block;margin:0.5em 0 0.2em}
[data-theme="dark"] .memviz{--s1:#3987e5;--s2:#d95926;--s3:#199e70}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) .memviz{--s1:#3987e5;--s2:#d95926;--s3:#199e70}}
.memviz text{fill:var(--ink);font-size:12px}
.memviz .tick{fill:var(--ink2);font-size:11px}
.memviz .grid{stroke:var(--grid);stroke-width:1}
.memviz .lbl{font-size:11px;fill:var(--ink2)}
.memviz .pt{opacity:.9}
.memviz .pt:hover{opacity:1}
.memviz .legend text{font-size:11px;fill:var(--ink2)}
</style>

<div class="clearfix" markdown="1">

## How much

The ELF II shipped with 256 bytes, in two RCA static RAM chips, and ran from a hex keypad and eight LEDs. Netronics sold a 4K static RAM expansion card for it --- $89.95 in the 1978 catalog, when the whole kit was $99.95 --- so the first upgrade I ever bought cost nearly as much as the computer and multiplied its memory by seventeen. Netronics sold 4K and 16K cards; I bought the smallest one on offer, and if a 1K card was ever sold I bought that, because it was cheaper. The price on the chart below is the 4K card's. The bus could take cards up to a theoretical 64K that nobody I knew reached. The mainboard had an expansion bus that looked like S-100 and was not; the cards were Netronics' own.

The TRS-80 Model I, from the same couple of years, came with 4K in the keyboard unit and could take 16K there; the Expansion Interface, the box the monitor sat on, added two more banks for 48K total. The Model III did the same inside one case. The IBM 5100 family I used from 1977 to 1981 came in 16K, 32K, 48K and 64K models, and those were bytes: the 5100's 16-bit address bus topped out at 64 KB, and the 5110 and 5120 kept the same ceiling.

The IBM 1130s I installed and repaired were the other direction: core memory, counted in 16-bit words. The 1131 came as 4K, 8K, 16K or 32K words, so a well-equipped one had 64 KB of core in a machine the size of a desk. The 1800, its process-control sibling, went further: 4K to 32K words of 18 bits in the standard models, and a maximum of 64K words with the storage extension, about 128 KB. Those numbers mattered because core did not forget when the power went off; the 1130 at a customer's site kept its program through the weekend.

The IBM PC started at 16 KB or 64 KB on the motherboard in 1981 and hit the 640 KB wall by 1984. The way around it came in 1985, Lotus, Intel and Microsoft's Expanded Memory Specification, which bank-switched up to 8 MB through a window in the top 384 KB; extended memory above 1 MB followed with the 286 and the XMS specification in 1988. The mainframes I worked on in the 1980s were a different world, though not as different as people assume: the 308X system I worked on first, a 3083 or 3084, had 4 MB, in a family that ran to 32 MB; later I had half of a partitioned 3090 Model 200, a 64 MB machine, so 32 MB was mine; the top 3090s of 1988 reached 512 MB. In 1996 I worked on an RS/6000 with a gigabyte, which was a number people came to look at; the SP wide nodes of those years took 1 or 2 GB.

Then the curve goes vertical. A 2016 laptop had 16 GB; the refurbished M1 Max MacBook I write this on has 64 GB, unified, so the GPU draws on the same pool. My largest systems now are refurbished: a Dell T7910 workstation with 576 GB, an HP DL380 Gen10 Plus 2U server with 640 GB, and another DL380 Gen10 Plus with Intel Optane Persistent Memory 200 modules, which that server will take to 8 TB fully populated. Mine is configured for a couple of terabytes and will go further. The whole first table in one figure:

</div>

<figure>
<svg class="memviz" viewBox="0 0 860 420" role="img" aria-label="Memory in the machines I used, 1977 to 2024, log scale">
<title>Memory in the machines I used, 1977 to 2024, log scale</title>
<line class="grid" x1="72" x2="840" y1="362.9" y2="362.9"/>
<text class="tick" x="66" y="366.9" text-anchor="end">256 B</text>
<line class="grid" x1="72" x2="840" y1="324.4" y2="324.4"/>
<text class="tick" x="66" y="328.4" text-anchor="end">4 KB</text>
<line class="grid" x1="72" x2="840" y1="285.8" y2="285.8"/>
<text class="tick" x="66" y="289.8" text-anchor="end">64 KB</text>
<line class="grid" x1="72" x2="840" y1="247.3" y2="247.3"/>
<text class="tick" x="66" y="251.3" text-anchor="end">1 MB</text>
<line class="grid" x1="72" x2="840" y1="199.1" y2="199.1"/>
<text class="tick" x="66" y="203.1" text-anchor="end">32 MB</text>
<line class="grid" x1="72" x2="840" y1="150.9" y2="150.9"/>
<text class="tick" x="66" y="154.9" text-anchor="end">1 GB</text>
<line class="grid" x1="72" x2="840" y1="102.7" y2="102.7"/>
<text class="tick" x="66" y="106.7" text-anchor="end">32 GB</text>
<line class="grid" x1="72" x2="840" y1="54.5" y2="54.5"/>
<text class="tick" x="66" y="58.5" text-anchor="end">1 TB</text>
<line class="grid" x1="72" x2="840" y1="25.6" y2="25.6"/>
<text class="tick" x="66" y="29.6" text-anchor="end">8 TB</text>
<text class="tick" x="101.5" y="394" text-anchor="middle">1977</text>
<text class="tick" x="219.7" y="394" text-anchor="middle">1985</text>
<text class="tick" x="367.4" y="394" text-anchor="middle">1995</text>
<text class="tick" x="515.1" y="394" text-anchor="middle">2005</text>
<text class="tick" x="677.5" y="394" text-anchor="middle">2016</text>
<text class="tick" x="795.7" y="394" text-anchor="middle">2024</text>
<g class="pt"><title>1977: IBM 1130, 8K words of core</title>
<circle cx="101.5" cy="305.1" r="6.5" fill="var(--bg-color)"/><circle cx="101.5" cy="305.1" r="4.5" fill="var(--s1)"/>
<text class="lbl" x="109.5" y="319.1" text-anchor="start">1130, 16 KB</text>
</g>
<g class="pt"><title>1977: IBM 1800, 64K words max</title>
<circle cx="101.5" cy="276.2" r="6.5" fill="var(--bg-color)"/><circle cx="101.5" cy="276.2" r="4.5" fill="var(--s1)"/>
<text class="lbl" x="109.5" y="268.2" text-anchor="start">1800, 128 KB</text>
</g>
<g class="pt"><title>1977: IBM 5100, 64 KB max</title>
<circle cx="101.5" cy="285.8" r="6.5" fill="var(--bg-color)"/><circle cx="101.5" cy="285.8" r="4.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>1978: ELF II as built, 256 bytes</title>
<circle cx="116.3" cy="362.9" r="6.5" fill="var(--bg-color)"/><circle cx="116.3" cy="362.9" r="4.5" fill="var(--s1)"/>
<text class="lbl" x="124.3" y="366.9" text-anchor="start">256 bytes: ELF II</text>
</g>
<g class="pt"><title>1978: ELF II + 4K static RAM card</title>
<circle cx="116.3" cy="323.5" r="6.5" fill="var(--bg-color)"/><circle cx="116.3" cy="323.5" r="4.5" fill="var(--s1)"/>
<text class="lbl" x="124.3" y="335.5" text-anchor="start">ELF II + 4K card</text>
</g>
<g class="pt"><title>1979: TRS-80 Model I, 4K to 16K</title>
<circle cx="131.1" cy="305.1" r="6.5" fill="var(--bg-color)"/><circle cx="131.1" cy="305.1" r="4.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>1980: TRS-80 + Expansion Interface, 48K</title>
<circle cx="145.8" cy="289.8" r="6.5" fill="var(--bg-color)"/><circle cx="145.8" cy="289.8" r="4.5" fill="var(--s1)"/>
<text class="lbl" x="185.8" y="293.8" text-anchor="start">TRS-80, 48 KB</text>
</g>
<g class="pt"><title>1982: IBM PC, 64 KB</title>
<circle cx="175.4" cy="285.8" r="6.5" fill="var(--bg-color)"/><circle cx="175.4" cy="285.8" r="4.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>1984: IBM PC, 640 KB</title>
<circle cx="204.9" cy="253.8" r="6.5" fill="var(--bg-color)"/><circle cx="204.9" cy="253.8" r="4.5" fill="var(--s1)"/>
<text class="lbl" x="212.9" y="257.8" text-anchor="start">PC, 640 KB</text>
</g>
<g class="pt"><title>1986: PC + EMS 3.2, 8 MB</title>
<circle cx="234.5" cy="218.4" r="6.5" fill="var(--bg-color)"/><circle cx="234.5" cy="218.4" r="4.5" fill="var(--s1)"/>
<text class="lbl" x="242.5" y="222.4" text-anchor="start">PC + EMS, 8 MB</text>
</g>
<g class="pt"><title>1983: IBM 308X, 4 MB</title>
<circle cx="190.2" cy="228.0" r="6.5" fill="var(--bg-color)"/><circle cx="190.2" cy="228.0" r="4.5" fill="var(--s1)"/>
<text class="lbl" x="182.2" y="232.0" text-anchor="end">308X, 4 MB</text>
</g>
<g class="pt"><title>1987: IBM 3090 Model 200, my half of 64 MB</title>
<circle cx="249.2" cy="199.1" r="6.5" fill="var(--bg-color)"/><circle cx="249.2" cy="199.1" r="4.5" fill="var(--s1)"/>
<text class="lbl" x="257.2" y="203.1" text-anchor="start">3090-200, half: 32 MB</text>
</g>
<g class="pt"><title>1996: RS/6000, 1 GB</title>
<circle cx="382.2" cy="150.9" r="6.5" fill="var(--bg-color)"/><circle cx="382.2" cy="150.9" r="4.5" fill="var(--s1)"/>
<text class="lbl" x="390.2" y="154.9" text-anchor="start">RS/6000, 1 GB</text>
</g>
<g class="pt"><title>2016: a laptop, 16 GB</title>
<circle cx="677.5" cy="112.4" r="6.5" fill="var(--bg-color)"/><circle cx="677.5" cy="112.4" r="4.5" fill="var(--s1)"/>
<text class="lbl" x="669.5" y="126.4" text-anchor="end">laptop, 16 GB</text>
</g>
<g class="pt"><title>2021: M1 Max MacBook, 64 GB unified (2021 hardware, bought refurbished)</title>
<circle cx="751.4" cy="93.1" r="6.5" fill="var(--bg-color)"/><circle cx="751.4" cy="93.1" r="4.5" fill="var(--s1)"/>
<text class="lbl" x="743.4" y="107.1" text-anchor="end">M1 Max, 64 GB</text>
</g>
<g class="pt"><title>2016: Dell T7910 workstation, 576 GB (2016 hardware, bought refurbished)</title>
<circle cx="677.5" cy="62.5" r="6.5" fill="var(--bg-color)"/><circle cx="677.5" cy="62.5" r="4.5" fill="var(--s1)"/>
<text class="lbl" x="669.5" y="66.5" text-anchor="end">T7910, 576 GB</text>
</g>
<g class="pt"><title>2021: HP DL380 Gen10 Plus, 640 GB (2021 hardware, bought refurbished)</title>
<circle cx="751.4" cy="61.1" r="6.5" fill="var(--bg-color)"/><circle cx="751.4" cy="61.1" r="4.5" fill="var(--s1)"/>
<text class="lbl" x="743.4" y="65.1" text-anchor="end">DL380, 640 GB</text>
</g>
<g class="pt"><title>2021: HP DL380 Gen10 Plus + PMem 200, up to 8 TB (2021 hardware)</title>
<circle cx="751.4" cy="25.6" r="6.5" fill="var(--bg-color)"/><circle cx="751.4" cy="25.6" r="4.5" fill="var(--s1)"/>
</g>
</svg>
<figcaption style="font-size: 0.85em;">Each dot is a machine I used, at the memory I had or the maximum the model took, placed at the year I used it --- except the refurbished machines at the right, which sit at the year their hardware was built, since that is when that much memory became ordinary; I bought them later. The axis is logarithmic: every gridline is a step of 4 to 32 times. Hover a dot for the detail.</figcaption>
</figure>

| Year | Machine | Memory | Note |
|---|---|---|---|
| 1977 | IBM 1130 | 4K to 32K words of core | 16-bit words; 8K words is 16 KB |
| 1977 | IBM 1800 | 4K to 32K words, 64K max | 18-bit words with parity and protect bits |
| 1977 | IBM 5100, 5110, 5120 | 16 KB to 64 KB | bytes; 64 KB is the 16-bit address limit |
| 1978 | Netronics ELF II | 256 bytes | RCA 1802; 4K and 16K static RAM cards |
| 1978 | ELF II + 4K card | 4 KB + 256 | $89.95 for the card, $99.95 for the kit |
| 1979 | TRS-80 Model I | 4 KB to 16 KB | in the keyboard unit |
| 1980 | TRS-80 + Expansion Interface | 48 KB | two more 16K banks in the Interface |
| 1981 | IBM PC | 16 KB or 64 KB | 640 KB with expansion cards |
| 1985 | PC + EMS | 8 MB expanded | bank-switched through a 64 KB window |
| 1983 | IBM 308X, a 3083 or 3084 | 4 MB | the family ran to 32 MB |
| 1987 | IBM 3090 Model 200 | 64 MB, my half 32 MB | a partitioned machine; the top 3090s reached 512 MB |
| 1996 | IBM RS/6000 | 1 GB | SP wide nodes took 1 or 2 GB |
| 2016 | Dell T7910 workstation | 576 GB | 2016 hardware, bought refurbished later |
| 2021 | M1 Max MacBook Pro | 64 GB unified | 2021 hardware, bought refurbished; CPU and GPU share it |
| 2021 | HP DL380 Gen10 Plus, 2U server | 640 GB | 2021 hardware, bought refurbished later |
| 2021 | HP DL380 Gen10 Plus + PMem 200 | 8 TB max | 16 modules of 512 GB; mine is partway there |

Logarithmic axes hide how big these numbers are. So, with apologies to xkcd: let 4 KB, the card I added to the ELF II, be a cube one centimeter on a side, a sugar cube, and build everything else out of sugar cubes. The 256 bytes I started with is a sixteenth of one.

<style>
.memviz.xkcd{--s1t:color-mix(in srgb,var(--s1) 55%,white);--s1d:color-mix(in srgb,var(--s1) 70%,black);--s2t:color-mix(in srgb,var(--s2) 55%,white);--s2d:color-mix(in srgb,var(--s2) 70%,black);--s3t:color-mix(in srgb,var(--s3) 55%,white);--s3d:color-mix(in srgb,var(--s3) 70%,black);font-family:"Chalkboard SE","Comic Sans MS","Segoe Print",cursive}
.memviz.xkcd .ttl{font-size:13px;fill:var(--ink)}
.memviz.xkcd .lbl{font-size:11px;fill:var(--ink2)}
</style>

<figure>
<svg class="memviz xkcd" viewBox="0 0 860 600" role="img" aria-label="Memory sizes as stacks of 4-kilobyte cubes, two zoom levels">
<title>If 4 KB were a one-centimeter cube: six memory sizes as stacks of them</title>
<text class="ttl" x="20.0" y="26.0" text-anchor="start">Centimeters. One cube is 4 KB and one centimeter on a side, a sugar cube.</text>
<polygon points="70,236 73.1748021039364,236 73.1748021039364,232.8251978960636 70,232.8251978960636" fill="var(--s1)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/><polygon points="73.1748021039364,236 74.7622031559046,234.4125989480318 74.7622031559046,231.2377968440954 73.1748021039364,232.8251978960636" fill="var(--s1d)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/><polygon points="70,232.8251978960636 73.1748021039364,232.8251978960636 74.7622031559046,231.2377968440954 71.5874010519682,231.2377968440954" fill="var(--s1t)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/>
<text class="lbl" x="86.0" y="254.0" text-anchor="middle">256 B</text>
<text class="lbl" x="86.0" y="269.0" text-anchor="middle">the ELF II as built</text>
<text class="lbl" x="86.0" y="284.0" text-anchor="middle">a sixteenth of a cube, 4 mm</text>
<polygon points="250,236 293.4306818655185,236 293.4306818655185,192.5693181344815 250,192.5693181344815" fill="var(--s1)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/><polygon points="293.4306818655185,236 315.1460227982778,214.28465906724074 315.1460227982778,170.85397720172224 293.4306818655185,192.5693181344815" fill="var(--s1d)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/><polygon points="250,192.5693181344815 293.4306818655185,192.5693181344815 315.1460227982778,170.85397720172224 271.71534093275926,170.85397720172224" fill="var(--s1t)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/>
<text class="lbl" x="282.6" y="254.0" text-anchor="middle">640 KB</text>
<text class="lbl" x="282.6" y="269.0" text-anchor="middle">the PC's ceiling</text>
<polygon points="460,236 588.0,236 588.0,108.00000000000001 460,108.00000000000001" fill="var(--s1)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/><polygon points="588.0,236 652.0,172.0 652.0,44.00000000000002 588.0,108.00000000000001" fill="var(--s1d)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/><polygon points="460,108.00000000000001 588.0,108.00000000000001 652.0,44.00000000000002 524.0,44.00000000000002" fill="var(--s1t)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/>
<text class="lbl" x="556.0" y="254.0" text-anchor="middle">16 MB</text>
<text class="lbl" x="556.0" y="269.0" text-anchor="middle">a 1990s PC</text>
<rect x="740" y="164" width="57.6" height="72" rx="8" fill="none" stroke="var(--ink2)" stroke-width="2"/><path d="M797.6,182.0 q25.2,0 25.2,18.0 q0,18.0 -25.2,18.0" fill="none" stroke="var(--ink2)" stroke-width="2"/>
<text class="lbl" x="776.0" y="254.0" text-anchor="middle">a coffee mug, 9 cm</text>
<text class="ttl" x="20.0" y="316.0" text-anchor="start">Meters. The same cubes, zoomed out fifty times: a person and a house for scale.</text>
<polygon points="60,536 70.24,536 70.24,525.76 60,525.76" fill="var(--s2)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/><polygon points="70.24,536 75.36,530.88 75.36,520.64 70.24,525.76" fill="var(--s2d)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/><polygon points="60,525.76 70.24,525.76 75.36,520.64 65.12,520.64" fill="var(--s2t)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/>
<text class="lbl" x="76.0" y="554.0" text-anchor="middle">1 GB</text>
<text class="lbl" x="76.0" y="569.0" text-anchor="middle">the 1996 RS/6000</text>
<text class="lbl" x="76.0" y="584.0" text-anchor="middle">64 cm on a side</text>
<polygon points="180,536 220.95999999999998,536 220.95999999999998,495.04 180,495.04" fill="var(--s2)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/><polygon points="220.95999999999998,536 241.43999999999997,515.52 241.43999999999997,474.56 220.95999999999998,495.04" fill="var(--s2d)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/><polygon points="180,495.04 220.95999999999998,495.04 241.43999999999997,474.56 200.48,474.56" fill="var(--s2t)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/>
<text class="lbl" x="210.7" y="554.0" text-anchor="middle">64 GB</text>
<text class="lbl" x="210.7" y="569.0" text-anchor="middle">the M1 Max, unified</text>
<text class="lbl" x="210.7" y="584.0" text-anchor="middle">2.6 m on a side</text>
<polygon points="290,536 378.2456449037059,536 378.2456449037059,447.7543550962941 290,447.7543550962941" fill="var(--s2)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/><polygon points="378.2456449037059,536 422.3684673555589,491.877177548147 422.3684673555589,403.6315326444411 378.2456449037059,447.7543550962941" fill="var(--s2d)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/><polygon points="290,447.7543550962941 378.2456449037059,447.7543550962941 422.3684673555589,403.6315326444411 334.122822451853,403.6315326444411" fill="var(--s2t)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/>
<text class="lbl" x="356.2" y="554.0" text-anchor="middle">640 GB</text>
<text class="lbl" x="356.2" y="569.0" text-anchor="middle">a refurbished server</text>
<text class="lbl" x="356.2" y="584.0" text-anchor="middle">5.5 m on a side</text>
<polygon points="440,536 570.0398941772348,536 570.0398941772348,405.9601058227652 440,405.9601058227652" fill="var(--s2)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/><polygon points="570.0398941772348,536 635.0598412658522,470.9800529113826 635.0598412658522,340.94015873414776 570.0398941772348,405.9601058227652" fill="var(--s2d)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/><polygon points="440,405.9601058227652 570.0398941772348,405.9601058227652 635.0598412658522,340.94015873414776 505.0199470886174,340.94015873414776" fill="var(--s2t)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/>
<text class="lbl" x="537.5" y="554.0" text-anchor="middle">2 TB</text>
<text class="lbl" x="537.5" y="569.0" text-anchor="middle">the PMem server</text>
<text class="lbl" x="537.5" y="584.0" text-anchor="middle">8.1 m on a side</text>
<circle cx="680" cy="509.792" r="2.592" fill="none" stroke="var(--ink)" stroke-width="2"/><line x1="680" y1="512.384" x2="680" y2="523.904" stroke="var(--ink)" stroke-width="2"/><line x1="674.816" y1="518.144" x2="685.184" y2="516.992" stroke="var(--ink)" stroke-width="2"/><line x1="680" y1="523.904" x2="675.968" y2="536" stroke="var(--ink)" stroke-width="2"/><line x1="680" y1="523.904" x2="684.032" y2="536" stroke="var(--ink)" stroke-width="2"/>
<text class="lbl" x="680.0" y="554.0" text-anchor="middle">1.8 m</text>
<rect x="710" y="456.0" width="128.0" height="80.0" fill="none" stroke="var(--ink2)" stroke-width="2"/><polygon points="704,456.0 774.0,408.0 844.0,456.0" fill="none" stroke="var(--ink2)" stroke-width="2"/>
<text class="lbl" x="774.0" y="554.0" text-anchor="middle">a house, 8 m</text>
</svg>
<figcaption style="font-size: 0.85em;">One sugar cube is 4 KB. The ELF II's 256 bytes is a 4 mm chip off one. The PC's 640 KB is 160 cubes, a block 5 cm on a side; a 1990s PC's 16 MB is 16 cm, bigger than the mug. Then the zoom: the 1996 gigabyte is a 64 cm cube, up to your waist; 640 GB is 5.5 m on a side, a two-story house; 2 TB is 8 m, the house to its ridge. Side of each cube is the cube root of bytes over 4,096, in centimeters.</figcaption>
</figure>

<div class="clearfix" markdown="1">

## What it cost

<div class="aside-box" markdown="1">

**"Never under $100."** Around 1980 an IBM architect and I were talking about the new hobby computers, and I said I hoped prices would keep falling until there was a $100 PC. He was adamant: *the power supply alone will never be under $100. The mechanical keyboard alone will never be under $100.* He did not need to get to memory, the CPU or the disk. Today the power supply is a $5 USB charger, the keyboard is $8, a display is $15 to $25, a $25 ARM or RISC-V board carries 32 to 256 MB of RAM, and a 256 MB SD card is $5 --- about $60 for the lot, or the same money for an assembled LilyGo T-Deck, an ESP32-S3 with a keyboard, screen and LoRa radio. And $100 in 1980 is over $400 today, which is the price of an entry-level laptop, a Chromebook, or a smartphone, if a virtual keyboard is allowed.

</div>

The price line is John McCallum's series, the lowest quoted price per megabyte each year, and it says the same thing for fifty years: a factor of ten about every five years until 2010, and much slower since. My ELF II card sits right on it. $89.95 for 4 KB is about $23,000 per megabyte in 1978 money. By the time I bought PC memory in the mid-1980s a megabyte was a few hundred dollars; in 1995 it was $30, and the next year, when I had the gigabyte workstation, about $7, which still made that gigabyte a $7,000 proposition before the machine around it. In 2024 a megabyte cost three tenths of a cent. Then the line turned around, for the first time in the series, and the green stub at the right end of the chart is that story; it gets its own section below.

The orange line is the same prices restated in 2026 dollars. It tells the same story a little steeper at the start, because a 1978 dollar was worth about five of today's.

</div>

<figure>
<svg class="memviz" viewBox="0 0 860 420" role="img" aria-label="What a megabyte of RAM cost, nominal dollars and 2026 dollars, log scale">
<title>What a megabyte of RAM cost, nominal dollars and 2026 dollars, log scale</title>
<line class="grid" x1="72" x2="840" y1="376.0" y2="376.0"/>
<text class="tick" x="66" y="380.0" text-anchor="end">$0.001</text>
<line class="grid" x1="72" x2="840" y1="340.0" y2="340.0"/>
<text class="tick" x="66" y="344.0" text-anchor="end">$0.01</text>
<line class="grid" x1="72" x2="840" y1="304.0" y2="304.0"/>
<text class="tick" x="66" y="308.0" text-anchor="end">$0.10</text>
<line class="grid" x1="72" x2="840" y1="268.0" y2="268.0"/>
<text class="tick" x="66" y="272.0" text-anchor="end">$1</text>
<line class="grid" x1="72" x2="840" y1="232.0" y2="232.0"/>
<text class="tick" x="66" y="236.0" text-anchor="end">$10</text>
<line class="grid" x1="72" x2="840" y1="196.0" y2="196.0"/>
<text class="tick" x="66" y="200.0" text-anchor="end">$100</text>
<line class="grid" x1="72" x2="840" y1="160.0" y2="160.0"/>
<text class="tick" x="66" y="164.0" text-anchor="end">$1,000</text>
<line class="grid" x1="72" x2="840" y1="124.0" y2="124.0"/>
<text class="tick" x="66" y="128.0" text-anchor="end">$10,000</text>
<line class="grid" x1="72" x2="840" y1="88.0" y2="88.0"/>
<text class="tick" x="66" y="92.0" text-anchor="end">$100,000</text>
<line class="grid" x1="72" x2="840" y1="52.0" y2="52.0"/>
<text class="tick" x="66" y="56.0" text-anchor="end">$1,000,000</text>
<line class="grid" x1="72" x2="840" y1="16.0" y2="16.0"/>
<text class="tick" x="66" y="20.0" text-anchor="end">$10,000,000</text>
<text class="tick" x="97.6" y="394" text-anchor="middle">1970</text>
<text class="tick" x="225.6" y="394" text-anchor="middle">1980</text>
<text class="tick" x="353.6" y="394" text-anchor="middle">1990</text>
<text class="tick" x="481.6" y="394" text-anchor="middle">2000</text>
<text class="tick" x="609.6" y="394" text-anchor="middle">2010</text>
<text class="tick" x="788.8" y="394" text-anchor="middle">2024</text>
<path d="M97.6,23.1 L200.0,85.4 L225.6,108.9 L238.4,116.2 L264.0,147.0 L289.6,157.2 L328.0,178.7 L353.6,193.1 L392.0,199.7 L417.6,202.5 L456.0,251.7 L481.6,256.8 L520.0,284.6 L545.6,291.5 L584.0,311.8 L609.6,330.4 L648.0,343.7 L686.4,353.6 L724.8,352.2 L763.2,356.7 L788.8,358.3" fill="none" stroke="var(--s2)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M97.6,56.8 L200.0,111.0 L225.6,130.8 L238.4,136.6 L264.0,165.9 L289.6,174.9 L328.0,194.9 L353.6,207.8 L392.0,212.9 L417.6,214.8 L456.0,263.0 L481.6,267.2 L520.0,294.0 L545.6,299.9 L584.0,318.7 L609.6,337.1 L648.0,349.3 L686.4,358.8 L724.8,356.4 L763.2,358.8 L788.8,359.4" fill="none" stroke="var(--s1)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
<g class="pt"><title>1970: $734,000/MB nominal</title>
<circle cx="97.6" cy="56.8" r="5.5" fill="var(--bg-color)"/><circle cx="97.6" cy="56.8" r="3.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>1978: $23,027/MB nominal</title>
<circle cx="200.0" cy="111.0" r="5.5" fill="var(--bg-color)"/><circle cx="200.0" cy="111.0" r="3.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>1980: $6,480/MB nominal</title>
<circle cx="225.6" cy="130.8" r="5.5" fill="var(--bg-color)"/><circle cx="225.6" cy="130.8" r="3.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>1981: $4,479/MB nominal</title>
<circle cx="238.4" cy="136.6" r="5.5" fill="var(--bg-color)"/><circle cx="238.4" cy="136.6" r="3.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>1983: $685/MB nominal</title>
<circle cx="264.0" cy="165.9" r="5.5" fill="var(--bg-color)"/><circle cx="264.0" cy="165.9" r="3.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>1985: $385/MB nominal</title>
<circle cx="289.6" cy="174.9" r="5.5" fill="var(--bg-color)"/><circle cx="289.6" cy="174.9" r="3.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>1988: $107/MB nominal</title>
<circle cx="328.0" cy="194.9" r="5.5" fill="var(--bg-color)"/><circle cx="328.0" cy="194.9" r="3.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>1990: $47/MB nominal</title>
<circle cx="353.6" cy="207.8" r="5.5" fill="var(--bg-color)"/><circle cx="353.6" cy="207.8" r="3.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>1993: $34/MB nominal</title>
<circle cx="392.0" cy="212.9" r="5.5" fill="var(--bg-color)"/><circle cx="392.0" cy="212.9" r="3.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>1995: $30/MB nominal</title>
<circle cx="417.6" cy="214.8" r="5.5" fill="var(--bg-color)"/><circle cx="417.6" cy="214.8" r="3.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>1998: $1/MB nominal</title>
<circle cx="456.0" cy="263.0" r="5.5" fill="var(--bg-color)"/><circle cx="456.0" cy="263.0" r="3.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>2000: $1/MB nominal</title>
<circle cx="481.6" cy="267.2" r="5.5" fill="var(--bg-color)"/><circle cx="481.6" cy="267.2" r="3.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>2003: $0.19/MB nominal</title>
<circle cx="520.0" cy="294.0" r="5.5" fill="var(--bg-color)"/><circle cx="520.0" cy="294.0" r="3.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>2005: $0.13/MB nominal</title>
<circle cx="545.6" cy="299.9" r="5.5" fill="var(--bg-color)"/><circle cx="545.6" cy="299.9" r="3.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>2008: $0.04/MB nominal</title>
<circle cx="584.0" cy="318.7" r="5.5" fill="var(--bg-color)"/><circle cx="584.0" cy="318.7" r="3.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>2010: $0.01/MB nominal</title>
<circle cx="609.6" cy="337.1" r="5.5" fill="var(--bg-color)"/><circle cx="609.6" cy="337.1" r="3.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>2013: $0.005/MB nominal</title>
<circle cx="648.0" cy="349.3" r="5.5" fill="var(--bg-color)"/><circle cx="648.0" cy="349.3" r="3.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>2016: $0.003/MB nominal</title>
<circle cx="686.4" cy="358.8" r="5.5" fill="var(--bg-color)"/><circle cx="686.4" cy="358.8" r="3.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>2019: $0.004/MB nominal</title>
<circle cx="724.8" cy="356.4" r="5.5" fill="var(--bg-color)"/><circle cx="724.8" cy="356.4" r="3.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>2022: $0.003/MB nominal</title>
<circle cx="763.2" cy="358.8" r="5.5" fill="var(--bg-color)"/><circle cx="763.2" cy="358.8" r="3.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>2024: $0.003/MB nominal</title>
<circle cx="788.8" cy="359.4" r="5.5" fill="var(--bg-color)"/><circle cx="788.8" cy="359.4" r="3.5" fill="var(--s1)"/>
</g>
<g class="pt"><title>1970: $6,337,371/MB in 2026 dollars</title>
<circle cx="97.6" cy="23.1" r="5.5" fill="var(--bg-color)"/><circle cx="97.6" cy="23.1" r="3.5" fill="var(--s2)"/>
</g>
<g class="pt"><title>1978: $118,315/MB in 2026 dollars</title>
<circle cx="200.0" cy="85.4" r="5.5" fill="var(--bg-color)"/><circle cx="200.0" cy="85.4" r="3.5" fill="var(--s2)"/>
</g>
<g class="pt"><title>1980: $26,345/MB in 2026 dollars</title>
<circle cx="225.6" cy="108.9" r="5.5" fill="var(--bg-color)"/><circle cx="225.6" cy="108.9" r="3.5" fill="var(--s2)"/>
</g>
<g class="pt"><title>1981: $16,507/MB in 2026 dollars</title>
<circle cx="238.4" cy="116.2" r="5.5" fill="var(--bg-color)"/><circle cx="238.4" cy="116.2" r="3.5" fill="var(--s2)"/>
</g>
<g class="pt"><title>1983: $2,304/MB in 2026 dollars</title>
<circle cx="264.0" cy="147.0" r="5.5" fill="var(--bg-color)"/><circle cx="264.0" cy="147.0" r="3.5" fill="var(--s2)"/>
</g>
<g class="pt"><title>1985: $1,199/MB in 2026 dollars</title>
<circle cx="289.6" cy="157.2" r="5.5" fill="var(--bg-color)"/><circle cx="289.6" cy="157.2" r="3.5" fill="var(--s2)"/>
</g>
<g class="pt"><title>1988: $303/MB in 2026 dollars</title>
<circle cx="328.0" cy="178.7" r="5.5" fill="var(--bg-color)"/><circle cx="328.0" cy="178.7" r="3.5" fill="var(--s2)"/>
</g>
<g class="pt"><title>1990: $120/MB in 2026 dollars</title>
<circle cx="353.6" cy="193.1" r="5.5" fill="var(--bg-color)"/><circle cx="353.6" cy="193.1" r="3.5" fill="var(--s2)"/>
</g>
<g class="pt"><title>1993: $79/MB in 2026 dollars</title>
<circle cx="392.0" cy="199.7" r="5.5" fill="var(--bg-color)"/><circle cx="392.0" cy="199.7" r="3.5" fill="var(--s2)"/>
</g>
<g class="pt"><title>1995: $66/MB in 2026 dollars</title>
<circle cx="417.6" cy="202.5" r="5.5" fill="var(--bg-color)"/><circle cx="417.6" cy="202.5" r="3.5" fill="var(--s2)"/>
</g>
<g class="pt"><title>1998: $3/MB in 2026 dollars</title>
<circle cx="456.0" cy="251.7" r="5.5" fill="var(--bg-color)"/><circle cx="456.0" cy="251.7" r="3.5" fill="var(--s2)"/>
</g>
<g class="pt"><title>2000: $2/MB in 2026 dollars</title>
<circle cx="481.6" cy="256.8" r="5.5" fill="var(--bg-color)"/><circle cx="481.6" cy="256.8" r="3.5" fill="var(--s2)"/>
</g>
<g class="pt"><title>2003: $0.35/MB in 2026 dollars</title>
<circle cx="520.0" cy="284.6" r="5.5" fill="var(--bg-color)"/><circle cx="520.0" cy="284.6" r="3.5" fill="var(--s2)"/>
</g>
<g class="pt"><title>2005: $0.22/MB in 2026 dollars</title>
<circle cx="545.6" cy="291.5" r="5.5" fill="var(--bg-color)"/><circle cx="545.6" cy="291.5" r="3.5" fill="var(--s2)"/>
</g>
<g class="pt"><title>2008: $0.06/MB in 2026 dollars</title>
<circle cx="584.0" cy="311.8" r="5.5" fill="var(--bg-color)"/><circle cx="584.0" cy="311.8" r="3.5" fill="var(--s2)"/>
</g>
<g class="pt"><title>2010: $0.02/MB in 2026 dollars</title>
<circle cx="609.6" cy="330.4" r="5.5" fill="var(--bg-color)"/><circle cx="609.6" cy="330.4" r="3.5" fill="var(--s2)"/>
</g>
<g class="pt"><title>2013: $0.008/MB in 2026 dollars</title>
<circle cx="648.0" cy="343.7" r="5.5" fill="var(--bg-color)"/><circle cx="648.0" cy="343.7" r="3.5" fill="var(--s2)"/>
</g>
<g class="pt"><title>2016: $0.004/MB in 2026 dollars</title>
<circle cx="686.4" cy="353.6" r="5.5" fill="var(--bg-color)"/><circle cx="686.4" cy="353.6" r="3.5" fill="var(--s2)"/>
</g>
<g class="pt"><title>2019: $0.005/MB in 2026 dollars</title>
<circle cx="724.8" cy="352.2" r="5.5" fill="var(--bg-color)"/><circle cx="724.8" cy="352.2" r="3.5" fill="var(--s2)"/>
</g>
<g class="pt"><title>2022: $0.003/MB in 2026 dollars</title>
<circle cx="763.2" cy="356.7" r="5.5" fill="var(--bg-color)"/><circle cx="763.2" cy="356.7" r="3.5" fill="var(--s2)"/>
</g>
<g class="pt"><title>2024: $0.003/MB in 2026 dollars</title>
<circle cx="788.8" cy="358.3" r="5.5" fill="var(--bg-color)"/><circle cx="788.8" cy="358.3" r="3.5" fill="var(--s2)"/>
</g>
<g class="pt"><title>1978: Netronics 4K static RAM board, $89.95</title>
<circle cx="200.0" cy="111.0" r="6.5" fill="var(--bg-color)"/><circle cx="200.0" cy="111.0" r="4.5" fill="var(--s1)"/>
<text class="lbl" x="210.0" y="125.0" text-anchor="start">1978: the ELF II 4K card, $23,000/MB</text>
</g>
<circle cx="417.6" cy="214.8" r="6.5" fill="var(--bg-color)"/><circle cx="417.6" cy="214.8" r="4.5" fill="var(--s1)"/>
<text class="lbl" x="427.6" y="228.8" text-anchor="start">1995: $30/MB</text>
<circle cx="788.8" cy="359.4" r="6.5" fill="var(--bg-color)"/><circle cx="788.8" cy="359.4" r="4.5" fill="var(--s1)"/>
<text class="lbl" x="778.8" y="349.4" text-anchor="end">2024: 0.3 cents per MB</text>
<path d="M809.3,360.2 L822.1,335.8" fill="none" stroke="var(--s3)" stroke-width="2" stroke-linecap="round"/>
<g class="pt"><title>August 2025: a 32 GB DDR5 kit, about $90</title>
<circle cx="809.3" cy="360.2" r="6" fill="var(--bg-color)"/><circle cx="809.3" cy="360.2" r="4" fill="var(--s3)"/>
</g>
<g class="pt"><title>August 2026: the same 32 GB DDR5 kit, about $429</title>
<circle cx="822.1" cy="335.8" r="6.5" fill="var(--bg-color)"/><circle cx="822.1" cy="335.8" r="4.5" fill="var(--s3)"/>
<text class="lbl" x="812.1" y="301.8" text-anchor="end">a 32 GB DDR5 kit: $90 in 2025, $429 in 2026</text>
</g>
<g class="legend"><line x1="88" y1="314.8370798439033" x2="112" y2="314.8370798439033" stroke="var(--s1)" stroke-width="2"/><text x="118" y="318.8370798439033">nominal dollars</text><line x1="88" y1="332.8370798439033" x2="112" y2="332.8370798439033" stroke="var(--s2)" stroke-width="2"/><text x="118" y="336.8370798439033">2026 dollars</text><line x1="88" y1="350.8370798439033" x2="112" y2="350.8370798439033" stroke="var(--s3)" stroke-width="2"/><text x="118" y="354.8370798439033">retail DDR5 kit, 2025 to 2026</text></g>
</svg>
<figcaption style="font-size: 0.85em;">Price per megabyte of RAM, McCallum's series with my 1978 card added. Blue is the dollars of the day; orange is the same prices in 2026 dollars. Both axes are logarithmic.</figcaption>
</figure>

## The last year: five times

For fifty years the only direction on that chart was down. In 2025 and 2026 it went up, hard. A 32 GB DDR5 kit that cost about $90 in the summer of 2025 cost $429 to $500 a year later; server-grade 32 GB DDR5 RDIMMs went past $2,000, more than fivefold in ten months. The cause is not a shortage of fabs but a change in what they make: Samsung, SK Hynix and Micron moved capacity to high-bandwidth memory for AI accelerators, which earns more per wafer and uses about three times the wafer area per gigabyte, and ordinary DRAM got what was left. Micron has said the squeeze lasts into 2028. On the log chart it is a small green stub, because the axis spans seven orders of magnitude; on a monthly budget it is the difference between a $90 upgrade and a $450 one, and the first time in my career that waiting a year made memory cost more.

The constant-dollar question is more interesting asked the other way: what did a megabyte cost in the money of a particular year of my career? Here are six years of prices restated in 1977, 1985, 1995 and 2016 dollars.

| Year | Nominal $/MB | in 1977 $ | in 1985 $ | in 1995 $ | in 2016 $ |
|---|---|---|---|---|---|
| 1978 | $23,027 | $21,403 | $38,002 | $53,824 | $84,763 |
| 1985 | $385 | $217 | $385 | $545 | $859 |
| 1995 | $30.00 | $11.93 | $21.18 | $30.00 | $47.24 |
| 2005 | $0.1300 | $0.0403 | $0.0716 | $0.1014 | $0.1598 |
| 2016 | $0.0030 | $0.0008 | $0.0013 | $0.0019 | $0.0030 |
| 2024 | $0.0029 | $0.0006 | $0.0010 | $0.0014 | $0.0022 |

And what a fixed sum bought. The second column takes the $89.95 I paid for 4 KB in 1978, converts it to each year's dollars, and spends it on memory at that year's price:

| Year | What $100 bought | What the 1978 card's $89.95 buys, in that year's money |
|---|---|---|
| 1978 | 4.4 KB | 4 KB |
| 1985 | 266 KB | 395 KB |
| 1995 | 3.3 MB | 7.0 MB |
| 2005 | 769 MB | 2.0 GB |
| 2016 | 33 GB | 108 GB |
| 2024 | 34 GB | 146 GB |


<div class="clearfix" markdown="1">

## How fast

Speed moved less than size or price, and that gap is most of what computer architecture has been about since. The 1130's core cycled in 3.6 microseconds. The ELF II's static RAM answered in a few hundred nanoseconds, and the IBM PC's DRAM in about 200, roughly its clock period. By 1990 DRAM was at 80 nanoseconds, by 2000 around 50, and then the access time of the memory array itself stopped moving much: DDR3, DDR4 and DDR5 all sit near 13 to 15 nanoseconds of latency, with the bandwidth climbing instead. Persistent memory trades some of that back: Optane PMem answers in a few hundred nanoseconds, slower than DRAM and a thousand times faster than a disk, which is the whole reason to have it.

</div>

<figure>
<svg class="memviz" viewBox="0 0 860 420" role="img" aria-label="How long a memory access took, nanoseconds, log scale">
<title>How long a memory access took, nanoseconds, log scale</title>
<line class="grid" x1="72" x2="840" y1="343.2" y2="343.2"/>
<text class="tick" x="66" y="347.2" text-anchor="end">10 ns</text>
<line class="grid" x1="72" x2="840" y1="234.1" y2="234.1"/>
<text class="tick" x="66" y="238.1" text-anchor="end">100 ns</text>
<line class="grid" x1="72" x2="840" y1="125.1" y2="125.1"/>
<text class="tick" x="66" y="129.1" text-anchor="end">1,000 ns</text>
<line class="grid" x1="72" x2="840" y1="16.0" y2="16.0"/>
<text class="tick" x="66" y="20.0" text-anchor="end">10,000 ns</text>
<text class="tick" x="101.5" y="394" text-anchor="middle">1977</text>
<text class="tick" x="219.7" y="394" text-anchor="middle">1985</text>
<text class="tick" x="367.4" y="394" text-anchor="middle">1995</text>
<text class="tick" x="515.1" y="394" text-anchor="middle">2005</text>
<text class="tick" x="677.5" y="394" text-anchor="middle">2016</text>
<text class="tick" x="795.7" y="394" text-anchor="middle">2024</text>
<g class="pt"><title>1977: IBM 1130 core, 3.6 us</title>
<circle cx="101.5" cy="64.4" r="6.5" fill="var(--bg-color)"/><circle cx="101.5" cy="64.4" r="4.5" fill="var(--s3)"/>
<text class="lbl" x="109.5" y="68.4" text-anchor="start">IBM 1130 core, 3.6 us</text>
</g>
<g class="pt"><title>1978: ELF II static RAM, ~450 ns</title>
<circle cx="116.3" cy="162.9" r="6.5" fill="var(--bg-color)"/><circle cx="116.3" cy="162.9" r="4.5" fill="var(--s3)"/>
<text class="lbl" x="124.3" y="166.9" text-anchor="start">ELF II static RAM, ~450 ns</text>
</g>
<g class="pt"><title>1982: IBM PC DRAM, ~200 ns</title>
<circle cx="175.4" cy="201.3" r="6.5" fill="var(--bg-color)"/><circle cx="175.4" cy="201.3" r="4.5" fill="var(--s3)"/>
<text class="lbl" x="183.4" y="205.3" text-anchor="start">IBM PC DRAM, ~200 ns</text>
</g>
<g class="pt"><title>1990: 80 ns DRAM</title>
<circle cx="293.5" cy="244.7" r="6.5" fill="var(--bg-color)"/><circle cx="293.5" cy="244.7" r="4.5" fill="var(--s3)"/>
<text class="lbl" x="301.5" y="248.7" text-anchor="start">80 ns DRAM</text>
</g>
<g class="pt"><title>2000: PC133 SDRAM, ~50 ns</title>
<circle cx="441.2" cy="266.9" r="6.5" fill="var(--bg-color)"/><circle cx="441.2" cy="266.9" r="4.5" fill="var(--s3)"/>
<text class="lbl" x="449.2" y="270.9" text-anchor="start">PC133 SDRAM, ~50 ns</text>
</g>
<g class="pt"><title>2010: DDR3, ~13 ns</title>
<circle cx="588.9" cy="330.7" r="6.5" fill="var(--bg-color)"/><circle cx="588.9" cy="330.7" r="4.5" fill="var(--s3)"/>
<text class="lbl" x="596.9" y="322.7" text-anchor="start">DDR3, ~13 ns</text>
</g>
<g class="pt"><title>2016: DDR4, ~14 ns</title>
<circle cx="677.5" cy="327.2" r="6.5" fill="var(--bg-color)"/><circle cx="677.5" cy="327.2" r="4.5" fill="var(--s3)"/>
<text class="lbl" x="685.5" y="343.2" text-anchor="start">DDR4, ~14 ns</text>
</g>
<g class="pt"><title>2024: DDR5, ~14 ns</title>
<circle cx="795.7" cy="327.2" r="6.5" fill="var(--bg-color)"/><circle cx="795.7" cy="327.2" r="4.5" fill="var(--s3)"/>
<text class="lbl" x="787.7" y="331.2" text-anchor="end">DDR5, ~14 ns</text>
</g>
<g class="pt"><title>2024: Optane PMem 200, ~300 ns</title>
<circle cx="795.7" cy="182.1" r="6.5" fill="var(--bg-color)"/><circle cx="795.7" cy="182.1" r="4.5" fill="var(--s3)"/>
<text class="lbl" x="787.7" y="186.1" text-anchor="end">Optane PMem 200, ~300 ns</text>
</g>
</svg>
<figcaption style="font-size: 0.85em;">Typical access time for the memory technology of each machine, log scale. Three orders of magnitude in fifty years, against twelve for capacity and seven for price.</figcaption>
</figure>

<div class="clearfix" markdown="1">

<div class="clearfix" markdown="1">

<div class="clearfix" markdown="1">

<div class="clearfix" markdown="1">

<div class="clearfix" markdown="1">

<div class="clearfix" markdown="1">

<div class="clearfix" markdown="1">

<div class="clearfix" markdown="1">

<div class="clearfix" markdown="1">

<div class="clearfix" markdown="1">

<div class="clearfix" markdown="1">

## The embedded boards: four sizes, not one line

The boards on my bench now do not belong on the chart above, because they are not one line. They come in four distinct classes of memory, and which class a board is in decides what it can run far more than its clock speed does.

| Class | Memory | Boards | What fits |
|---|---|---|---|
| **Tiny** | under 512 KB of SRAM | Arduino Uno, 2 KB · Arduino Mega, 8 KB · Arduino Due, 96 KB · ESP8266, about 160 KB · Raspberry Pi Pico, 264 KB · ESP32-C3, 400 KB | a program and its state; no heap to speak of |
| **Small** | 512 KB to a few MB | ESP32, 520 KB SRAM plus up to 8 MB PSRAM · ESP32-S3, 512 KB plus 8 MB PSRAM · COR24-TB, 1 MB SRAM | an interpreter, buffers, a small language runtime |
| **Medium** | 32 MB to 512 MB | Luckfox Pico, 64 MB · Milk-V Duo, 64 MB · Milk-V Duo 256M, 256 MB · LicheeRV Nano, 256 MB · Milk-V Duo S, 512 MB · Raspberry Pi Zero, 512 MB | Linux, a shell, a language and its libraries |
| **Large** | 1 GB to 16 GB | Raspberry Pi 2 and 3, 1 GB · Atomic Pi, 2 GB · Raspberry Pi 4, 1 to 8 GB · Raspberry Pi 5, 2 to 16 GB | a desktop, a build, a small model |

The tiny class is the ELF II's world with better tools: the Uno's 2 KB is eight times my first kit and a quarter of the TRS-80 I had next. The small class is where the COR24-TB sits, a megabyte of SRAM in an FPGA, which is more than any machine in the first table had until the PC's 640 KB wall and enough to run an APL. The medium class is the 1980s mainframe in a board the size of a stick of gum: the Luckfox and the Duo have sixteen times the 4 MB of the 308X I worked on in 1983, and the Duo S has as much as the 3090 I shared. And the large class, the Pis, run past the 1996 gigabyte workstation on the low end and reach a 2016 laptop at the top.

</div>

<div class="clearfix" markdown="1">

</div>

<div class="clearfix" markdown="1">

</div>

<div class="clearfix" markdown="1">

</div>

<div class="clearfix" markdown="1">

</div>

<div class="clearfix" markdown="1">

</div>

<div class="clearfix" markdown="1">

</div>

<div class="clearfix" markdown="1">

</div>

<div class="clearfix" markdown="1">

</div>

<div class="clearfix" markdown="1">

</div>

<div class="clearfix" markdown="1">

</div>

<div class="clearfix" markdown="1">

## What the fifty years say

Three curves, three different slopes. Capacity went up twelve orders of magnitude, from 256 bytes to 8 terabytes. Price per megabyte fell seven, from $23,000 to a fraction of a cent, and in constant dollars a bit more. Access time improved by about three, and then stopped, which is why every machine since the 1990s has been mostly cache. The embedded table is the reminder that all four of those eras are still for sale, at the same time, for under fifty dollars each --- and that choosing a board is choosing which decade of memory you want to program in.

And the last year adds a fourth slope, pointing the wrong way. For my whole career the right answer to a memory problem was to wait: the next machine would have more, cheaper. Programs were written on that assumption, and so were languages, runtimes, frameworks and browsers. If a megabyte now costs five times what it did a year ago and the people who make it say that holds until 2028, the assumption is off for a while, and the skill that the 256-byte ELF II, the 4K core 1130 and the 2 KB Arduino all demand --- knowing what every byte is for --- is worth having again. Maybe we should be more efficient with memory, again. The tiny and small boards in the table above are a good place to practice, and an array language that keeps a whole computation in a few typed arrays is not a bad one either.

</div>
