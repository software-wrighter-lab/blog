---
layout: post
title: "Embedded #1: BMP280 Driver --- From Prototype to Patent Proof-of-Concept"
date: 2026-03-17 00:15:00 -0800
categories: [embedded-systems, rust]
tags: [embedded, bmp280, i2c, pressure-sensor, raspberry-pi, no_std, embedded-hal, multiplexer]
keywords: "BMP280, pressure sensor, I2C, embedded Rust, no_std, embedded-hal, TCA9548A, multiplexer, Raspberry Pi, BMP581, sensor array, calibration, barometric pressure, MIKROE Pressure 21 Click"
author: Software Wrighter
abstract: "A no_std Rust driver for the BMP280 pressure sensor, extended to support dozens of sensors via I2C multiplexers for a patent proof-of-concept. The journey from single-sensor to multi-mux arrays, and the eventual upgrade to BMP581."
series: "Embedded"
series_part: 1
repo_url: "https://github.com/sw-embed/bmp280"
---

<img src="{{ '/assets/images/posts/block-bmp280.webp' | relative_url }}" class="post-marker" alt="" style="width: 200px;">

<div style="overflow: hidden;" markdown="1">

A colleague had a patent application that needed empirical data: pressure measurements from multiple sensors at two physical locations, with enough redundancy to establish statistical confidence. Off-the-shelf solutions weren't flexible enough, so we built the whole stack in Rust---from the sensor driver up through data collection, analysis, and plotting.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Source** | [GitHub](https://github.com/sw-embed/bmp280) |
| **Docs** | [Multi-sensor guide](https://github.com/sw-embed/bmp280/blob/master/docs/multiple-sensor-support.md) |
| **References** | [Datasheets, patent, hardware](#references) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

---

## The Problem

We needed high-resolution barometric pressure data from dozens of sensors split across two physical locations. Each location needed multiple sensors---not just for coverage, but because averaging across several readings reduces noise and gives more trustworthy measurements. A single BMP280 reading has enough jitter that you want redundancy.

The existing BMP280 driver crate worked fine for one sensor at the default address. We needed it to support both I2C addresses so we could put two sensors on each bus---and then use multiplexers to scale that to many.

---

## Why Fork the Driver?

The original `bmp280-ehal` crate is a platform-agnostic, `no_std` Rust driver built on `embedded-hal` traits. It runs on anything from bare-metal microcontrollers to Raspberry Pi. But it had a limitation: it assumed the default I2C address (`0x76`) and had no way to talk to a second sensor at the alternate address (`0x77`).

I needed the driver to address both `0x76` and `0x77`---two sensors per bus instead of one. That change alone doubled capacity, and multiplexers would scale it from there. So I forked the driver and made three changes:

### Commit 1: Refactor constructor (`0b66fda`)

Simplified the API by removing the implicit address tracking. The old constructor tied the driver to a single address at creation time. The refactored version makes `read_calibration()` public and removes the stored address, laying the groundwork for multi-address support.

### Commit 2: Per-sensor calibration (`d393bd6`)

The structural change that enables multi-sensor support. Instead of flat calibration fields on the driver struct, this commit introduces:

- **`TempComp`** and **`PressureComp`** structs for temperature and pressure compensation data
- **`Sensors`** container holding `Option<TempComp>` and `Option<PressureComp>` for both addresses (`0x76` and `0x77`)
- Every reading method now takes an explicit address parameter

Each BMP280 ships with unique factory calibration coefficients baked into its NVM. The driver reads 24 bytes of calibration data per sensor and stores it independently. This matters because the compensation polynomial uses 12 coefficients---get them wrong and your pressure reading is meaningless.

### Commit 3: Documentation and multi-sensor guide (`21f16dc`)

Updated the README and added comprehensive documentation in `docs/multiple-sensor-support.md` covering:

- Two sensors on one bus (differential pressure)
- I2C multiplexer topologies (TCA9548A, PCA9546A, TCA9543A)
- Cascading mux trees for large sensor arrays
- I2C extenders for long-distance distribution

---

## The Hardware Setup

### Doubling capacity with dual addresses

The BMP280 supports two I2C addresses (`0x76` and `0x77`), selected by the SDO pin. The old driver only tracked one. The new driver stores calibration for both, doubling capacity in every topology:

| Topology | Old driver | New driver |
|----------|-----------|------------|
| Single I2C bus | 1 | **2** |
| 8-channel mux | 8 | **16** |
| 8 muxes × 8 channels | 64 | **128** |

<img src="{{ '/assets/images/posts/i2c-mux.webp' | relative_url }}" alt="I2C multiplexer" style="width: 200px; float: right; margin: 0 0 1em 1em;">

### Multiplexer arrays

For the patent prototype, we used TCA9548A 8-channel I2C multiplexers. Each mux channel is an electrically isolated I2C bus, so sensors on different channels can share the same address:

```text
                          ┌─── ch 0 ─── BMP280 (0x76) + BMP280 (0x77)
  Pi ── I2C ── TCA9548A ──┼─── ch 1 ─── BMP280 (0x76) + BMP280 (0x77)
               (addr 0x70) ├─── ch 2 ─── BMP280 (0x76) + BMP280 (0x77)
                          └─── ...         (up to 16 sensors per mux)
```

A Raspberry Pi at each location ran a Rust application on Linux that cycled through mux channels, read calibrated pressure/temperature data from every sensor, and logged the raw values. A separate PC-based Rust application pulled the log files for analysis, producing plots and spreadsheets.

---

<img src="{{ '/assets/images/posts/bmp580.webp' | relative_url }}" alt="BMP581 sensor" style="width: 200px; float: right; margin: 0 0 1em 1em;">

## What We Learned: BMP280 → BMP581

The BMP280 worked for the initial proof-of-concept, but we hit its limits. The sensor's resolution wasn't granular enough for the pressure differentials we needed to measure. The BMP581---Bosch's newer generation---offers significantly better resolution and noise characteristics.

We also changed the architecture. Instead of running I2C extenders to reach distant sensor locations from a single controller, we gave each location its own Raspberry Pi with its own mux and BMP581 sensor array. The Pi boards communicate over gigabit LAN, which is simpler, more reliable, and eliminates the signal integrity issues that come with long I2C runs.

```text
Location A:  Pi ── I2C ── TCA9548A ── BMP581s ──┐
                                                  ├── Gigabit LAN
Location B:  Pi ── I2C ── TCA9548A ── BMP581s ──┘
                                                  │
                                        Analysis PC (Rust)
```

---

## Using the Driver

Basic usage with a single sensor:

```rust
use bmp280_ehal::BMP280;

let mut bmp = BMP280::new(i2c)?;
let temp = bmp.temp(0x76);     // Celsius
let pres = bmp.pressure(0x76); // Pascals
```

Two sensors on one bus:

```rust
let mut bmp = BMP280::new(i2c)?;
bmp.read_calibration(0x77);

let delta_p = bmp.pressure(0x76) - bmp.pressure(0x77);
```

With a multiplexer:

```rust
fn select_channel<I2C, E>(i2c: &mut I2C, ch: u8) -> Result<(), E>
where I2C: embedded_hal::blocking::i2c::Write<Error = E>
{
    i2c.write(0x70, &[1 << ch])
}
```

See the [multi-sensor documentation](https://github.com/sw-embed/bmp280/blob/master/docs/multiple-sensor-support.md) for shared-bus patterns and cascaded mux topologies.

> **Fun Fact:** Some of the Raspberry Pi boards with I2C multiplexers and BMP581 sensor arrays were submerged in diving bell-like enclosures with low power and LAN cables tethered.
{:.fun-fact}

---

## References

| Reference | Link |
|-----------|------|
| BMP280 datasheet | [Bosch Sensortec (PDF)](https://www.bosch-sensortec.com/media/boschsensortec/downloads/product_flyer/bst-bmp280-fl000.pdf) |
| BMP581 product page | [Bosch Sensortec](https://www.bosch-sensortec.com/en/products/environmental-sensors/pressure-sensors/bmp581) |
| MIKROE Pressure 21 Click | [mikroe.com](https://www.mikroe.com/pressure-21-click) |
| I2C Multiplexer (TCA9548A) | [SparkFun I2C Mux](https://github.com/sparkfun/SparkFun_I2C_Mux_Arduino_Library?tab=readme-ov-file) |
| US Patent 12,188,836 B1 | [Google Patents](https://patents.google.com/patent/US12188836B1/en) |
| Multi-sensor docs | [GitHub](https://github.com/sw-embed/bmp280/blob/master/docs/multiple-sensor-support.md) |

