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

#pragma glslify: export(distanceToSegment)
