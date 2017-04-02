#pragma glslify: linePlaneIntersect = require(./util/line-plane-intersect.glsl)
#pragma glslify: sideOfPlane = require(./util/side-of-plane.glsl)

uniform vec3 vPortalPosition;
uniform vec3 vPortalNormal;
uniform float portalRadius;
uniform float cameraSide;
uniform float materialSide;
uniform sampler2D map;
uniform vec3 diffuse;

varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
  vec3 vIntersectPosition = linePlaneIntersect(
    cameraPosition,
    cameraPosition - vWorldPosition,
    vPortalPosition,
    vPortalNormal
  );

  float cameraDir = sideOfPlane(cameraPosition, vPortalPosition, vPortalNormal);
  float vexelDir = sideOfPlane(vWorldPosition, vPortalPosition, vPortalNormal);
  bool passThrough = cameraDir * vexelDir < 0.0
    && distance(vPortalPosition, vIntersectPosition) < portalRadius;

  if (cameraSide * materialSide > 0.0 == passThrough) {
    discard;
  }

  gl_FragColor = vec4(diffuse, 1.0) * texture2D(map, vUv);
}
