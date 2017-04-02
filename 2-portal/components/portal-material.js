const AFRAME = require('aframe');

const textureLoader = new THREE.TextureLoader();

module.exports.Component = AFRAME.registerComponent('portal-material', {
  dependencies: ['material', 'geometry'],

  schema: {
    side: {default: 'A', oneOf: ['A', 'B']},
    color: {type: 'color'},
    map: {type: 'asset'}
  },

  init: function () {
    this.system = this.el.sceneEl.systems.portal;

    const el = this.el,
          data = this.data,
          material = this.system.createPortalMaterial({
            map:          {value: textureLoader.load(data.map), type: 't'},
            diffuse:      {value: new THREE.Color(data.color)},
            materialSide: {value: data.side === 'A' ? 1 : -1},
          });

    this.material = material;

    el.addEventListener('model-loaded', function (e) {
      e.detail.model.traverse(function (o) {
        if (o.type === 'Mesh') {
          o.material = material;
        }
      });
    });
  },

  update: function (previousData) {
    if (Object.keys(previousData).length) {
      throw new Error('[portal-material] Updates are not supported.');
    }
  },

  remove: function () {
    this.system.removePortalMaterial(this.material);
  }
});
