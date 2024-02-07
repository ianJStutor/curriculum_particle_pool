# Particle pool 04 (option A): Polka dots!

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Files

* <code>index.html</code> - Entry file for every web app
* <code>index.js</code> - JavaScript module for setting up an app
* <code>fullscreenCanvas.js</code> - JavaScript module for managing a full-screen canvas that self adjusts with browser window resizing
* <code>lib.js</code> - helper functions in one library
* <code>polka.js</code> - particle module

## Lesson notes

### 01 - Colorful

1. Rename <code>particle.js</code> to <code>polka.js</code>
2. In <code>index.js</code>, update the import source as <code>polka.js</code>
3. In <code>polka.js</code>, note the following settings changes:
    ```js
    const numParticles = 25;
    const minRadius = 20;
    const maxRadius = 50;
    const minSpeed = 2;
    const maxSpeed = 15;
    const acceleration = 0.98;
    const opacity = 1;
    const minLife = 75;
    const maxLife = 125;
    const minHue = 0;
    const maxHue = 360;
    ```
    * The settings <code>numParticles</code>, <code>minRadius</code>, <code>maxRadius</code>, and <code>maxSpeed</code> have all changed
    * The <code>color</code> setting has been removed and replaced with <code>minHue</code> and <code>maxHue</code>. These hue values are angular degrees on the HSL color wheel
4. The <code>getParticle</code> function now looks like this:
    ```js
    function getParticle() {
        const angle = lerp(0, TWO_PI, Math.random());
        const speed = lerp(minSpeed, maxSpeed, Math.random());
        const { x: vx, y: vy } = polarToCartesian({ a: angle, v: speed });
        const { x, y } = emitter;
        const r = lerp(minRadius, maxRadius, Math.random());
        const life = Math.round(lerp(minLife, maxLife, Math.random()));
        const hue = Math.floor(lerp(minHue, maxHue, Math.random()));
        const color = `hsl(${hue}deg, 100%, 50%)`;
        return { x, y, vx, vy, r, opacity, color, life };
    }
    ```
    * The <code>hue</code> variable is an integer between <code>0</code> and <code>360</code>
    * The <code>color</code> variable (soon to be a property of the particle object) is a string representing a color in the HSL gamut with <code>hue</code> as the degrees on the color wheel, <code>100%</code> as the saturation, and <code>50%</code> as the lightness
5. Running the code at this time produces a colorful particle effect with random-color polka dots