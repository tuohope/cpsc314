// Create shared variable for the vertex and fragment shaders
varying vec3 interpolatedNormal;
uniform vec3 gemPosition;
uniform float gemRadius;

vec3 amadilloPos;

/* HINT: YOU WILL NEED A DIFFERENT SHARED VARIABLE TO COLOR ACCORDING TO POSITION */
void main() {
    // color according to location
    interpolatedNormal = position;

    vec3 diff = position - gemPosition;
	float dis = distance(position, gemPosition);		
	if (dis < gemRadius)
		amadilloPos = diff * (gemRadius / dis) + gemPosition;
	else 
		amadilloPos = position; 
		
    // Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(amadilloPos, 1.0);
}