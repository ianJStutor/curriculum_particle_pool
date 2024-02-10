//dependencies
import { update as particlesUpdate, draw as particlesDraw, setEmitter as particlesSetEmitter, setRespawn as particleSetRespawn } from "./particles.js";
import { update as polkaUpdate, draw as polkaDraw, setEmitter as polkaSetEmitter, setRespawn as polkaSetRespawn } from "./polka.js";
import { update as swirlUpdate, draw as swirlDraw, setEmitter as swirlSetEmitter, setRespawn as swirlSetRespawn } from "./swirl.js";

//environment
const width = 300;
const height = 300;
const canvases = [...document.querySelectorAll("canvas")];
const contexts = [];
canvases.forEach(c => {
    c.width = width;
    c.height = height;
    contexts.push(c.getContext("2d"));
});

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
    //erase
    contexts.forEach(ctx => ctx.clearRect(0, 0, width, height));
    //particles
    particlesUpdate(dt);
    particlesDraw(contexts[0]);
    polkaUpdate(dt);
    polkaDraw(contexts[1]);
    swirlUpdate(dt);
    swirlDraw(contexts[2]);
    //repeat
    requestAnimationFrame(loop);
}

//init
function init() {
    particleSetRespawn(true);
    polkaSetRespawn(true);
    swirlSetRespawn(true);
    particlesSetEmitter({ x: 150, y: 150 });
    polkaSetEmitter({ x: 150, y: 150 });
    swirlSetEmitter({ x: 150, y: 150 });
    requestAnimationFrame(loop);
}

init();
