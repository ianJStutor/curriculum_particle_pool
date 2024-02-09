//dependencies
import { fullscreenCanvas } from "./fullscreenCanvas.js";
import { update, draw, setEmitter, hasLiveParticle, setRespawn } from "./particles.js";

//environment
const canvas = document.querySelector("canvas");
const ctx = fullscreenCanvas(canvas, window);

//settings
const fps = 1000/60; //target 60 frames per second

//state variables
let prevTime;

//loop
function loop(t) {
    //time
    if (!prevTime) prevTime = t;
    const dt = (t - prevTime) / fps;
    prevTime = t;
    //management
    if (hasLiveParticle()) {
        //erase
        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);
        //particles
        update(dt);
        draw(ctx);
    }
    //repeat
    requestAnimationFrame(loop);
}

//init
function init() {
    canvas.addEventListener("click", setEmitter);
    update(canvas);
    requestAnimationFrame(loop);
}

init();