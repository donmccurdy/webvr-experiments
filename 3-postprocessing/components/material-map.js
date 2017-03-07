const AFRAME = require('aframe');

module.exports = AFRAME.registerComponent('material-map', {
  schema: {
    map: {default: ''},
    uri: {default: ''}
  },
  init: function () {
    this.textureLoader = new THREE.TextureLoader();
    this.modify();
    this.el.addEventListener('model-loaded', this.modify.bind(this));
  },

  modify: function () {
    const textureLoader = this.textureLoader;
    const mesh = this.el.getObject3D('mesh');
    const data = this.data;

    if (!mesh) return;

    mesh.traverse(function(node) {
      if (node.material) {

        switch (data.map) {
          case 'emissiveMap':
            node.material.emissive = node.material.color.clone();
            node.material.emissiveMap = textureLoader.load(data.uri);
            break;
          default:
            node.material[data.map] = textureLoader.load(data.uri);
        }

        node.material.needsUpdate = true;
      }
    });
  }
});
