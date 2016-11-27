// const glsl = require('glslify'),
//       vertexShader = glsl.file('./sky.vertex.glsl'),
//       fragmentShader = glsl.file('./sky.fragment.glsl');

// module.exports = {
//   schema: {
//     colorTop:    { type: 'color', default: 'black', is: 'uniform' },
//     colorBottom: { type: 'color', default: 'red',   is: 'uniform' },
//     vCameraPosition: { type: 'vec3', is: 'uniform' },
//     vPortalPosition: { type: 'vec3', is: 'uniform' },
//     vPortalNormal:   { type: 'vec3', is: 'uniform' },
//   },
//   vertexShader: vertexShader,
//   fragmentShader: fragmentShader,
//   tick: function () {
//     console.log('[transient-sky] tick()');

//     const el = this.el,
//           cameraEl = this.el.sceneEl.querySelector('[camera]');

//     el.setAttribute('vCameraPosition', cameraEl.getComputedAttribute('position'));
//   }
// };
