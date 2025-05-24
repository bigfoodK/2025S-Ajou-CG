attribute vec4 vPosition;
attribute vec3 vNormal;
attribute vec2 vTexCoord;

varying vec4 fColor;
varying vec2 fTexCoord;

uniform vec4 ambientProduct, diffuseProduct, specularProduct;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec4 lightPosition;
uniform float shininess;

void main() {
    vec3 pos = (modelViewMatrix * vPosition).xyz;

    // fixed light position
    vec3 light = lightPosition.xyz;
    vec3 L = normalize(light - pos);
    vec3 E = normalize(-pos);
    vec3 H = normalize(L + E);

    vec4 NN = vec4(vNormal, 0);

    // Transform vertex normal into eye coordinates
    vec3 N = normalize((modelViewMatrix * NN).xyz);

    // Compute terms in the illumination equation
    vec4 ambient = ambientProduct;

    float d_val = max(dot(L, N), 0.0);
    vec4 diffuse = d_val * diffuseProduct;

    float s_val = pow(max(dot(N, H), 0.0), shininess);
    vec4 specular = s_val * specularProduct;

    // in case the light source is behind the surface
    if(dot(L, N) < 0.0) {
        specular = vec4(0.0, 0.0, 0.0, 1.0);
    }

    gl_Position = projectionMatrix * modelViewMatrix * vPosition;
    fColor = ambient + diffuse + specular;
    fColor.a = 1.0;
    fTexCoord = vTexCoord;
}