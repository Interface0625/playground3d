precision mediump float;

varying vec2 vTextureCoord;
varying vec3 vTransformedNormal;
varying vec4 vPosition;

uniform sampler2D uSampler;

void main(void) {
    vec3 lightWeighting;
    lightWeighting = vec3(1.0, 1.0, 1.0);

    vec4 fragmentColor;
    fragmentColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    gl_FragColor = vec4(fragmentColor.rgb * lightWeighting, fragmentColor.a);
}

