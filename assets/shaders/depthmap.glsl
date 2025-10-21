precision mediump float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec4 color = texture2D(u_texture, uv);
  float depth = (color.r + color.g + color.b) / 3.0;
  gl_FragColor = vec4(vec3(depth), 1.0);
}
