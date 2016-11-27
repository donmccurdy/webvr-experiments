const AFRAME = require('aframe'),
      glsl = require('glslify'),
      vertexShader = glsl.file('../shaders/transient-sky.vertex.glsl'),
      fragmentShader = glsl.file('../shaders/transient-sky.fragment.glsl');

const textureLoader = new THREE.TextureLoader();

module.exports = {
  dependencies: ['material', 'geometry'],

  schema: {
    camera: {type: 'selector', default: '[camera]'},
    portal: {type: 'selector', default: '[portal]'},
    side:   {default: 'A', oneOf: ['A', 'B']},
    textureA: {type: 'src'},
    textureB: {type: 'src'},
  },

  init: function () {
    const data = this.data,
          mesh = this.el.getObject3D('mesh');

    this.material = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        time:            {value: 0.0},
        colorTop:        {value: new THREE.Color(0xF8F0DD)},
        colorBottom:     {value: new THREE.Color(0xAAAAAA)},
        vCameraPosition: {value: new THREE.Vector3(0, 0, 0)},
        vPortalPosition: {value: new THREE.Vector3(0, 0, 0)},
        vPortalNormal:   {value: new THREE.Vector3(0, 0, 0)},
        textureA:        {type: 't', value: textureLoader.load(data.textureA)},
        textureB:        {type: 't', value: textureLoader.load(data.textureB)},
        portalRadius:    {value: 1.0},
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });

    mesh.material = this.material;
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
