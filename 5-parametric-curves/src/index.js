const THREE = window.THREE = require('three');
const glslify = require('glslify');
const Viewer = require('./viewer');
const createTubeGeometry = require('../lib/create-tube-geometry');
const vert = glslify('../shaders/tube.vert.glsl');
const frag = glslify('../shaders/tube.frag.glsl');
const tweenr = require('tweenr')();

const numSides = 20;
const subdivisions = 200;

const geometry = createTubeGeometry(numSides, subdivisions);

const material = new THREE.RawShaderMaterial({
  vertexShader: vert,
  fragmentShader: frag,
  side: THREE.FrontSide,
  extensions: {
    derivatives: true
  },
  defines: {
    lengthSegments: subdivisions.toFixed(1),
    FLAT_SHADED: false
  },
  uniforms: {
    color: { type: 'c', value: new THREE.Color(0xFF34B1) },
    thickness: { type: 'f', value: 0.1 },
    time: { type: 'f', value: 0.0 },
    radialSegments: { type: 'f', value: numSides },
    animateRadius: { type: 'f', value: 0.0 },
    animateStrength: { type: 'f', value: 1.0 }
  }
});

const el = document.querySelector('.container');
const viewer = new Viewer(el, {bgDark: '#14797F', bgLight: '#66C6CC'});

const mesh = new THREE.Mesh(geometry, material);
mesh.frustumCulled = false;
mesh.renderOrder = 999;

el.addEventListener('click', () => {
  const uniforms = mesh.material.uniforms;
  tweenr.to(uniforms.animateRadius, { value: 1, duration: 0.5, delay: 0, ease: 'epxoOut' });
  tweenr.to(uniforms.animateStrength, { value: 0, duration: 1, delay: 0, ease: 'expoInOut' });
  setTimeout(() => {
    tweenr.to(uniforms.animateRadius, { value: 0, duration: 0.5, delay: 0, ease: 'epxoOut' });
    tweenr.to(uniforms.animateStrength, { value: 1, duration: 1, delay: 0, ease: 'expoInOut' });
  }, 1000);
});

viewer.scene.add(mesh);

viewer.on('tick', (t) => {
  mesh.material.uniforms.time.value = t / 1000;
});
