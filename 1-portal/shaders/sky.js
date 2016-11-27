const glsl = require('glslify'),
      vertexShader = glsl.file('./sky.vertex.glsl'),
      fragmentShader = glsl.file('./sky.fragment.glsl');

module.exports = {
  schema: {
    colorTop:    { type: 'color', default: 'black', is: 'uniform' },
    colorBottom: { type: 'color', default: 'red',   is: 'uniform' }
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
};
