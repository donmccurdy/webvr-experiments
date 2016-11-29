const AFRAME = require('aframe');

// Components.
require('aframe-teleport-controls');
AFRAME.registerComponent('transient-material', require('./components/transient-material'));

// Shaders.
AFRAME.registerShader('sky', require('./shaders/sky'));
