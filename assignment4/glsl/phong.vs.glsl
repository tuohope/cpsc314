varying vec3 interpolatedNormal;
varying vec3 vertexPosition;
varying vec3 lightPos;
uniform vec3 lightPosition;


void main() {
	interpolatedNormal = normalize(normalMatrix * normal);
	vec4 vertPos4 = modelViewMatrix * vec4(position, 1.0);
	vertexPosition = vec3(vertPos4) / vertPos4.w; 

	vec4 lightPos4 = modelViewMatrix * vec4(lightPosition,1.0);
	lightPos = vec3(lightPos4) / lightPos4.w;

	// lightPos = vec3(lightPosition);

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
