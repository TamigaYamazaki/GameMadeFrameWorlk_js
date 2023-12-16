window.addEventListener("load", (e) => {
    const sprite = new Sprite("./Non-CopyRight-girl.jpg", 500, 500);
    (async function load() {await sprite.load_file(1);})();

    graphic.init();
    UseShader();
    window.requestAnimationFrame((ts) => graphic.main_loop(ts));
});