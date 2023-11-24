const gl = document.getElementById("screen").getContext("webgl2");

if(!gl)
{
	alert("You cant use webgl2");
}

const loadVertexShader = vertex_source;
const loadFragmenShader = flagment_source;

console.log(loadVertexShader);

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
			}

			//use program
			gl.useProgram(program);
		});