const AFRAME = require('aframe'),
      glsl = require('glslify'),
      vertexShader = glsl.file('../shaders/portal-material.vertex.glsl'),
      fragmentShader = glsl.file('../shaders/portal-material.fragment.glsl');

const textureLoader = new THREE.TextureLoader();

AFRAME.registerComponent('portal', {});

module.exports.System = AFRAME.registerSystem('portal', {
  schema: {
    camera: {type: 'selector', default: '[camera]'},
    portal: {type: 'selector', default: '[portal]'}
  },

  init: function () {
    this.materials = new Set();

    this.cameraSide = 1.0; // 1.0 | -1.0
    this.cameraPosition = new THREE.Vector3();
    this.portalPosition = new THREE.Vector3();
    this.portalNormal = new THREE.Vector3(0, 0, 1);
    this.portalRadius = 0.8;
    this.prevPosition = null;

    this.updateTracking();
  },

  /**
   * Update all uniforms passed as inputs to the shader.
   */
  tick: function () {
    this.updateTracking();

    const materials = Array.from(this.materials);
    for (var i = 0, material; (material = materials[i]); i++) {
      material.uniforms.cameraSide.value = this.cameraSide;
      material.uniforms.vCameraPosition.value.copy(this.cameraPosition);
      material.uniforms.vPortalPosition.value.copy(this.portalPosition);
      material.uniforms.vPortalNormal.value.copy(this.portalNormal);
    }
  },

  createPortalMaterial: function (inputUniforms) {
    const uniforms = AFRAME.utils.extend({
      cameraSide:      {value: this.cameraSide},
      vCameraPosition: {value: this.cameraPosition},
      vPortalPosition: {value: this.portalPosition},
      vPortalNormal:   {value: this.portalNormal},
      portalRadius:    {value: this.portalRadius}
    }, inputUniforms);

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });

    this.materials.add(material);

    return material;
  },

  removePortalMaterial: function (material) {
    this.materials.delete(material);
  },

  /**
   * Detects when the camera passes through the portal and inverts the shader.
   */
  updateTracking: (function () {
    const portalPlane = new THREE.Plane(),
          portalIntersection = new THREE.Vector3(),
          displacementSegment = new THREE.Line3(new THREE.Vector3(), new THREE.Vector3());

    return function () {
      const data = this.data,
            prevPosition = this.prevPosition,
            currentPosition = this.cameraPosition;

      this.cameraPosition.copy(data.camera.getAttribute('position'));
      this.portalPosition.copy(data.portal.getAttribute('position'));

      if (prevPosition && prevPosition.equals(currentPosition)) {
        return;
      } else if (prevPosition) {
        displacementSegment.start.copy(prevPosition);
        displacementSegment.end.copy(currentPosition);
        portalPlane.setFromNormalAndCoplanarPoint(this.portalNormal, this.portalPosition);

        if (portalPlane.intersectLine(displacementSegment, portalIntersection)
            && portalIntersection.distanceTo(this.portalPosition) < this.portalRadius) {
          this.cameraSide *= -1;
        }
      } else {
        this.prevPosition = new THREE.Vector3();
      }

      this.prevPosition.copy(currentPosition);
    };
  }())
});

module.exports.Component = AFRAME.registerComponent('portal-material', {
  dependencies: ['material', 'geometry'],

  schema: {
    side: {default: 'A', oneOf: ['A', 'B']},
    color: {type: 'color'},
    map: {type: 'src'}
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
    this.system.remove(this.material);
  }
});
