// Use global THREE
export function createSeaweed(count) {
    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 5, 8);
    const material = new THREE.MeshPhongMaterial({ color: 0x2e8b57 });
    const seaweed = new THREE.InstancedMesh(geometry, material, count);
    return seaweed;
}