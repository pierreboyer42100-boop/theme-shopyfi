precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  float gradient = smoothstep(0.0, 1.0, st.y);
  float wave = sin((st.x + u_time * 0.1) * 6.2831) * 0.05;
  vec3 color = mix(vec3(0.12, 0.18, 0.38), vec3(0.17, 0.41, 0.86), gradient + wave);
  gl_FragColor = vec4(color, 0.85);
}
