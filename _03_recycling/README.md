# Particle pool 03: Recycling

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Files

* <code>index.html</code> - Entry file for every web app
* <code>index.js</code> - JavaScript module for setting up an app
* <code>fullscreenCanvas.js</code> - JavaScript module for managing a full-screen canvas that self adjusts with browser window resizing
* <code>lib.js</code> - helper functions in one library
* <code>particles.js</code> - particle module

## Lesson notes

### 01 - Reduce, reuse

1. In <code>particles.js</code>, change one setting:
    ```js
    const respawn = true;
    ```
    This is temporary, just for testing
2. Add a new function in the "setup" section:
    ```js
    function resetParticle(p) {
        const { x, y, vx, vy, r, opacity, color, life } = getParticle();
        p.x = x;
        p.y = y;
        p.vx = vx;
        p.vy = vy;
        p.r = r;
        p.opacity = opacity;
        p.color = color;
        p.life = life;
    }
    ```
    This seems very similar to the <code>getParticle</code> function, but it assigns (or, rather, _reassigns_) values to an existing particle instead of creating a new object from nothing. Bring up _garbage collection_ in JavaScript or basic memory management, if students are ready
3. The <code>update</code> function has changed:
    ```js
    export function update({ width, height }) {
        for (let p of particles) {
            //not alive? needs respawning?
            if (p.life <= 0) {
                if (respawn) resetParticle(p);
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
    * Note that the destructured <code>{ width, height }</code> parameters are still present despite not being used here. Other particle systems based off this file might need them, so it's not _terrible_ that it's still there. As always, optimization is needed for any final product
    * The <code>for</code> loop is now a <code>for...of</code> loop for better declarative code (and overall faster than a higher-order loop like <code>forEach</code>, for example). This is because there's no need to replace a particle in the array with a new one; changing properties on an existing one is sufficient. Review passing by reference, if necessary
    * The check on the <code>life</code> property happens at the top of the loop, before any updating, and particles that are not alive are ignored. And, if the <code>respawn</code> setting is <code>true</code>, then the new <code>resetParticle</code> function is called, passing in the current particle
    * Review <code>continue</code> in loops, if necessary
4. There's also a life check in the <code>draw</code> function:
    ```js
    export function draw(ctx) {
        ctx.save();
        for (let { x, y, r, opacity, color, life } of particles) {
            //not alive?
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
    No need to draw particles that have expired. Point out, though, that if the <code>respawn</code> setting is <code>true</code>, then expired particles are immediately given new properties, including <code>life</code>
5. Running the code at this time brings back the continuous bursting of particles, but particle objects are being reused instead of being overwritten with a new one with every click. This is good for memory management, but it still doesn't solve the issue of vanishing existing particles when the emitter changes position

### 02 - Jump in the pool

1. In <code>particles.js</code>, return the <code>respawn</code> setting to <code>false</code>:
    ```js
    const respawn = false;
    ```
2. The <code>setupParticles</code> function has been rewritten:
    ```js
    function setupParticles() {
        for (let i=0; i<numParticles; i++) {
            let p = getParticleFromPool();
            if (p) resetParticle(p);
            else particles.push(getParticle());
        }
    }
    ```
    * Instead of assigning a particle to an index of the <code>particles</code> array, we're using the <code>push</code> method. And we're doing this as many times as the value of the <code>numParticles</code> setting. Point out that this means that <code>particles.length</code> can surpass the <code>numParticles</code> setting; it's no longer a limit but more like a count of how many particles need to spawn with each click
    * If a particle already exists but is no longer live, then that particle is reset, effectively reusing particles already created
3. Finding an expired particle from the pool requires a new function in the "setup" section:
    ```js
    function getParticleFromPool() {
        for (let p of particles) {
            if (p.life <= 0) return p;
        }
        return null;
    }
    ```
    * Note that, yes, the <code>Array.find</code> function is more declarative, but higher-order functions can be significantly slower on some platforms
    * As soon as an expired particle is found, the function ends by returning it. The loop doesn't keep going. Only if there are no particles at all or all particles are still live will this function return <code>null</code>
4. Running the code at this time solves the previous problem of disappearing particles! Every click seemingly produces a new set of particles bursting from the emitter