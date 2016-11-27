module.exports = {
  init: function () {
    const geometry = new THREE.RingGeometry(1, 1.1, 18);
    const material = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});
    const mesh = new THREE.Mesh(geometry, material);
    this.el.setObject3D('mesh', mesh);
  },

  remove: function () {
    this.el.removeObject3D('mesh');
  }
};
