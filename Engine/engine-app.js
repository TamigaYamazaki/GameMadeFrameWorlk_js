window.addEventListener("load", (e) => {
    UseShader();
    window.requestAnimationFrame((ts) => graphic.main_loop(ts));
});