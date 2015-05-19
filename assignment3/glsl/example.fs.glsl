varying vec3 vertexColor;
varying vec3 interpolatedNormal;
varying vec3 vertexPosition;
uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 lightPosition;
uniform int mode;

const vec3 diffuseColor = vec3(.5, .5, .5);
const vec3 specColor = vec3(.5, .5, .5);
const vec3 coolColor = vec3(0.0,0.2,0.5);
const vec3 warmColor = vec3(0.5,0.2,0.0);
const vec3 objectColor = vec3(0.0,0.0,0.0);

void main() {
	vec3 color;
	// vec3 normal = normalize(interpolatedNormal);
	vec3 lightDir = normalize(lightPosition - vertexPosition);
	vec3 viewDir = normalize(-vertexPosition);
	vec3 reflectDir = reflect(-lightDir, interpolatedNormal);

	float diffuse = max(dot(lightDir,interpolatedNormal), 0.0);
	float specular = 0.0;

	if (mode == 0){
		color = interpolatedNormal;
	}

	if (mode == 1){
		color = vertexColor;
	}

	if (mode == 2){
		if(diffuse > 0.0) {
			float specAngle = max(dot(reflectDir, viewDir), 0.0);
			specular = pow(specAngle, 16.0);
		}
		color = ambientColor + (diffuse * diffuseColor) + (specular * specColor);
	}

	if (mode == 3){
		if(diffuse > 0.0) {
			vec3 halfDir = normalize(lightDir + viewDir);
			float specAngle = max(dot(halfDir, interpolatedNormal), 0.0);
			specular = pow(specAngle, 64.0);
		}
		color = ambientColor + diffuse * diffuseColor + specular * specColor;
	}

	if (mode == 4){
		if (diffuse > 0.98)
		color = vec3(0.8,0.8,0.99);
		else if (diffuse > 0.96)
		color = vec3(0.5,0.5,0.88);
		else if (diffuse > 0.25)
		color = vec3(0.3,0.3,0.66);
		else
		color = vec3(0.15,0.15,0.33);
	}

	if (mode == 5){
		if(diffuse > 0.0) {
			float specAngle = max(dot(reflectDir, viewDir), 0.0);
			specular = pow(specAngle, 32.0);
		}

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
	}

	if (mode == 6){
		float interpolationValue = (1.0 + diffuse)/2.0;

		// cool color mixed with color of the object
		vec3 coolColorMod = coolColor + objectColor * .5;
		// warm color mixed with color of the object
		vec3 warmColorMod = warmColor + objectColor * .5;
		// interpolation of cool and warm colors according 
		// to lighting intensity. The lower the light intensity,
		// the larger part of the cool color is used
		
		color = mix(coolColorMod, warmColorMod, interpolationValue);
}

	gl_FragColor = vec4(color,1.0);
}