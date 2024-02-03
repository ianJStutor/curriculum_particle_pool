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
    Instead of having a continuous gusher of particles, we'll control where and when they appear
2. The <code>setupParticles</code> function has been changed:
    ```js
    function setupParticles() {
        for (let i=0; i<numParticles; i++) {
            particles[i] = getParticle();
        }
    }
    ```
    * The <code>canvas</code> parameter has been removed; the <code>getParticle</code> function (below) doesn't need it anymore
    * The default emitter setting has been deleted; it's no longer needed
3. The <code>getParticle</code> function has been slightly rewritten:
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
4. The <code>setEmitter</code> function is now what starts the entire particle system:
    ```js
    export function setEmitter({ x, y }) {
        emitter.x = x;
        emitter.y = y;
        setupParticles();
    }
    ```
    Point out that the <code>setupParticles</code> function no longer runs in the <code>update</code> function but here, after an emitter position has been set
5. The <code>update</code> function has changed significantly:
    ```js
    export function update({ width, height }) {
        //update particles
        for (let i=0; i<particles.length; i++) {
            let p = particles[i];
            //needs respawning?
            if (p.life <= 0) {
                if (respawn) particles[i] = getParticle();
                continue;
            }
            //move and accelerate, change opacity, life
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= acceleration;
            p.vy *= acceleration;
            p.opacity *= acceleration;
            p.life--;
        }
    }
    ```
    * The <code>setupParticles()</code> call is no longer here; it's been moved to the <code>setEmitter</code> function
    * The check of <code>life</code> being a positive value happens first in the loop. If the value is zero or negative, then the particle is completely ignored unless the <code>respawn</code> setting is set to <code>true</code>
6. The <code>draw</code> function has changed a bit:
    ```js
    export function draw(ctx) {
        ctx.save();
        for (let { x, y, r, opacity, color, life } of particles) {
            //is no longer live?
            if (life <= 0) continue;
            //it's alive!
            ctx.globalAlpha = opacity;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, TWO_PI);
            ctx.fill();
        }
        ctx.restore();
    }
    ```
    Point out the check of the <code>life</code> property. If its value is zero or negative then the particle is not drawn
7. Running the code at this time shows only a black screen--until there's a click event. The click calls the <code>setEmitter</code> function, which calls the <code>setupParticles</code> function, which brings all the particles to life...for a limited number of animation frames. When all particles' <code>life</code> properties are zero or below, the animation loop continues by calling the <code>update</code> and <code>draw</code> functions, but nothing happens until there's another click. Point out, however, that rapid clicks completely removes the previous particle effect. That is, only one particle effect may be active at any given time, which might not be the expected result. We'll fix that next