export function lerp(a, b, t) {
    return a + (b - a) * t;
}

export function degToRad(d) {
    return d * (Math.PI / 180);
}

export function radToDeg(r) {
    return r * (180 / Math.PI);
}

export function polarToCartesian({ a, v }) {
    return {
        x: v * Math.cos(a),
        y: v * Math.sin(a)
    };
}

export function cartesianToPolar({ x, y }) {
    return {
        a: Math.atan2(y, x),
        v: Math.hypot(x, y)
    };
}