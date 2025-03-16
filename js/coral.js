// Use global THREE
export function createCoral(params) {
    const group = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({ color: params.color });

    switch (params.shape) {
        case 'branching':
            createBranch(group, material, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), 5, 0.5, 0, 3);
            break;
        case 'rounded':
            const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
            const sphere = new THREE.Mesh(sphereGeometry, material);
            group.add(sphere);
            break;
        default:
            const defaultGeometry = new THREE.SphereGeometry(2, 32, 32);
            const defaultSphere = new THREE.Mesh(defaultGeometry, material);
            group.add(defaultSphere);
            break;
    }
    return group;
}

function createBranch(group, material, start, direction, length, radius, currentLevel, maxLevel) {
    if (currentLevel >= maxLevel) return;
    const geometry = new THREE.CylinderGeometry(radius, radius, length, 8);
    const branch = new THREE.Mesh(geometry, material);
    const end = start.clone().add(direction.clone().multiplyScalar(length));
    const midpoint = start.clone().lerp(end, 0.5);
    branch.position.copy(midpoint);
    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction.clone().normalize());
    branch.setRotationFromQuaternion(quaternion);
    group.add(branch);

    const numChildren = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numChildren; i++) {
        const randomAxis = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
        const angle = Math.random() * Math.PI / 4;
        const childDirection = direction.clone().applyAxisAngle(randomAxis, angle).normalize();
        const offset = new THREE.Vector3((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5);
        const childStart = end.clone().add(offset);
        createBranch(group, material, childStart, childDirection, length * 0.8, radius * 0.8, currentLevel + 1, maxLevel);
    }
}