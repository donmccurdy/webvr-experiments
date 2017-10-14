/* global recast, dat */

document.addEventListener('DOMContentLoaded', () => {

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

  const sceneEl = document.querySelector('a-scene');
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
      const folder = gui.addFolder('Recast');
      folder.add(settings, 'cellSize', 0, 1).onChange((value) => recast.set_cellSize(value));
      folder.add(settings, 'cellHeight', 0, 1).onChange((value) => recast.set_cellHeight(value));
      folder.add(settings, 'agentHeight', 0, 3).onChange((value) => recast.set_agentHeight(value));
      folder.add(settings, 'agentRadius', 0, 1).onChange((value) => recast.set_agentRadius(value));
      folder.add(settings, 'agentMaxClimb', 0, 10).onChange((value) => recast.set_agentMaxClimb(value));
      folder.add(settings, 'agentMaxSlope', 1, 45).onChange((value) => recast.set_agentMaxSlope(value));
      folder.add({rebuild: rebuild}, 'rebuild');
      folder.open();

    });

  });
});
