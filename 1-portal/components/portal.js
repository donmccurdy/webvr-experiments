module.exports = {
  dependencies: ['material'],

  init: function () {
    const geometry = new THREE.RingGeometry(1, 1.1, 32);
    const mesh = new THREE.Mesh(geometry, this.el.components.material.material);
    this.el.setObject3D('mesh', mesh);
  },

  remove: function () {
    this.el.removeObject3D('mesh');
  }
};
