#pragma glslify: intersect = require(./util/intersect-segment-and-plane.glsl)

uniform vec3 vCameraPosition;
uniform vec3 vPortalPosition;
uniform vec3 vPortalNormal;
uniform float portalRadius;
uniform float isSideA;
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

  float blend = isSideA;
  if (distance(vPortalPosition, vIntersectPosition) < portalRadius) {
    blend *= -1.0;
  }

  gl_FragColor = mix(texture2D(textureB, vUv), texture2D(textureA, vUv), clamp(blend, 0.0, 1.0));
}
