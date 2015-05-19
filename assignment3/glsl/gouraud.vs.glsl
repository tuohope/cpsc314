varying vec3 vertexColor;
uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 lightPosition;

const vec3 diffuseColor = vec3(.5, .5, .5);
const vec3 specColor = vec3(.5, .5, .5);

void main() {
	vec3 interpolatedNormal = normalize(normalMatrix * normal);
	vec4 vertPos4 = modelViewMatrix * vec4(position, 1.0);
	vec3 vertPos = vec3(vertPos4) / vertPos4.w;
	
	vec4 lightPos4 = modelViewMatrix * vec4(lightPosition,1.0);
	vec3 lightPos = vec3(lightPos4) / lightPos4.w;

	// vec3 lightDir = normalize(lightPosition - vertPos);
	vec3 lightDir = normalize(lightPos - vertPos);
	vec3 reflectDir = reflect(-lightDir, interpolatedNormal);
	vec3 viewDir = normalize(-vertPos);
  	
  	float diffuse = max(dot(lightDir,interpolatedNormal), 0.0);
  	float specular = 0.0;
	
	if(diffuse > 0.0) {
  	float specAngle = max(dot(reflectDir, viewDir), 0.0);
  	specular = pow(specAngle, 16.0);
  }
  	vertexColor = vec3(ambientColor + (diffuse*diffuseColor) + (specular*specColor));

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

