/* global recast, dat */

require('three/examples/js/exporters/OBJExporter');
require('three/examples/js/exporters/GLTFExporter');

const URL = window.URL || window.webkitURL;

document.addEventListener('DOMContentLoaded', () => {

  const sceneEl = document.querySelector('a-scene');
  const contentEl = document.querySelector('#content');

  let navMesh;

  /**
   * Rebuild the navigation mesh, and request vertices in order to show a
   * preview in the scene.
   */
  const rebuild = () => {
    console.time('recast.buildSolo');
    recast.buildSolo();
    console.timeEnd('recast.buildSolo');

    recast.getNavMeshVertices(recast.cb((vertices) => {

      if (navMesh) sceneEl.object3D.remove(navMesh);

      const numVerticesUsed = (vertices.length - (vertices.length % 3));
      const position = new Float32Array(numVerticesUsed * 3);
      for (let i = 0; i < numVerticesUsed; i++) {
        position[i * 3 + 0] = vertices[i].x;
        position[i * 3 + 1] = vertices[i].y;
        position[i * 3 + 2] = vertices[i].z;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.addAttribute('position', new THREE.BufferAttribute(position, 3));
      const material = new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff});

      navMesh = new THREE.Mesh(geometry, material);
      sceneEl.object3D.add(navMesh);

    }));
  };

  /**
   * Instructs the browser to download the given file content.
   * @param  {string} filename
   * @param  {string} content
   */
  const downloadFile = (filename, content) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  /**
   * Import an OBJ, replacing the current scene and re-calculating the
   * nav mesh.
   */
  const importFile = () => {
    const uploadInput = document.createElement('input');
    uploadInput.setAttribute('type', 'file');
    uploadInput.style.display = 'none';
    document.body.appendChild(uploadInput);

    uploadInput.addEventListener('change', () => {
      const importURL1 = URL.createObjectURL(uploadInput.files[0]);
      const importURL2 = URL.createObjectURL(uploadInput.files[0]);
      contentEl.setAttribute('obj-model', {obj: importURL1});
      contentEl.addEventListener('model-loaded', function updateModel () {
        URL.revokeObjectURL(importURL1);
        contentEl.removeEventListener('model-loaded', updateModel);
      });
      recast.OBJLoader(importURL2, () => {
        rebuild();
        URL.revokeObjectURL(importURL2);
        document.body.removeChild(uploadInput);
      });
    });

    uploadInput.click();
  };

  sceneEl.addEventListener('loaded', () => {

    /**
     * Configure Recast.
     */
    const settings = {
      cellSize: 0.3,
      cellHeight:0.2,
      agentHeight: 0.8,
      agentRadius: 0.2,
      agentMaxClimb: 2.0,
      agentMaxSlope: 30.0
    };
    recast.set_cellSize(settings.cellSize);
    recast.set_cellHeight(settings.cellHeight);
    recast.set_agentHeight(settings.agentHeight);
    recast.set_agentRadius(settings.agentRadius);
    recast.set_agentMaxClimb(settings.agentMaxClimb);
    recast.set_agentMaxSlope(settings.agentMaxSlope);

    /**
     * Load the nav mesh geometry, and show the GUI when we're ready for user input.
     */
    recast.OBJLoader('assets/nav_test.obj', () => {

      const gui = new dat.GUI();

      /* Navmesh settings */
      const folder = gui.addFolder('Navmesh settings');
      folder.add(settings, 'cellSize', 0, 1).onChange((value) => recast.set_cellSize(value));
      folder.add(settings, 'cellHeight', 0, 1).onChange((value) => recast.set_cellHeight(value));
      folder.add(settings, 'agentHeight', 0, 3).onChange((value) => recast.set_agentHeight(value));
      folder.add(settings, 'agentRadius', 0, 1).onChange((value) => recast.set_agentRadius(value));
      folder.add(settings, 'agentMaxClimb', 0, 10).onChange((value) => recast.set_agentMaxClimb(value));
      folder.add(settings, 'agentMaxSlope', 1, 45).onChange((value) => recast.set_agentMaxSlope(value));
      folder.add({rebuild: rebuild}, 'rebuild');
      folder.open();

      /* Import / Export */
      const ioFolder = gui.addFolder('Import / Export');
      ioFolder.add({import: importFile}, 'import').name('import OBJ');
      ioFolder.add({export0: () => {
        const exporter = new THREE.GLTFExporter();
        exporter.parse(navMesh, (gltfContent) => {
          downloadFile('navmesh.gltf', JSON.stringify(gltfContent));
        });
      }}, 'export0').name('export → glTF');
      ioFolder.add({export1: () => {
        const exporter = new THREE.OBJExporter();
        downloadFile('navmesh.obj', exporter.parse(navMesh));
      }}, 'export1').name('export → OBJ');

      rebuild();

    });

  });
});
