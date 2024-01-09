class Sprite extends ObjectBehaviour
{
    constructor(src, width, height)
    {
        super();
        this.src = src;
        this.size = {
            Width: width,
            Height: height
        };
        this.texture_data = null;
    }

    Start()
    {
        
    }

    Update(deltaTime)
    {
        
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
        const vertexBuffer = graphic.gl.createBuffer();
        const indexBuffer = graphic.gl.createBuffer();

        const vertexAttribLocation = graphic.gl.getAttribLocation(graphic.program, "vertexPosition");
        const colorAttribLocation = graphic.gl.getAttribLocation(graphic.program, "color");
        const VERTEX_SIZE = 3;
        const COLOR_SIZE = 4;

        const STRIDE = (3 + 4) * Float32Array.BYTES_PER_ELEMENT;
        const POSITION_OFFSET = 0;
        const COLOR_OFFSET = 3 * Float32Array.BYTES_PER_ELEMENT;

        graphic.gl.bindBuffer(graphic.gl.ARRAY_BUFFER, vertexBuffer);   //バッファをバインド
        graphic.gl.enableVertexAttribArray(vertexAttribLocation);   //in変数を有効化
        graphic.gl.enableVertexAttribArray(colorAttribLocation);
        graphic.gl.vertexAttribPointer(vertexAttribLocation, VERTEX_SIZE, graphic.gl.FLOAT, false, STRIDE, POSITION_OFFSET);    //バインドしているバッファと変数をリンク
        graphic.gl.vertexAttribPointer(colorAttribLocation, COLOR_SIZE, graphic.gl.FLOAT, false, STRIDE, COLOR_OFFSET);

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
        gl.bindBuffer(graphic.gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(graphic.gl.ARRAY_BUFFER, verteces, graphic.gl.STATIC_DRAW);

        gl.bindBuffer(graphic.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(graphic.gl.ELEMENT_ARRAY_BUFFER, indexes, graphic.gl.STATIC_DRAW);

        const indexSize = indexes.length;
        gl.drawElements(graphic.gl.TRIANGLES, indexSize, graphic.gl.UNSIGNED_SHORT, 0);

        gl.flush();
    }
}