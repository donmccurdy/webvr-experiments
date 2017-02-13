const AFRAME = require('aframe'),
      glsl = require('glslify'),
      vertexShader = glsl.file('../shaders/portal-discard.vertex.glsl'),
      fragmentShader = glsl.file('../shaders/portal-discard.fragment.glsl');

const textureLoader = new THREE.TextureLoader();

module.exports = {
  dependencies: ['material', 'geometry'],

  schema: {
    camera: {type: 'selector', default: '[camera]'},
    portal: {type: 'selector', default: ''},
    side:   {default: 'A', oneOf: ['A', 'B']},
    color: {type: 'color'},
    map: {type: 'src'}
  },

  init: function () {
    const el = this.el,
          data = this.data;

    this.cameraPosition = new THREE.Vector3();
    this.portalPosition = new THREE.Vector3();
    this.portalNormal = new THREE.Vector3(0, 0, 1);
    this.portalRadius = 0.8;
    this.sideOfPortal = 1.0; // 1.0 | -1.0
    this.prevPosition = null;

    this.updateTracking();

    const material = this.material = new THREE.ShaderMaterial({
      uniforms: {
        map:             {type: 't', value: textureLoader.load(data.map)},
        diffuse:         {value: new THREE.Color(data.color)},
        vCameraPosition: {value: this.cameraPosition},
        vPortalPosition: {value: this.portalPosition},
        vPortalNormal:   {value: this.portalNormal},
        portalRadius:    {value: this.portalRadius},
        sideOfPortal:         {value: this.sideOfPortal},
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });

    el.addEventListener('model-loaded', function (e) {
      e.detail.model.traverse(function (o) {
        if (o.type === 'Mesh') {
          o.material = material;
        }
      });
    });
  },

  /**
   * Update all uniforms passed as inputs to the shader.
   */
  tick: function () {
    this.updateTracking();
    this.material.uniforms.sideOfPortal.value = this.sideOfPortal;
    this.material.uniforms.vCameraPosition.value.copy(this.cameraPosition);
    this.material.uniforms.vPortalPosition.value.copy(this.portalPosition);
    this.material.uniforms.vPortalNormal.value.copy(this.portalNormal);
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

      this.cameraPosition.copy(data.camera.getComputedAttribute('position'));
      this.portalPosition.copy(data.portal.getComputedAttribute('position'));

      if (prevPosition && prevPosition.equals(currentPosition)) {
        return;
      } else if (prevPosition) {
        displacementSegment.start.copy(prevPosition);
        displacementSegment.end.copy(currentPosition);
        portalPlane.setFromNormalAndCoplanarPoint(this.portalNormal, this.portalPosition);

        if (portalPlane.intersectLine(displacementSegment, portalIntersection)
            && portalIntersection.distanceTo(this.portalPosition) < this.portalRadius) {
          this.sideOfPortal *= -1;
        }
      } else {
        this.prevPosition = new THREE.Vector3();
      }

      this.prevPosition.copy(currentPosition);
    };
  }())
};
