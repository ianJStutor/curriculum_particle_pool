# Particle pool 02: Management

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Files

* <code>index.html</code> - Entry file for every web app
* <code>index.js</code> - JavaScript module for setting up an app
* <code>fullscreenCanvas.js</code> - JavaScript module for managing a full-screen canvas that self adjusts with browser window resizing
* <code>lib.js</code> - helper functions in one library
* <code>particles.js</code> - particle module

## Lesson notes

### 01 - Slice of PI

1. In <code>lib.js</code>, add the following constants:
    ```js
    export const PI = Math.PI;
    export const TWO_PI = Math.PI * 2;
    export const HALF_PI = Math.PI * 0.5;
    ```
    These values are used frequently in particle systems and each time requires a double lookup on the <code>Math</code> object as well as, often, multiplication. It makes sense to store these as global constants in the library
2. In <code>particles.js</code>, replace <code>degToRad</code> both in the <code>import</code> dependency and in the <code>getParticle</code> function, with the <code>TWO_PI</code> constant
3. In the <code>draw</code> function's <code>ctx.arc()</code> call, replace <code>Math.PI * 2</code> with <code>TWO_PI</code>
4. Running the code at this time should have no visual change from the previous step, but is now written with better efficiency

### 02 - It's alive!

1. In <code>particles.js</code>, there's an addition to the settings:
    ```js
    const respawn = false;
    ```
2. The <code>getParticle</code> function has been slightly rewritten:
    ```js
    function getParticle() {
        const angle = lerp(0, TWO_PI, Math.random());
        const speed = lerp(minSpeed, maxSpeed, Math.random());
        const { x: vx, y: vy } = polarToCartesian({ a: angle, v: speed });
        const { x, y } = emitter;
        const r = lerp(minRadius, maxRadius, Math.random());
        const life = Math.round(lerp(minLife, maxLife, Math.random()));
        return { x, y, vx, vy, r, opacity, color, life };
    }
    ```
    This is mainly for standardization purposes, but point out that the destructured <code>{ width, height }</code> parameter has been removed since it's no longer used
3. In the <code>