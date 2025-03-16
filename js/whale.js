// Use global THREE
import { getHeight } from './utilities.js';

export function createWhale(params, x, z) {
    const noise = new SimplexNoise(); // Global from CDN
    function getRadius(t) {
        if (t < 0.6) return Math.sin(t / 0.6 * Math.PI / 2) * (params.size / 2);
        else {
            const headT = (t - 0.6) / 0.4;
            return (params.size / 2) * (1 - 0.333 * Math.cos(headT * Math.PI / 2));
        }
    }

    const points = [];
    for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        points.push(new THREE.Vector2(getRadius(t), t * params.size));
    }

    const geometry = new THREE.LatheGeometry(points, 12);
    const positions = geometry.attributes.position.array;
    const normals = geometry.attributes.normal.array;
    for (let i = 0; i < positions.length; i += 3) {
        const vertex = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
        const normal = new THREE.Vector3(normals[i], normals[i + 1], normals[i + 2]).normalize();
        const noiseValue = noise.noise3D(vertex.x * 5, vertex.y * 5, vertex.z * 5);
        vertex.add(normal.multiplyScalar(noiseValue * (params.size / 20)));
        positions[i] = vertex.x;
        positions[i + 1] = vertex.y;
        positions[i + 2] = vertex.z;
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();

    const material = new THREE.MeshPhongMaterial({ color: params.color });
    const whale = new THREE.Mesh(geometry, material);
    const y = getHeight(x, z, 0) - 20;
    whale.position.set(x, y, z);
    whale.initialPosition = new THREE.Vector3(x, y, z);
    return whale;
}