// Use global THREE
import { getHeight } from './utilities.js';

export function createFish(params) {
    const group = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({ color: params.color });
    const bodyGeometry = new THREE.CylinderGeometry(params.size, params.size, params.size * 5, 8);
    const body = new THREE.Mesh(bodyGeometry, material);
    body.rotation.z = Math.PI / 2;
    group.add(body);
    const tailGeometry = new THREE.ConeGeometry(params.size, params.size * 3, 8);
    const tail = new THREE.Mesh(tailGeometry, material);
    tail.position.set(params.size * 2.5, 0, 0);
    tail.rotation.z = Math.PI / 2;
    group.add(tail);
    group.initialPosition = new THREE.Vector3(0, 0, 0);
    group.speed = params.speed;
    return group;
}

export function createFishSchool(params, x, z) {
    const group = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const fish = createFish(params);
        fish.initialPosition = new THREE.Vector3(
            x + Math.random() * 10 - 5,
            getHeight(x, z, performance.now() * 0.0001) + Math.random() * 15 - 5,
            z + Math.random() * 10 - 5
        );
        fish.position.copy(fish.initialPosition);
        group.add(fish);
    }
    return group;
}