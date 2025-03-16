// Use global SimplexNoise
export const simplex = new SimplexNoise();

export function generateCoralDescription() {
    const colors = ['vibrant', 'dull'];
    const shapes = ['branching', 'rounded'];
    return `${colors[Math.floor(Math.random() * colors.length)]} ${shapes[Math.floor(Math.random() * shapes.length)]} coral`;
}

export function generateFishDescription() {
    const sizes = ['small', 'medium'];
    const behaviors = ['darting', 'swimming'];
    return `${sizes[Math.floor(Math.random() * sizes.length)]} ${behaviors[Math.floor(Math.random() * behaviors.length)]} fish`;
}

export function generateWhaleDescription() {
    const sizes = ['large', 'massive'];
    const colors = ['gray', 'blue'];
    return `${sizes[Math.floor(Math.random() * sizes.length)]} ${colors[Math.floor(Math.random() * colors.length)]} whale`;
}

export function parseDescription(description) {
    const words = description.split(' ');
    if (description.includes('coral')) {
        return { type: 'coral', color: words[0] === 'vibrant' ? 0xff3333 : 0x666633, shape: words[1] };
    } else if (description.includes('fish')) {
        return { type: 'fish', size: words[0] === 'small' ? 0.5 : 1, speed: words[1] === 'darting' ? 2 : 1, color: 0x0077ff };
    } else if (description.includes('whale')) {
        return { type: 'whale', size: words[0] === 'large' ? 8 : 10, color: words[1] === 'gray' ? 0x888888 : 0x333366, texture: 'barnacles' };
    } else if (description.includes('submarine')) {
        return { type: 'submarine', size: words[0] === 'small' ? 0.5 : 1, color: words[1] === 'yellow' ? 0xffff00 : 0x666666 };
    }
}

export function getHeight(x, z, time) {
    const baseNoise = simplex.noise2D(x / 100 + time * 0.01, z / 100 + time * 0.01) * 10;
    const hillsNoise = simplex.noise2D(x / 300, z / 300) * 30;
    const trenchNoise = Math.min(0, simplex.noise2D(x / 50 + time * 0.005, z / 50) * 50);
    const warpX = simplex.noise2D(x / 200, z / 200) * 20;
    const warpZ = simplex.noise2D(x / 200 + 100, z / 200) * 20;
    const warpedBase = simplex.noise2D((x + warpX) / 150, (z + warpZ) / 150) * 15;
    const slope = Math.abs(simplex.noise2D(x / 100, z / 100));
    const feedback = slope > 0.7 ? simplex.noise2D(x / 20, z / 20) * 20 : 0;
    const fractal = simplex.noise2D(x / 25, z / 25) * (hillsNoise * 0.2);
    const density = baseNoise + hillsNoise + trenchNoise + warpedBase + feedback + fractal;
    const threshold = density > 10 ? density * 1.5 : density < -20 ? density * 2 : density;
    return -50 + threshold;
}