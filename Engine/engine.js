const canvas = document.getElementById("screen");
const gl = canvas.getContext("webgl2");

if(!gl)
{
	alert("You cant use webgl2");
}

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

const loadVertexShader = vertex_source;
const loadFragmenShader = flagment_source;

Promise.all([loadVertexShader, loadFragmenShader])
		.then((responses) => Promise.all([responses[0], responses[1]]))
		.then((shaderSources) => {
			const vertexShaderSource = shaderSources[0];
			const fragmentShaderSource = shaderSources[1];

			//compile vertex shader
			const vertexShader = gl.createShader(gl.VERTEX_SHADER);
			gl.shaderSource(vertexShader, vertexShaderSource);
			gl.compileShader(vertexShader);

			//check if compiling verex shader was successful
			const vShaderCompileStatus = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
			if(!vShaderCompileStatus)
			{
				const info = gl.getShaderInfoLog(vertexShader);
            	console.log(info);
			}

			//compile fragment shader
			const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(fragmentShader, fragmentShaderSource);
			gl.compileShader(fragmentShader);

			//check if compiling fragment shader was successful
			const fShaderCompileStatus = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
			if(!fShaderCompileStatus)
			{
				const info = gl.getShaderInfoLog(fragmentShader);
				console.log(info);
			}

			//create shader program
			const program = gl.createProgram();
			gl.attachShader(program, vertexShader);
			gl.attachShader(program, fragmentShader);
			gl.linkProgram(program);

			//check if the link is successful
			const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS);
			if(!linkStatus)
			{
				const info = gl.getProgramInfoLog(program);
				console.log(info);
			}else
			{
				console.log("Linking shader to program and compiling was successful")
			}

			//use program
			gl.useProgram(program);

			//シェーダーのデータ転送用バッファ領域
			const vertexBuffer = gl.createBuffer();
			const colorBuffer = gl.createBuffer();

			//バーテックスシェーダーのin変数の位置取得
			const vertexAttribLocation = gl.getAttribLocation(program, "vertexPosition");
			const colorAttribLocation = gl.getAttribLocation(program, "color");
			const VERTEX_SIZE = 3;
			const COLOR_SIZE = 4;

			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);	//バッファをバインド
			gl.enableVertexAttribArray(vertexAttribLocation);	//in変数を有効化
			gl.vertexAttribPointer(vertexAttribLocation, VERTEX_SIZE, gl.FLOAT, false, 0, 0);	//バインドしているバッファと変数をリンク
			//頂点色についても同様に
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			gl.enableVertexAttribArray(colorAttribLocation);
			gl.vertexAttribPointer(colorAttribLocation, COLOR_SIZE, gl.FLOAT, false, 0, 0);

			/*頂点データを定義する
			 *WebGL2では右手座標系
			 *ポリゴンの頂点は反時計周りに定義する*/
			const verteces = new Float32Array([
				-0.5, 0.5, 0.0,
				-0.5, -0.5, 0.0,
				0.5, 0.5, 0.0,
				-0.5, -0.5, 0.0,
				0.5, -0.5, 0.0,
				0.5, 0.5, 0.0
			]);
			const colors = new Float32Array([
				1.0, 0.0, 0.0, 1.0,
				0.0, 1.0, 0.0, 1.0,
				0.0, 0.0, 1.0, 1.0,
				0.0, 1.0, 0.0, 1.0,
				0.0, 0.0, 0.0, 1.0,
				0.0, 0.0, 1.0, 1.0
			]);

			//バインドしてデータを転送
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, verteces, gl.STATIC_DRAW);
			gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

			const VERTEX_NUMS = 6;
			gl.drawArrays(gl.TRIANGLES, 0, VERTEX_NUMS);

			gl.flush();
		});