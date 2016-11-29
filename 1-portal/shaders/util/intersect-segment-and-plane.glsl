vec3 intersectSegmentAndPlane(vec3 s1, vec3 s2, vec3 pv, vec3 pn) {
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

#pragma glslify: export(intersectSegmentAndPlane)
