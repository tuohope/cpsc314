// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 boxPosition;
uniform float boxRotaAng;

varying vec3 color;

void main() {
	float s = sin(boxRotaAng);
	float c = cos(boxRotaAng);

	mat3 rotMat1 = mat3(c, -s, 0.0, 
					    s,  c, 0.0, 
			  		    0.0, 0.0, 1.0);
	mat3 rotMat2 = mat3(c,   0.0,   -s,
						0.0,   1,  0.0,
						s,	 0.0,	c);


	vec3 newPos =  rotMat2 * (rotMat1 * position) + boxPosition;
    // Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
	gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);

}




	
