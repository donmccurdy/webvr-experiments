const AFRAME = require('aframe'),
      glsl = require('glslify'),
      vertexShader = glsl.file('../shaders/transient-sky.vertex.glsl'),
      fragmentShader = glsl.file('../shaders/transient-sky.fragment.glsl');

module.exports = {
  dependencies: ['material', 'geometry'],

  schema: {
    camera: {type: 'selector', default: '[camera]'},
    portal: {type: 'selector', default: '[portal]'},
    side:   {default: 'A', oneOf: ['A', 'B']}
  },

  init: function () {
    this.material = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        time:            {value: 0.0},
        colorTop:        {value: new THREE.Color(0xF8F0DD)},
        colorBottom:     {value: new THREE.Color(0xAAAAAA)},
        vCameraPosition: {value: new THREE.Vector3(0, 0, 0)},
        vPortalPosition: {value: new THREE.Vector3(0, 0, 0)},
        vPortalNormal:   {value: new THREE.Vector3(0, 0, 0)},
        portalRadius:    {value: 1.0},
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });


    this.el.object3D.traverse((o) => {
      if (o instanceof THREE.Mesh) o.material = this.material;
    });
  },

  tick: function (t) {
    const data = this.data,
          cameraPos = data.camera.getComputedAttribute('position'),
          portalPos = data.portal.getComputedAttribute('position');

    this.material.uniforms.time.value = t;
    this.material.uniforms.vCameraPosition.value.copy(cameraPos);
    this.material.uniforms.vPortalPosition.value.copy(portalPos);
    this.material.uniforms.vPortalNormal.value.copy({x: 0, y: 0, z: 1});
  }
};
