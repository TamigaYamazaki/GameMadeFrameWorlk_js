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
}