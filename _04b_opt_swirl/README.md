# Particle pool 03: Recycling

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Files

* <code>index.html</code> - Entry file for every web app
* <code>index.js</code> - JavaScript module for setting up an app
* <code>fullscreenCanvas.js</code> - JavaScript module for managing a full-screen canvas that self adjusts with browser window resizing
* <code>lib.js</code> - helper functions in one library
* <code>swirl.js</code> - particle module

## Lesson notes

### 01 - Roundabout

1. Rename <code>particle.js</code> to <code>swirl.js</code>
2. In <code>index.js</code>, update the import source as <code>swirl.js</code>
3. In <code>swirl.js</code>, note the following settings changes:
    ```js
    const numParticles = 250;
    const minRadius = 1;
    const maxRadius = 5;
    const minSpeed = 0.1;
    const maxSpeed = 3;
    const minAngularChange = -0.1;
    const maxAngularChange = 0.1;
    const acceleration = 0.98;
    const opacity = 1;
    const minLife = 100;
    const maxLife = 200;
    const color = "orangered";
    ```
    * The <code>minRadius</code>, <code>maxRadius</code>, <code>minSpeed</code>, <code>maxSpeed</code>, <code>minLife</code>, <code>maxLife</code>, and <code>color</code> settings have changed
    * There are two new settings, <code>minAngularChange</code> and <code>maxAngularChange</code>. These will cause each particle to rotate and spiral. Note that positive values cause the particle to rotate in a clockwise manner and negative values cause the particle to rotate in a counter-clockwise manner
4. The <code>getParticle</code> function has changed:
    ```js
    function getParticle() {
        const angle = lerp(0, TWO_PI, Math.random());
        const speed = lerp(minSpeed, maxSpeed, Math.random());
        const { x, y } = emitter;
        const r = lerp(minRadius, maxRadius, Math.random());
        const life = Math.round(lerp(minLife, maxLife, Math.random()));
        const angularChange = lerp(minAngularChange, maxAngularChange, Math.random());
        return { x, y, angle, angularChange, speed, r, opacity, color, life };
    }
    ```
    * Point out that the <code>angularChange</code> property has been added
    * Point out that the <code>vx</code> and <code>vy</code> properties have been removed! These will be calculated each animation frame as the angle changes
5. The <code>resetParticle</code> function has changed:
    ```js
    function resetParticle(p) {
        const { x, y, angle, angularChange, r, opacity, color, life } = getParticle();
        p.x = x;
        p.y = y;
        p.angle = angle;
        p.angularChange = angularChange;
        p.r = r;
        p.opacity = opacity;
        p.color = color;
        p.life = life;
    }
    ```
    The new properties are accounted for during the reset
6. The <code>update</code> function has changed:
    ```js
    export function update(dt = 1) {
        //update particles
        for (let i=0; i<particles.length; i++) {
            let p = particles[i];
            //not alive? needs removing or respawning?
            if (p.life <= 0) {
                if (particles.length > numParticles) {
                    particles.splice(i, 1);
                    i--;
                }
                else if (respawn) resetParticle(p);
                continue;
            }
            //move and accelerate, change angle, life
            const { x: vx, y: vy } = polarToCartesian({ a: p.angle, v: p.speed });
            p.x += vx * dt;
            p.y += vy * dt;
            p.angle += p.angularChange;
            p.vx *= acceleration * dt;
            p.vy *= acceleration * dt;
            p.life--;
        }
    }
    ```
    * Point out that the <code>vx</code> and <code>vy</code> values are calculated here. Since the particle's <code>angle</code> property changes each frame, the axis velocities need recalculation each frame
    * The <code>opacity</code> no longer changes by <code>acceleration</code>
7. Running the code at this time produces a swirl of dots, spiraling around the emitter source point