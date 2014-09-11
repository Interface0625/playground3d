

/***********************************************************************

Shader types and reqs:
2D:
 * line
 * point

3D:
 * textured arrays
 * textured elements
 * textured, normal elements + lights (, specMap, NormalMap etc...)


***********************************************************************/


precision mediump float;

varying vec2 vTextureCoord;
varying vec3 vTransformedNormal;
varying vec4 vPosition;

uniform float uMaterialShininess;

uniform bool uShowSpecularHighlights;
uniform bool uUseLighting;
uniform bool uUseTextures;

uniform vec3 uAmbientColor;

uniform vec3 uPointLightingLocation;
uniform vec3 uPointLightingSpecularColor;
uniform vec3 uPointLightingDiffuseColor;

uniform sampler2D uSampler;
uniform sampler2D 