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
    export function update(dt = 1) {
        for (let p of particles) {
            //not alive? needs respawning?
            if (p.life <= 0) {
                if (respawn) resetParticle(p);
                continue;
            }
            //move and accelerate, change opacity, life
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vx *= acceleration * dt;
            p.vy *= acceleration * dt;
            p.opacity *= acceleration * dt;
            p.life--;
        }
    }
    ```
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

### 03 - Respawn trouble

1. In <code>particles.js</code>, flip the <code>respawn</code> setting once again:
    ```js
    const respawn = true;
    ```
2. Running the code at this time should reveal the problem with removing the limit on the number of particles. Clicking several times rapidly adds to the <code>particles</code> array and _every one of them will respawn!_. This eventually slows down the system
3. We still want the effect of clicking several times and not destroying the existing live particles, so the <code>update</code> function needs to change:
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
            //move and accelerate, change opacity, life
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vx *= acceleration * dt;
            p.vy *= acceleration * dt;
            p.opacity *= acceleration * dt;
            p.life--;
        }
    }
    ```
    * The "not alive? needs removing or respawning?" section has new functionality. If the <code>particles</code> array is too long, then the current particle object is spliced out of the array instead of respawning. It was a temporary particle used to accommodate rapid clicks but is no longer needed
    * Point out that the index value needs to decrement (<code>i--</code>) after splicing or the next particle will be skipped
    * Then, if <code>respawn</code> setting is <code>true</code>, the <code>resetParticle</code> function is called
    * This new system allows the <code>particles</code> array to expand as needed, but particles beyond the needed pool of <code>numParticles</code> particle objects are discarded once they're expired

### 04 - Even more better

1. In <code>particles.js</code>, flip the <code>respawn</code> setting yet one more time:
    ```js
    const respawn = false;
    ```
2. Now there's a new issue. When <code>respawn</code> is set to <code>false</code> and either there's no emitter set or all particles have expired, the code is still chugging away as if there are particles to handle. Both the <code>update</code> and <code>draw</code> functions are iterating through the <code>particles</code> array every animation frame, even when unnecessary. There should be a way to let the caller know that there are no more live particles in the system so that neither the <code>update</code> nor <code>draw</code> need to be called
3. In <code>particles.js</code>, create a new section called "exported state functions" and move the <code>setEmitter</code> function to it
4. In the new "exported state functions" section, add a new function:
    ```js
    export function hasLiveParticle() {
        for (let p of particles) {
            if (p.life > 0) return true;
        }
        return false;
    }
    ```
    This function should quickly return a boolean value representing whether or not any particle objects in the <code>particles</code> array are still live. And the <code>hasLifeParticle</code> function is exported, so it's available to the caller in the <code>index.js</code> module
5. In <code>index.js</code>, add <code>hasLiveParticle</code> to the exports from <code>particle.js</code>:
    ```js
    import { update, draw, setEmitter, hasLiveParticle } from "./particles.js";
    ```
6. The <code>loop</code> function has changed a bit:
    ```js
    function loop(t) {
        if (hasLiveParticle()) {
            //erase
            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);
            //particles
            update(canvas);
            draw(ctx);
        }
        //repeat
        requestAnimationFrame(loop);
    }
    ```
    Point out that the <code>hasLiveParticle</code> function is called every animation frame, and only if it returns <code>true</code> are the "erase" and "particles" sections called. No need to erase or redraw anything if there's nothing there
7. Point out that the <code>respawn</code> setting has been flipped many times throughout development. This is necessary for thorough testing, but are there situations that might require changing it while the system is running? It might be valuable to make the particle system a bit more robust by changing <code>respawn</code> from a setting to a state variable:
    ```js
    //state variables
    const particles = [];
    const emitter = { x: undefined, y: undefined };
    let respawn = false;
    ```
    Point out that if <code>respawn</code> can change it can no longer be considered a constant, thus the change from declaring it with <code>const</code> to <code>let</code>. (Using <code>var</code> here would have an identical effect.)
8. The default value for <code>respawn</code> is currently <code>false</code>, but we want the caller to be able to change it. We need a new function in the "exported state functions" section:
    ```js
    export function setRespawn(bool = true) {
        respawn = bool;
    }
    ```
    This gives the caller the ability to toggle the coninuous state of the particle system, if ever needed
9. Feel free to test changing <code>respawn</code> on your own, but the easiest way is in the <code>index.js</code> file, 
    1. Import the <code>setRespawn</code> function
    2. Add a <code>respawn</code> variable to the "environment" section set to <code>true</code>
    3. In the <code>init</code> function, change the click event listener to the following:
        ```js
        canvas.addEventListener("click", e => {
            setRespawn(respawn);
            respawn = !respawn;
            setEmitter({ x: e.x, y: e.y });
        });
        ```
    4. Now run the code and each click toggles the particle system's <code>respawn</code> state
