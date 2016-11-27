uniform float time;
uniform vec3 colorTop;
uniform vec3 colorBottom;
uniform vec3 vCameraPosition;
uniform vec3 vPortalPosition;
uniform vec3 vPortalNormal;
uniform float portalRadius;

varying vec3 vWorldPosition;

float distanceToSegment(vec3 p1, vec3 p2, vec3 test) {
  vec3 v = p2 - p1;
  vec3 w = test - p1;

  float c1 = dot(w, v);
  if (c1 <= 0.0) {
    return distance(test, p1);
  }

  float c2 = dot(v,v);
  if (c2 <= c1) {
    return distance(test, p2);
  }

  float b = c1 / c2;
  vec3 pb = p1 + b * v;
  return distance(test, pb);
}

void main() {
  vec3 pointOnSphere = normalize(vWorldPosition.xyz);
  float f = 1.0;
  if (pointOnSphere.y > - 0.2) {
    f = sin(pointOnSphere.y * 2.0);
  }

  vec4 baseColor = vec4(mix(colorBottom, colorTop, f), 1.0);

  float portalDist = distanceToSegment(vCameraPosition, vWorldPosition, vPortalPosition);
  if (portalDist < portalRadius) {
    baseColor.r = 1.0;
  }

  gl_FragColor = baseColor;
}
