// Use global THREE and Stats
import { createEnvironment } from './environment.js';
import { createSubmarine } from './submarine.js';
import { createCoral } from './coral.js';
import { createFishSchool } from './fish.js';
import { createWhale } from './whale.js';
import { createSeaweed } from './seaweed.js';
import { createRocks } from './rocks.js';
import { createShipwreck } from './shipwreck.js';
import { parseDescription, generateCoralDescription, generateFishDescription, generateWhaleDescription } from './utilities.js';

document.addEventListener('DOMContentLoaded', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(0, 100, 100); // Very low camera for minimal load
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: false }); // No antialiasing
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x87ceeb, 1);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Minimal light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6); // Minimal light
    directionalLight.position.set(0, 100, 100);
    scene.add(directionalLight);

    const axesHelper = new THREE.AxesHelper(125); // Very small helper
    scene.add(axesHelper);

    // Environment
    const environment = createEnvironment();
    scene.add(environment.mesh);
    scene.add(environment.testPlane);
    directionalLight.target = environment.mesh;

    // Red cube (minimal)
    const cubeGeometry = new THREE.BoxGeometry(12.5, 12.5, 12.5); // Tiny cube
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 6.25, 0); // Adjusted for size
    scene.add(cube);

    function getHeight(x, z, time = 0) {
        const height = environment.getHeight(x, z, time);
        return height; // Use directly, debug logs in environment.js
    }

    // Submarine
    const subParams = parseDescription('small yellow submarine');
    const submarine = createSubmarine(subParams);
    submarine.position.set(0, getHeight(0, 0) + 20, 0); // Reduced height offset
    scene.add(submarine);

    const subLight = new THREE.SpotLight(0xffff00, 1, 125, Math.PI / 6, 0.5); // Minimal light
    subLight.position.set(0, -5, 0);
    subLight.target = environment.mesh;
    submarine.add(subLight);

    // Stats
    const stats = new Stats();
    document.getElementById('stats').appendChild(stats.domElement);

    // Controls
    let moveForward = false, moveBackward = false, turnLeft = false, turnRight = false, rise = false, sink = false;
    document.addEventListener('keydown', (e) => {
        switch (e.key.toLowerCase()) {
            case 'w': moveForward = true; break;
            case 's': moveBackward = true; break;
            case 'a': turnLeft = true; break;
            case 'd': turnRight = true; break;
            case ' ': rise = true; break;
            case 'shift': sink = true; break;
        }
    });
    document.addEventListener('keyup', (e) => {
        switch (e.key.toLowerCase()) {
            case 'w': moveForward = false; break;
            case 's': moveBackward = false; break;
            case 'a': turnLeft = false; break;
            case 'd': turnRight = false; break;
            case ' ': rise = false; break;
            case 'shift': sink = false; break;
        }
    });

    function updateSubmarine(time) {
        const speed = 0.2, turnSpeed = 0.02, verticalSpeed = 0.2; // Very slow for performance
        if (moveForward) {
            const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(submarine.quaternion);
            submarine.position.add(direction.multiplyScalar(speed));
            const nearbyHeight = getHeight(submarine.position.x, submarine.position.z, time * 0.0001);
            submarine.position.y = Math.max(submarine.position.y, nearbyHeight + 20);
            console.log('Submarine position:', submarine.position, 'Height:', nearbyHeight);
        }
        if (moveBackward) {
            const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(submarine.quaternion);
            submarine.position.add(direction.multiplyScalar(speed));
        }
        if (turnLeft) submarine.rotateY(turnSpeed);
        if (turnRight) submarine.rotateY(-turnSpeed);
        if (rise) submarine.position.y += verticalSpeed;
        if (sink) submarine.position.y -= verticalSpeed;
        submarine.position.y = Math.max(submarine.position.y, getHeight(submarine.position.x, submarine.position.z, time * 0.0001) + 20);
        submarine.position.clamp(new THREE.Vector3(-1000, -Infinity, -1000), new THREE.Vector3(1000, Infinity, 1000));
        subLight.position.set(0, -5, 10);
        environment.updatePosition(submarine.position);
    }

    function updateCamera() {
        const cameraOffset = new THREE.Vector3(0, 12.5, 12.5); // Minimal offset
        cameraOffset.applyQuaternion(submarine.quaternion);
        camera.position.copy(submarine.position).add(cameraOffset);
        camera.lookAt(submarine.position);
        camera.position.clamp(new THREE.Vector3(-1000, -Infinity, -1000), new THREE.Vector3(1000, Infinity, 1000));
    }

    // World population with minimal density
    const cellSize = 100, viewRadius = 1; // Minimum view radius
    const generatedCells = new Map();
    const cellObjects = new Map();
    const fishObjects = [];
    const whaleObjects = [];

    function populateWorld() {
        const subPosition = submarine.position;
        const subCellX = Math.floor(subPosition.x / cellSize);
        const subCellZ = Math.floor(subPosition.z / cellSize);
        const activeCells = new Set();

        for (let dx = -viewRadius; dx <= viewRadius; dx++) {
            for (let dz = -viewRadius; dz <= viewRadius; dz++) {
                const cellX = subCellX + dx;
                const cellZ = subCellZ + dz;
                const cellKey = `${cellX}-${cellZ}`;
                activeCells.add(cellKey);
                if (!generatedCells.has(cellKey)) generateCell(cellX, cellZ);
            }
        }

        for (const [cellKey, objects] of cellObjects) {
            if (!activeCells.has(cellKey)) {
                objects.corals.forEach(c => {
                    scene.remove(c);
                    console.log('Removed coral at:', c.position);
                });
                objects.fishSchools.forEach(fs => {
                    fs.children.forEach(f => {
                        fishObjects.splice(fishObjects.indexOf(f), 1);
                        scene.remove(f);
                        console.log('Removed fish at:', f.position);
                    });
                    scene.remove(fs);
                    console.log('Removed fish school at:', fs.position);
                });
                objects.whales.forEach(w => {
                    whaleObjects.splice(whaleObjects.indexOf(w), 1);
                    scene.remove(w);
                    console.log('Removed whale at:', w.position);
                });
                objects.seaweed.forEach(s => {
                    scene.remove(s);
                    console.log('Removed seaweed at:', s.position);
                });
                objects.rocks.forEach(r => {
                    scene.remove(r);
                    console.log('Removed rock at:', r.position);
                });
                if (objects.shipwreck) {
                    scene.remove(objects.shipwreck);
                    console.log('Removed shipwreck at:', objects.shipwreck.position);
                }
                cellObjects.delete(cellKey);
                generatedCells.delete(cellKey);
            }
        }
    }

    function generateCell(cellX, cellZ) {
        const cellKey = `${cellX}-${cellZ}`;
        if (generatedCells.has(cellKey)) return;

        generatedCells.set(cellKey, true);
        const x = cellX * cellSize + Math.random() * cellSize;
        const z = cellZ * cellSize + Math.random() * cellSize;
        const objects = { corals: [], fishSchools: [], whales: [], seaweed: [], rocks: [], shipwreck: null };
        cellObjects.set(cellKey, objects);

        // Minimal objects per cell
        if (Math.random() < 0.5) { // 50% chance for 1 coral
            const coral = createCoral(parseDescription(generateCoralDescription()));
            const height = getHeight(x, z, performance.now() * 0.0001);
            coral.position.set(x, height + 10, z); // No random offset for simplicity
            scene.add(coral);
            objects.corals.push(coral);
            console.log('Added coral at:', coral.position);
        }

        if (Math.random() < 0.3) { // 30% chance for 1 fish school
            const fishSchool = createFishSchool(parseDescription(generateFishDescription()), x, z);
            fishSchool.children.forEach(f => fishObjects.push(f));
            const height = getHeight(x, z, performance.now() * 0.0001);
            fishSchool.position.set(x, height + 10, z);
            scene.add(fishSchool);
            objects.fishSchools.push(fishSchool);
            console.log('Added fish school at:', fishSchool.position);
        }

        // Removed whales and shipwrecks for performance
        // if (Math.random() < 0.05) { ... } // Whale
        // if (Math.random() < 0.02 && Math.abs(cellX) <= 2 && Math.abs(cellZ) <= 2) { ... } // Shipwreck

        if (Math.random() < 0.4) { // 40% chance for 1 seaweed
            const seaweed = createSeaweed(1); // Single instance
            const sx = x;
            const sz = z;
            const height = getHeight(sx, sz, performance.now() * 0.0001);
            const matrix = new THREE.Matrix4().setPosition(sx, height + 8, sz);
            seaweed.setMatrixAt(0, matrix);
            scene.add(seaweed);
            objects.seaweed.push(seaweed);
            console.log('Added seaweed at:', { x: sx, y: height + 8, z: sz });
        }

        if (Math.random() < 0.3) { // 30% chance for 1 rock
            const rocks = createRocks(1); // Single instance
            const rx = x;
            const rz = z;
            const height = getHeight(rx, rz, performance.now() * 0.0001);
            const scale = 1; // Fixed small scale
            const matrix = new THREE.Matrix4().makeScale(scale, scale, scale).setPosition(rx, height + scale / 2 + 5, rz);
            rocks.setMatrixAt(0, matrix);
            scene.add(rocks);
            objects.rocks.push(rocks);
            console.log('Added rock at:', { x: rx, y: height + scale / 2 + 5, z: rz });
        }
    }

    // Remove animations to reduce load
    function animateFish(time) {
        // Disabled for performance
    }

    function animateWhales(time) {
        // Disabled for performance
    }

    let lastTime = 0;
    function animate(time) {
        requestAnimationFrame(animate);
        const delta = (time - lastTime) * 0.001;
        lastTime = time;

        stats.begin();
        updateSubmarine(time);
        populateWorld();
        updateCamera();
        renderer.render(scene, camera);
        stats.end();
    }
    animate(0);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    console.log('Terrain added to scene:', scene.children.includes(environment.mesh));
});