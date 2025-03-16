// Use global THREE and SimplexNoise from CDN
export function createEnvironment() {
    const simplex = new SimplexNoise();
    const geometry = new THREE.PlaneGeometry(125, 125, 5, 5); // Lightweight terrain (36 vertices, 25 faces)
    const positions = geometry.attributes.position.array;

    // Minimal terrain generation for performance
    let minHeight = Infinity, maxHeight = -Infinity;
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];

        const baseNoise = simplex.noise2D(x / 25, z / 25) * 5; // Very simple, minimal amplitude
        const height = baseNoise; // Single layer for minimal load

        positions[i + 1] = height;

        minHeight = Math.min(minHeight, height);
        maxHeight = Math.max(maxHeight, height);
    }
    console.log('Terrain height range:', { minHeight, maxHeight });

    // Ensure geometry is fully updated
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals(); // Try default, but manually fix if needed
    geometry.computeBoundingBox();
    console.log('Geometry vertex count:', geometry.attributes.position.count);
    console.log('Geometry face count:', geometry.index ? geometry.index.count / 3 : 'No indices');

    // Manually set vertex normals to ensure upward-facing (0, 1, 0) for a flat plane
    const normals = new Float32Array(geometry.attributes.position.count * 3);
    for (let i = 0; i < normals.length; i += 3) {
        normals[i] = 0;     // x
        normals[i + 1] = 1; // y (upward)
        normals[i + 2] = 0; // z
    }
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    console.log('Manually set terrain normals:', Array.from(normals).slice(0, 9));

    const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00, // Bright green for visibility
        side: THREE.DoubleSide, // Ensure both sides render (prevent culling)
        visible: true,
    });

    const terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2; // Lay flat
    terrain.position.set(0, 0, 0); // Center at origin initially
    terrain.visible = true;

    // Debug: Ensure terrain is not culled or hidden
    console.log('Terrain visibility:', terrain.visible, 'Material opacity:', material.opacity, 'Position:', terrain.position);

    // Test with a simple box to confirm rendering (temporary, comment out after testing)
    // const testBoxGeometry = new THREE.BoxGeometry(10, 10, 10);
    // const testBoxMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, visible: true });
    // const testBox = new THREE.Mesh(testBoxGeometry, testBoxMaterial);
    // testBox.position.set(0, 2.5, 0); // Center on terrain
    // terrain.add(testBox);

    console.log('Terrain position:', terrain.position);
    console.log('Terrain material:', terrain.material);

    // Independent blue test plane (tiny, lightweight)
    const testPlaneGeometry = new THREE.PlaneGeometry(25, 25, 1, 1); // Very small test plane
    const testPlaneMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide });
    const testPlane = new THREE.Mesh(testPlaneGeometry, testPlaneMaterial);
    testPlane.rotation.x = -Math.PI / 2;
    testPlane.position.set(0, 0, 0);

    // Height lookup function with improved bounds and debug
    function getHeight(x, z, time = 0) {
        const width = 6; // 5 segments + 1
        const depth = 6;
        const segmentSize = 125 / 5;

        const localX = x - terrain.position.x;
        const localZ = z - terrain.position.z;

        // Clamp to ensure valid grid positions, expanding slightly for edge cases
        const gridX = Math.max(0, Math.min(width - 1, Math.round((localX + 62.5) / segmentSize)));
        const gridZ = Math.max(0, Math.min(depth - 1, Math.round((localZ + 62.5) / segmentSize)));

        if (gridX < 0 || gridX >= width || gridZ < 0 || gridZ >= depth) {
            console.log('Height out of bounds at (', x, ',', z, '): Using nearest edge height');
            // Return nearest edge height instead of 0
            const edgeHeight = positions[(gridZ * width + (gridX < 0 ? 0 : width - 1)) * 3 + 1] || 0;
            return edgeHeight;
        }

        const i = (gridZ * width + gridX) * 3 + 1;
        let height = positions[i];

        const fracX = ((localX + 62.5) % segmentSize) / segmentSize;
        const fracZ = ((localZ + 62.5) % segmentSize) / segmentSize;

        if (fracX === 0 && fracZ === 0) {
            console.log('Height at (', x, ',', z, '):', height, 'Grid (', gridX, ',', gridZ, ')');
            return height;
        }

        const heights = [];
        const indices = [
            gridZ * width + gridX,
            (gridZ + 1) * width + gridX,
            gridZ * width + (gridX + 1),
            (gridZ + 1) * width + (gridX + 1),
        ];

        for (let idx of indices) {
            if (idx >= 0 && idx < width * depth) {
                heights.push(positions[idx * 3 + 1]);
            } else {
                heights.push(0); // Default height for out-of-bounds indices
            }
        }

        if (heights.length === 4) {
            const height00 = heights[0];
            const height10 = heights[2];
            const height01 = heights[1];
            const height11 = heights[3];
            const interpX0 = height00 + fracX * (height10 - height00);
            const interpX1 = height01 + fracX * (height11 - height01);
            const finalHeight = interpX0 + fracZ * (interpX1 - interpX0);
            console.log('Interpolated height at (', x, ',', z, '):', finalHeight);
            return finalHeight;
        } else {
            console.log('Fallback height at (', x, ',', z, '):', heights[0] || 0);
            return heights[0] || 0;
        }
    }

    function updatePosition(submarinePosition) {
        const terrainX = Math.floor(submarinePosition.x / 125) * 125; // Smaller chunks (125 units)
        const terrainZ = Math.floor(submarinePosition.z / 125) * 125;
        terrain.position.set(terrainX, 0, terrainZ);
        console.log('Terrain updated to:', terrain.position, 'Submarine position:', submarinePosition);
    }

    return {
        mesh: terrain,
        testPlane: testPlane,
        getHeight: (x, z, time = 0) => getHeight(x, z, time),
        updatePosition: updatePosition,
    };
}