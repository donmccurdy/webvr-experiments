const THREE = require('three');
const EventEmitter = require('events');
const OrbitControls = require('../lib/OrbitControls');
const createVignetteBackground = require('three-vignette-background');

const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

const DEFAULT_OPTIONS = {};

class Viewer extends EventEmitter {
  /**
   * @param {Element} el
   */
  constructor (el, options = {}) {
    super();

    options = Object.assign({}, DEFAULT_OPTIONS, options);

    this.el = el;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera( 60, el.clientWidth / el.clientHeight, 1, 100 );
    this.camera.position.set(-2.5, 1, 5);
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setClearColor( options.bgLight );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( el.clientWidth, el.clientHeight );

    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = -5;
    this.controls.enablePan = false;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 90;

    this.background = createVignetteBackground({
      aspect: this.camera.aspect,
      grainScale: IS_IOS ? 0 : 0.003, // mattdesl/three-vignette-background#1
      colors: [options.bgLight, options.bgDark]
    });
    this.scene.add(this.background);

    if (options.enableLights) {
      const dirLight = new THREE.DirectionalLight(0xffffff, 1);
      dirLight.position.set(100, 100, 50);
      this.camera.add(dirLight);
      const ambLight = new THREE.AmbientLight(0x404040, 2);
      this.camera.add(ambLight);
    }

    this.el.appendChild(this.renderer.domElement);

    this.animate = this.animate.bind(this);
    requestAnimationFrame( this.animate );
    window.addEventListener('resize', this.resize.bind(this), false);
  }

  animate (t) {
    requestAnimationFrame( this.animate );

    this.controls.update();
    this.emit('tick', t);
    this.render();
  }

  render () {
    this.renderer.render( this.scene, this.camera );
  }

  resize () {
    const {clientHeight, clientWidth} = this.el.parentElement;

    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.background.style({aspect: this.camera.aspect});
    this.renderer.setSize(clientWidth, clientHeight);
  }
}

module.exports = Viewer;
