varying vec3 interpolatedNormal;
varying vec3 vertexPosition;
varying vec3 vertexColor;

uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 lightPosition;
uniform int mode;

const vec3 diffuseColor = vec3(.5, .5, .5);
const vec3 specColor = vec3(.5, .5, .5);

void main(){

	vec4 vertPos4 = modelViewMatrix * vec4(position, 1.0);
	vertexPosition = vec3(vertPos4) / vertPos4.w;
	interpolatedNormal = normalize(normalMatrix * normal);
	vertexColor = position;
	
	if (mode == 0){
		interpolatedNormal = normal;
	}

	if (mode == 1){
		vec3 lightDir = normalize(lightPosition - vertexPosition);
		vec3 reflectDir = reflect(-lightDir, interpolatedNormal);
		vec3 viewDir = normalize(-vertexPosition);

		float lambertian = max(dot(lightDir,interpolatedNormal), 0.0);
		float specular = 0.0;

		if(lambertian > 0.0) {
			float specAngle = max(dot(reflectDir, viewDir), 0.0);
			specular = pow(specAngle, 16.0);
		}
		vertexColor = vec3(ambientColor + (lambertian*diffuseColor) + (specular*specColor));

	} 
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}
