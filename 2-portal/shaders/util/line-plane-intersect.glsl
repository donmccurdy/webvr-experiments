vec3 linePlaneIntersect(
    in vec3 pointOnLine,
    in vec3 lineDirection,
    in vec3 pointOnPlane,
    in vec3 planeNormal ) {

  return lineDirection * (
    dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection )
  ) + pointOnLine;

}

#pragma glslify: export(linePlaneIntersect)
