varying vec3 interpolatedNormal;
varying vec3 vertexPosition;
varying vec3 lightPos;
uniform vec3 lightColor;
uniform vec3 ambientColor;

const vec3 diffuseColor = vec3(.5, .5, .5);
const vec3 specColor = vec3(.5, .5, .5);


void main() {
	// vec3 normal = normalize(interpolatedNormal);
	vec3 lightDir = normalize(lightPos - vertexPosition);
	vec3 viewDir = normalize(-vertexPosition);
	vec3 reflectDir = reflect(-lightDir, interpolatedNormal);
	
	float diffuse = max(dot(lightDir,interpolatedNormal), 0.0);
	float specular = 0.0;

	if(diffuse > 0.0) {
		vec3 halfDir = normalize(lightDir + viewDir);
		float specAngle = max(dot(halfDir, interpolatedNormal), 0.0);
		specular = pow(specAngle, 64.0);

      // float specAngle = max(dot(reflectDir, viewDir), 0.0);
      // note that the exponent is different here
      // specular = pow(specAngle, 16.0);
	}

	gl_FragColor = vec4(ambientColor + (diffuse * diffuseColor) + (specular * specColor), 1.0);
}