// Use global THREE
export function createSubmarine(params) {
    const group = new THREE.Group();
    const material = new THREE.MeshPhongMaterial({ color: params.color });
    const cylinderGeometry = new THREE.CylinderGeometry(params.size, params.size, params.size * 10, 8);
    const cylinder = new THREE.Mesh(cylinderGeometry, material);
    cylinder.rotation.x = Math.PI / 2;
    group.add(cylinder);
    const coneGeometry = new THREE.ConeGeometry(params.size, params.size * 5, 8);
    const cone = new THREE.Mesh(coneGeometry, material);
    cone.position.set(0, 0, params.size * 5);
    group.add(cone);
    return group;
}