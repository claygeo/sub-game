// Use global THREE
export function createRocks(count) {
    const geometry = new THREE.SphereGeometry(1, 8, 8);
    const noise = new SimplexNoise();
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        const vertex = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
        const noiseValue = noise.noise3D(vertex.x, vertex.y, vertex.z) * 0.3;
        vertex.multiplyScalar(1 + noiseValue);
        positions[i] = vertex.x;
        positions[i + 1] = vertex.y;
        positions[i + 2] = vertex.z;
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    const material = new THREE.MeshPhongMaterial({ color: 0x696969 });
    const rocks = new THREE.InstancedMesh(geometry, material, count);
    return rocks;
}