const flagment_source = `#version 300 es

//use OpenGL ES 3.0

//position of vertex: x, y, z
//color of vertex: r, g, b, alpha
in vec3 vertexPosition;
in vec4 color;

//declaration a variable that output to flagment shader with "out".
out vec4 vColor;

void main()
{
	//dont any proccesings.
	vcolor = color;

	gl_Position = vec4(vertexPosition, 1.0);
}`;