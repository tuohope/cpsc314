varying vec3 interpolatedNormal;
varying vec3 vertexPosition;
varying vec3 lightPos;
uniform vec3 lightColor;
uniform vec3 ambientColor;

void main() {

  vec3 color;
  // vec3 normal = normalize(interpolatedNormal);
  vec3 lightDir = normalize(lightPos - vertexPosition);
  vec3 viewDir = normalize(-vertexPosition);
  vec3 reflectDir = reflect(-lightDir, interpolatedNormal);
  float diffuse = max(dot(lightDir,interpolatedNormal), 0.0);
  float specular = 0.0;

  if(diffuse > 0.0) {
    float specAngle = max(dot(reflectDir, viewDir), 0.0);
    specular = pow(specAngle, 32.0);
  }

  // float lightIntensity = clamp(diffuse + specular, 0, 1);
  float lightIntensity = max((diffuse+specular),0.0);
  color = vec3(1.0, 1.0, 1.0);

  if (lightIntensity < 0.85){
    // hatch from left top corner to right bottom
    if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0) {
      color = vec3(0.0, 0.0, 0.0);
    }
  }

  if (lightIntensity < 0.75){
    // hatch from right top corner to left boottom
    if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0){
    color = vec3(0.0, 0.0, 0.0);
    }
  }

  if (lightIntensity < 0.5){
    // hatch from left top to right bottom
    if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0){
    color = vec3(0.0, 0.0, 0.0);
    }
  }

  if (lightIntensity < 0.25){
    // hatch from right top corner to left bottom
    if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0){
    color = vec3(0.0, 0.0, 0.0);
    }
  }


  gl_FragColor = vec4(color,1.0);
}
