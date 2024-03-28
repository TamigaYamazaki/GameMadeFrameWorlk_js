"use strict";

const canvas = document.getElementById("screen");
const gl = canvas.getContext("webgl2");
const program = gl.createProgram();

const loadVertexShader = vertex_source;
const loadFragmentShader = flagment_source;

Promise.all([loadVertexShader, loadFragmentShader])
    .then((responses) => Promise.all([responses[0], responses[1]]))
    .then((shaderSources) => {
        const vertexShaderSource = shaderSources[0];
        const fragmentShaderSource = shaderSources[1];

        // バーテックスシェーダをコンパイル
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);

        // コンパイル成功したか否かをチェック
        const vShaderCompileStatus = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
        if(!vShaderCompileStatus) {
            const info = gl.getShaderInfoLog(vertexShader);
            console.log(info);
        }

        // フラグメントシェーダ
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);

        const fShaderCompileStatus = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
        if(!fShaderCompileStatus) {
            const info = gl.getShaderInfoLog(fragmentShader);
            console.log(info);
        }

        // シェーダプログラムを作成
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        // リンクできたかどうかを確認
        const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS);
        if(!linkStatus) {
            const info = gl.getProgramInfoLog(program);
            console.log(info);
        }else
		{
			console.log("linking is successful");
		}

        // プログラムを使用
        gl.useProgram(program);

		//テクスチャの読み込み
        const image = new Sprite("./Non-CopyRight-Girl.jpg", 512, 512);
		image.load_file(1);
		const texture_width = image.size.width;
		const texture_height = image.size.height;

		//
		//バッファの作成
		//

		// 頂点バッファ：[座標(vec2)][テクスチャ座標(vec2)]
		const vertexBuffer = gl.createBuffer();

		// インデックスバッファ
		const indexBuffer = gl.createBuffer();

		// strideは頂点情報のサイズなのでvec2+vec2で4
		// offsetはstride内での位置なので各々計算する
		// strideもoffsetもバイト数で指定する
		const STRIDE = Float32Array.BYTES_PER_ELEMENT * 4
		const TEXTURE_OFFSET = Float32Array.BYTES_PER_ELEMENT * 2;

		const POSITION_SIZE = 2;
		const TEXTURE_SIZE = 2;

		//操作対象のバッファをbindしてから作業する
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

		//各頂点情報の位置
		const vtxAttrLocation = gl.getAttribLocation(program, "vertexPosition");		//確保した領域をprogramの領域と関連付ける
		const textureCoordLocation = gl.getAttribLocation(program, "textureCoord");

		//各頂点情報の有効化
		gl.enableVertexAttribArray(vtxAttrLocation);
		gl.enableVertexAttribArray(textureCoordLocation);

		//各頂点情報の情報指定
		gl.vertexAttribPointer(vtxAttrLocation, POSITION_SIZE, gl.FLOAT, false, STRIDE, 0);		//指定された頂点属性の場所を変更する
		gl.vertexAttribPointer(textureCoordLocation, TEXTURE_SIZE, gl.FLOAT, false, STRIDE, TEXTURE_OFFSET);

		//
		//シェーダーのuniform変数の設定
		//

		// デフォルトの状態だとxy座標ともに[-1.0, 1.0]が表示されるので、
    	// 2Dグラフィックスで一般的な[0.0, width or height]座標に変換する。
		const xScale = 2.0 / canvas.width;
		const yScale = 2.0 / canvas.height;		//上下逆

		/* 行列について https://qiita.com/mizar/items/1d3717531b407fed59e7
		 */
		//OpenGL/WebGLは右手系
		
		const scalingMatrix = new Float32Array([
			xScale, 0.0   , 0.0, 0.0,
			0.0   , yScale, 0.0, 0.0,
			0.0   , 0.0   , 1.0, 0.0,
			0.0   , 0.0   , 0.0, 1.0
		]);

		//(0, 0)が中心になってしまうので左上に持ってくる
		const translationMatrix = new Float32Array([
			1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0,
			-1.0, 1.0, 0.0, 1.0
		])

		const scalingLocation = gl.getUniformLocation(program, "scaling");			//programのuniform変数の場所を取得
		const translationLocation = gl.getUniformLocation(program, "translation");
		gl.uniformMatrix4fv(translationLocation, false, translationMatrix);			//取得したuniform変数に行列を代入
		gl.uniformMatrix4fv(translationLocation, false, scalingMatrix);

		//
		//テクスチャの転送
		//

		// const texture = gl.createTexture();			//テクスチャの作成
		// gl.bindTexture(gl.TEXTURE_2D, texture);		//textureをバインド
		// gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image.texture_data);	//テクスチャデータの転送
		// gl.generateMipmap(gl.TEXTURE_2D);		//ミップマップの作成

		// //使用するテクスチャの指定
		// const textureLocation = gl.getUniformLocation(program, "tex");
		// gl.uniform1i(textureLocation, 0);

		// //
		// //アルファブレンドを有効にする
		// //
		// gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		// gl.enable(gl.BLEND);

		// //
		// //描画に用いるデータ
		// //

    });