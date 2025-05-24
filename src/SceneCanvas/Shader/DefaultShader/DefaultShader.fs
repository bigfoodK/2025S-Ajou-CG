precision mediump float;

varying vec2 fTexCoord;
varying vec4 fColor;

uniform sampler2D texture;

void main() {
    gl_FragColor = fColor * texture2D(texture, fTexCoord);
}