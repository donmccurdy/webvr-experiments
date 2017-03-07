const AFRAME = require('aframe');

THREE.EffectComposer = require('./lib/EffectComposer');

THREE.RenderPass = require('./lib/RenderPass');
THREE.ShaderPass = require('./lib/ShaderPass');
THREE.DotScreenPass = require('./lib/DotScreenPass');
THREE.BloomPass = require('./lib/BloomPass');

THREE.CopyShader = require('./lib/CopyShader');
THREE.ConvolutionShader = require('./lib/ConvolutionShader');
THREE.DotScreenShader = require('./lib/DotScreenShader');

/**
 * Configures a THREE.EffectComposer on the current A-Frame scene.
 */
AFRAME.registerSystem('effects', {
  /**
   * Configure composer with a few arbitrary passes.
   */
  init: function () {
    const sceneEl = this.sceneEl;

    if (!sceneEl.hasLoaded) {
      sceneEl.addEventListener('render-target-loaded', this.init.bind(this));
      return;
    }

    const scene = sceneEl.object3D;
    const renderer = sceneEl.renderer;
    const camera = sceneEl.camera;

    const composer = new THREE.EffectComposer(renderer);
    const pass1 = new THREE.RenderPass(scene, camera);
    const pass2 = new THREE.BloomPass(3, 25, 5, 256);
    const pass3 = new THREE.DotScreenPass();

    pass3.renderToScreen = true;

    composer.addPass(pass1);
    composer.addPass(pass2);
    composer.addPass(pass3);

    this.composer = composer;
    this.t = 0;
    this.dt = 0;

    this.bind();
  },

  /**
   * Record the timestamp for the current frame.
   * @param {number} t
   * @param {number} dt
   */
  tick: function (t, dt) {
    this.t = t;
    this.dt = dt;
  },

  /**
   * Binds the EffectComposer to the A-Frame render loop.
   * (This is the hacky bit.)
   */
  bind: function () {
    const renderer = this.sceneEl.renderer;
    const render = renderer.render;
    const system = this;
    let isDigest = false;

    renderer.render = function () {
      if (isDigest) {
        render.apply(this, arguments);
      } else {
        isDigest = true;
        system.composer.render(system.dt);
        isDigest = false;
      }
    };
  }
});
