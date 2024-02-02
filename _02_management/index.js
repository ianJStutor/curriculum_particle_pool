//dependencies
import { fullscreenCanvas } from "./fullscreenCanvas.js";
import { update, draw, setEmitter } from "./particles.js";

//environment
const canvas = document.querySelector("canvas");
const ctx = fullscreenCanvas(canvas, window);

//loop
function loop(t) {
    //erase
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    //particles
    update(canvas);
    draw(ctx);
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