#pragma glslify: intersect = require(./util/intersect-segment-and-plane.glsl)

uniform vec3 vCameraPosition;
uniform vec3 vPortalPosition;
uniform vec3 vPortalNormal;
uniform float portalRadius;
uniform sampler2D textureA;
uniform sampler2D textureB;

varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
  vec3 vIntersectPosition = intersect(
    vCameraPosition,
    vWorldPosition,
    vPortalPosition,
    vPortalNormal
  );

  vec4 baseColor = texture2D(textureA, vUv);
  if (distance(vPortalPosition, vIntersectPosition) < portalRadius) {
    baseColor = texture2D(textureB, vUv);
  }

  gl_FragColor = baseColor;
}
