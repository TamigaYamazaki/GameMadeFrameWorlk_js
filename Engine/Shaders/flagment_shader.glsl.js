const flagment_source = `#version 300 es
precision highp float;

in vec4 vColor;

out vec4 FragColor;

void main() {
    //頂点色の補完色を出力
    FragColor = vColor;
}`;