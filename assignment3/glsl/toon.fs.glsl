varying vec3 interpolatedNormal;
varying vec3 vertexPosition;
varying vec3 lightPos;
uniform vec3 lightColor;
uniform vec3 ambientColor;
// uniform vec3 lightPosition;

void main() {

  vec3 color;
  // vec3 normal = normalize(interpolatedNormal);
  vec3 lightDir = normalize(lightPos - vertexPosition);
  float diffuse = max(dot(lightDir,interpolatedNormal), 0.0);

  if (diffuse > 0.98)
  color = vec3(0.8,0.8,0.99);
  else if (diffuse > 0.96)
  color = vec3(0.5,0.5,0.88);
  else if (diffuse > 0.10)
  color = vec3(0.3,0.3,0.66);
  else
  color = vec3(0.15,0.15,0.33);

  gl_FragColor = vec4(color,1.0);
}
