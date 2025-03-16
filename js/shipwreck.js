// Use global THREE
export function createShipwreck() {
    const group = new THREE.Group();
    const noise = new SimplexNoise();
    const hullGeometry = new THREE.BoxGeometry(20, 5, 5);
    const positions = hullGeometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        const vertex = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
        const noiseValue = noise.noise3D(vertex.x * 0.2, vertex.y * 0.2, vertex.z * 0.2) * 0.5;
        vertex.add(new THREE.Vector3(0, noiseValue, noiseValue));
        positions[i] = vertex.x;
        positions[i + 1] = vertex.y;
        positions[i + 2] = vertex.z;
    }
    hullGeometry.attributes.position.needsUpdate = true;
    hullGeometry.computeVertexNormals();
    const hullMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const hull = new THREE.Mesh(hullGeometry, hullMaterial);
    hull.rotation.z = Math.PI / 6;
    group.add(hull);

    const mastGeometry = new THREE.CylinderGeometry(0.2, 0.2, 10, 8);
    const mast = new THREE.Mesh(mastGeometry, hullMaterial);
    mast.position.set(5, 5, 0);
    mast.rotation.x = Math.PI / 4;
    group.add(mast);
    return group;
}