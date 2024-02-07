function fullscreenCanvas(canvas, window) {

    resize();
    window.addEventListener("resize", resize);

    function resize() {
        const { innerWidth, innerHeight } = window;
        canvas.width = innerWidth;
        canvas.height = innerHeight;
    }

    return canvas.getContext("2d");
}

export { fullscreenCanvas };