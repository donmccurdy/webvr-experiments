uniform float time;
uniform vec3 colorTop;
uniform vec3 colorBottom;
uniform vec3 vCameraPosition;
uniform vec3 vPortalPosition;
uniform vec3 vPortalNormal;
uniform float portalRadius;
uniform sampler2D textureA;
uniform sampler2D textureB;

varying vec3 vWorldPosition;
varying vec2 vUv;

float distanceToSegment(vec3 p1, vec3 p2, vec3 test) {
  vec3 v = p2 - p1;
  vec3 w = test - p1;

  float c1 = dot(w, v);
  if (c1 <= 0.0) {
    return distance(test, p1);
  }

  float c2 = dot(v, v);
  if (c2 <= c1) {
    return distance(test, p2);
  }

  float b = c1 / c2;
  vec3 pb = p1 + b * v;
  return distance(test, pb);
}

vec3 intersectSegmentToPlane(vec3 s1, vec3 s2, vec3 pv, vec3 pn) {
    vec3 u = s2 - s1;
    vec3 w = s1 - pv;

    float D = dot(pn, u);
    float N = -dot(pn, w);

    vec3 noHit = vec3(99999.0, 99999.0, 99999.0);

    if (abs(D) < 0.000001) { // Segment is parallel to plane.
      if (N == 0.0) {
        return noHit; // Segment lies in plane.
      } else {
        return noHit; // No intersection.
      }
    }

    // Segment and plane are not parallel. Compute intersection.
    float sI = N / D;
    if (sI < 0.0 || sI > 1.0) {
      return noHit; // No intersection.
    }

    return s1 + sI * u; // Compute segment intersect point.
}

void main() {
  vec3 vIntersectPosition = intersectSegmentToPlane(
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
