// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 gemPosition;
uniform float gemRadius;

varying vec3 color;

void main() {
	/* HINT: WORK WITH gemPosition and gemRadius HERE! */

	mat3 gemR = mat3(gemRadius);
	color = position;
    vec3 gemPos = gemR * position + gemPosition;
    // Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
	// gl_Position = projectionMatrix * modelViewMatrix * vec4(position + gemPosition, 1.0);
	gl_Position = projectionMatrix * modelViewMatrix * vec4(gemPos, 1.0);

}


	
