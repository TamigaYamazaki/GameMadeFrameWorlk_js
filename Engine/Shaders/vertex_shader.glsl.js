const vertex_source = `#version 300 es
in vec3 vertexPosition;		//頂点座標
in vec4 color;				//頂点色

out vec4 vColor;

void main()
{
	vColor = color;

	gl_Position = vec4(vertexPosition, 1.0);
}`;