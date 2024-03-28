class Sprite
{
    constructor(src, width, height)
    {
        this.src = src;
        this.size = {
            Width: width,
            Height: height
        };
        this.texture_data = null;
    }

    async load_file(mode)
    {
        //mode
        //0: ローカルサーバー環境
        //1: サーバーを使わない環境

        switch(mode)
        {
            case 0:
                this.texture_data = fetch(this.src)
                                    .then((response) => response.blob())
                                    .then((blob) => {
                                        createImageBitmap(blob);
                                        console.log(blob)});
                break;
            case 1:
                const img = new Image();
                img.src = this.src;
                
                const cav = document.createElement("canvas");
                cav.width = this.size.Width;
                cav.height = this.size.Height;
                const ctx = cav.getContext("2d");

                img.onload = () => {
                    ctx.drawImage(img, 0, 0, this.size.Width, this.size.Height);
                }

                let url = "";

                const blob = await new Promise(resolve => cav.toBlob(resolve, "image/png"));

                this.texture_data = createImageBitmap(blob);
                break;
            default:
                throw "`mode` is out of range";
                break;
        }
    }

    draw()
    {

        //頂点データを定義する
        //WebGL2では右手座標系
        //ポリゴンの頂点は反時計周りに定義する
        const verteces = new Float32Array([
            -0.5, 0.5, 0.0,
            1.0, 0.0, 0.0, 1.0,
            -0.5, -0.5, 0.0,
            0.0, 1.0, 0.0, 1.0,
            0.5, 0.5, 0.0,
            0.0, 0.0, 1.0, 1.0,
            0.5, -0.5, 0.0,
            0.0, 0.0, 0.0, 1.0,
        ]);
        const indexes = new Uint16Array([
            0, 1, 2,
            1, 3, 2
        ]);

        //バインドしてデータを転送
        // graphic.gl.bindBuffer(graphic.gl.ARRAY_BUFFER, vertexBuffer);
        // graphic.gl.bufferData(graphic.gl.ARRAY_BUFFER, verteces, graphic.gl.STATIC_DRAW);

        // graphic.gl.bindBuffer(graphic.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        // graphic.gl.bufferData(graphic.gl.ELEMENT_ARRAY_BUFFER, indexes, graphic.gl.STATIC_DRAW);

        // const indexSize = indexes.length;
        // graphic.gl.drawElements(graphic.gl.TRIANGLES, indexSize, graphic.gl.UNSIGNED_SHORT, 0);

        // graphic.gl.flush();
    }
}