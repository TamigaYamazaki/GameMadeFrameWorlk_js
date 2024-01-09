"use strict";

class Graphics
{
	constructor()
	{
		this.program = null;
		this.screen_size = {
			width: Math.round(window.innerHeight * 16 / 9),
			height: window.innerHeight
		};

		this.canvas = document.getElementById("screen");
		this.gl = this.canvas.getContext("webgl2");

		this.update_functions = [];

		if(!this.gl)
		{
			alert("You cant use webgl2");
		}

		this.fps = 60;
		this.et = 0.0;
		this.deltaTime = 0.0;

		this.Graphic_value_pack = {
			sc: this.canvas,
			gl: this.gl,
			dt: this.deltaTime
		};
	}

	init()
	{
		this.canvas.width = this.screen_size.width;
		this.canvas.height = this.screen_size.height;

		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}

	main_loop(timestamp)
	{
		this.deltaTime = (timestamp - this.et) / 1000;	//有効数字2桁
		this.et = timestamp;
		this.fps = 1 / this.deltaTime;

		this.update_functions.forEach((element) => {element.Update()});

		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		window.requestAnimationFrame((ts) => this.main_loop(ts));
	}
}


const graphic = new Graphics();

const loadVertexShader = vertex_source;
const loadFragmenShader = flagment_source;

function UseShader()
{
	Promise.all([loadVertexShader, loadFragmenShader])
	.then((responses) => Promise.all([responses[0], responses[1]]))
	.then((shaderSources) => {
		const vertexShaderSource = shaderSources[0];
		const fragmentShaderSource = shaderSources[1];

		//compile vertex shader
		const vertexShader = graphic.gl.createShader(graphic.gl.VERTEX_SHADER);
		graphic.gl.shaderSource(vertexShader, vertexShaderSource);
		graphic.gl.compileShader(vertexShader);

		//check if compiling verex shader was successful
		const vShaderCompileStatus = graphic.gl.getShaderParameter(vertexShader, graphic.gl.COMPILE_STATUS);
		if(!vShaderCompileStatus)
		{
			const info = graphic.gl.getShaderInfoLog(vertexShader);
			console.log(info);
		}

		//compile fragment shader
		const fragmentShader = graphic.gl.createShader(graphic.gl.FRAGMENT_SHADER);
		graphic.gl.shaderSource(fragmentShader, fragmentShaderSource);
		graphic.gl.compileShader(fragmentShader);

		//check if compiling fragment shader was successful
		const fShaderCompileStatus = graphic.gl.getShaderParameter(fragmentShader, graphic.gl.COMPILE_STATUS);
		if(!fShaderCompileStatus)
		{
			const info = graphic.gl.getShaderInfoLog(fragmentShader);
			console.log(info);
		}

		//create shader program
		graphic.program = graphic.gl.createProgram();
		graphic.gl.attachShader(graphic.program, vertexShader);
		graphic.gl.attachShader(graphic.program, fragmentShader);
		graphic.gl.linkProgram(graphic.program);

		//check if the link is successful
		const linkStatus = graphic.gl.getProgramParameter(graphic.program, graphic.gl.LINK_STATUS);
		if(!linkStatus)
		{
			const info = graphic.gl.getProgramInfoLog(graphic.program);
			console.log(info);
		}else
		{
			console.log("Linking shader to program and compiling was successful")
		}

		//use program
		graphic.gl.useProgram(graphic.program);
	});
}

/* ページが読み込まれたら実行 */
/*window.addEventListener("load", (event) => {

	UseShader();

			/*
			//シェーダーのデータ転送用バッファ領域
			const vertexBuffer = gl.createBuffer();
			const indexBuffer = gl.createBuffer();

			//バーテックスシェーダーのin変数の位置取得
			const vertexAttribLocation = gl.getAttribLocation(program, "vertexPosition");
			const colorAttribLocation = gl.getAttribLocation(program, "color");
			const VERTEX_SIZE = 3;
			const COLOR_SIZE = 4;

			const STRIDE = (3 + 4) * Float32Array.BYTES_PER_ELEMENT;
			const POSITION_OFFSET = 0;
			const COLOR_OFFSET = 3 * Float32Array.BYTES_PER_ELEMENT;

			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);	//バッファをバインド
			gl.enableVertexAttribArray(vertexAttribLocation);	//in変数を有効化
			gl.enableVertexAttribArray(colorAttribLocation);
			gl.vertexAttribPointer(vertexAttribLocation, VERTEX_SIZE, gl.FLOAT, false, STRIDE, POSITION_OFFSET);	//バインドしているバッファと変数をリンク
			gl.vertexAttribPointer(colorAttribLocation, COLOR_SIZE, gl.FLOAT, false, STRIDE, COLOR_OFFSET);

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
			])

			//バインドしてデータを転送
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, verteces, gl.STATIC_DRAW);

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexes, gl.STATIC_DRAW);

			const indexSize = indexes.length;
			gl.drawElements(gl.TRIANGLES, indexSize, gl.UNSIGNED_SHORT, 0);

			gl.flush();

	window.requestAnimationFrame((ts) => graphic.main_loop(ts));
});*/