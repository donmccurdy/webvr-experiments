const AFRAME = require('aframe'); // jshint ignore:line

THREE.EffectComposer = require('./lib/EffectComposer');

THREE.RenderPass = require('./lib/RenderPass');
THREE.ShaderPass = require('./lib/ShaderPass');
THREE.DotScreenPass = require('./lib/DotScreenPass');
THREE.BloomPass = require('./lib/BloomPass');
THREE.UnrealBloomPass = require('./lib/UnrealBloomPass');

THREE.CopyShader = require('./lib/CopyShader');
THREE.ConvolutionShader = require('./lib/ConvolutionShader');
THREE.DotScreenShader = require('./lib/DotScreenShader');
THREE.LuminosityHighPassShader = require('./lib/LuminosityHighPassShader');

require('./components/material-map');
require('./effects-system');
