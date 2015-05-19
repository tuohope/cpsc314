varying vec3 interpolatedNormal;
varying vec3 vertexPosition;
varying vec3 lightPos;
uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 coolColor;
uniform vec3 warmColor;
uniform vec3 objectColor;

// const vec3 coolColor = vec3(0.0,0.2,0.5);
// const vec3 warmColor = vec3(0.5,0.2,0.0);
// const vec3 objectColor = vec3(0.0,0.0,0.0);

void main() {

  vec3 color;
  // vec3 normal = normalize(interpolatedNormal);
  vec3 lightDir = normalize(lightPos - vertexPosition);
  vec3 viewDir = normalize(-vertexPosition);
  vec3 reflectDir = reflect(-lightDir, interpolatedNormal);
  
  float diffuse = max(dot(lightDir,interpolatedNormal), 0.0);
  float interpolationValue = (1.0 + diffuse)/2.0;

  // cool color mixed with color of the object
   vec3 coolColorMod = coolColor + objectColor * .5;
   // warm color mixed with color of the object
   vec3 warmColorMod = warmColor + objectColor * .5;
   // interpolation of cool and warm colors according 
   // to lighting intensity. The lower the light intensity,
   // the larger part of the cool color is used
  color = mix(coolColorMod, warmColorMod, interpolationValue);


  gl_FragColor = vec4(color,1.0);
}
