window.addEventListener("load", (e) => {
    const sprite = new Sprite("./Non-CopyRight-girl.jpg", 500, 500);
    (await function load() {await sprite.load_file(1);})();

    graphic.init();
    (await function us() {await UseShader();}();
    
    graphic.update_functions.push(sprite);
    graphic.start_functions.push(sprite);

    console.log(graphic.program);
    graphic.Start();
    window.requestAnimationFrame((ts) => graphic.main_loop(ts));
});