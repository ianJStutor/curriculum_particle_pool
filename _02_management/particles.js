//dependencies
import { lerp, TWO_PI, polarToCartesian } from "./lib.js";

//settings
const numParticles = 250;
const minRadius = 2;
const maxRadius = 5;
const minSpeed = 2;
const maxSpeed = 5;
const acceleration = 0.98;
const opacity = 1;
const minLife = 75;
const maxLife = 125;
const color = "white";
const respawn = false;

//state
const particles = [];
const emitter = { x: undefined, y: undefined };

//setup
function setupParticles() {
    for (let i=0; i<numParticles; i++) {
        particles[i] = getParticle();
    }
}

function getParticle() {
    const angle = lerp(0, TWO_PI, Math.random());
    const speed = lerp(minSpeed, maxSpeed, Math.random());
    const { x: vx, y: vy } = polarToCartesian({ a: angle, v: speed });
    const { x, y } = emitter;
    const r = lerp(minRadius, maxRadius, Math.random());
    const life = Math.round(lerp(minLife, maxLife, Math.random()));
    return { x, y, vx, vy, r, opacity, color, life };
}

export function setEmitter({ x, y }) {
    emitter.x = x;
    emitter.y = y;
    setupParticles();
}

//loop functions
export function update(dt = 1) {
    //update particles
    for (let i=0; i<particles.length; i++) {
        let p = particles[i];
        //needs respawning?
        if (p.life <= 0) {
            if (respawn) particles[i] = getParticle();
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