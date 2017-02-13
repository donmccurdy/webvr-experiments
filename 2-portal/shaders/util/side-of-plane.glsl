float sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {

  return sign( dot( point - pointOnPlane, planeNormal ) );

}

#pragma glslify: export(sideOfPlane)
