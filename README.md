#Submarine Coral Reef Exploration

An immersive 3D web-based underwater exploration game built with Three.js. Dive into a procedurally generated ocean world filled with coral reefs, dynamic marine life, kelp forests, and mysterious underwater terrain.

## Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Getting Started](#-getting-started)
- [Controls](#-controls)
- [Gameplay](#-gameplay)
- [Technical Details](#-technical-details)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## Features

### **Dynamic Ocean Environment**
- **Procedural Terrain Generation**: Infinite underwater landscape using Simplex noise
- **Real-time Terrain Updates**: Chunks load and unload based on submarine position
- **Multiple Material Systems**: Switch between Lambert, Phong, and Standard materials
- **Advanced Fog System**: Atmospheric underwater lighting effects

### **Living Marine Ecosystem**
- **Kelp Forests**: Swaying kelp strands with realistic physics
- **Fish Schools**: Dynamic schools of fish with flocking behavior
- **Rock Formations**: Procedurally deformed geological structures
- **Animated Wildlife**: All marine life moves with realistic patterns

### **Advanced Submarine**
- **Detailed 3D Model**: Yellow submarine with conning tower, periscope, and propeller
- **Dynamic Lighting**: Dual headlights with shadow casting
- **Realistic Physics**: Collision detection with terrain
- **Visual Effects**: Glowing windows and ambient lighting

###**Immersive Controls**
- **WASD Movement**: Intuitive submarine navigation
- **Mouse Camera**: Free-look camera system with zoom
- **Vertical Control**: Rise and dive with Space/Shift
- **Debug Features**: Wireframe mode, material cycling, fog toggle

### 📊 **Real-time Information**
- **Performance Stats**: FPS and render statistics
- **Position Tracking**: Current depth and coordinates
- **Object Counter**: Dynamic object management
- **Terrain Height**: Real-time terrain elevation data

## Demo

[**Watch Complete Demo (1:42)**](https://github.com/claygeo/sub-game/releases/download/v1.0.0/submarine-demo.mp4)

## Getting Started

### Prerequisites

- Modern web browser with WebGL support (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Quick Start

1. **Download the Game**
   ```bash
   git clone <repository-url>
   cd submarine-coral-reef-exploration
   ```

2. **Launch the Game**
   
   **Option A: Direct Browser Launch**
   - Double-click `index.html`
   - Open in your preferred browser
   
   **Option B: Local Server (Recommended)**
   ```bash
   # Using Node.js http-server
   npm install -g http-server
   http-server
   # Navigate to http://localhost:8080
   
   # Using Python
   python -m http.server 8000
   # Navigate to http://localhost:8000
   ```

### Why Use a Local Server?

- Prevents CORS issues with ES6 modules
- Ensures optimal performance
- Required for some advanced features

## Controls

### Basic Navigation
| Key | Action |
|-----|--------|
| **W** | Move submarine forward |
| **S** | Move submarine backward |
| **A** | Turn submarine left |
| **D** | Turn submarine right |
| **Space** | Rise vertically |
| **Shift** | Sink vertically |

### Camera Controls
| Control | Action |
|---------|--------|
| **Mouse Drag** | Look around |
| **Mouse Wheel** | Zoom in/out |
| **Right Click + Drag** | Alternative camera control |

### Debug Features
| Key | Action |
|-----|--------|
| **T** | Toggle wireframe mode |
| **C** | Cycle terrain colors |
| **F** | Toggle fog effects |
| **L** | Toggle terrain shading |
| **H** | Toggle headlights |

## Gameplay

### Exploration Objectives

1. **Discover Marine Life**
   - Navigate through kelp forests
   - Observe fish school behaviors
   - Explore rock formations

2. **Terrain Exploration**
   - Dive into deep ocean valleys
   - Navigate underwater ridges
   - Find optimal routes through terrain

3. **Technical Mastery**
   - Master submarine controls
   - Optimize exploration efficiency
   - Use debug features for analysis

### Gameplay Tips

- **Stay Above Terrain**: The submarine automatically maintains minimum height
- **Use Headlights**: Essential for exploring dark ocean depths
- **Follow Fish Schools**: They often lead to interesting areas
- **Experiment with Views**: Try different camera angles and distances
- **Monitor Performance**: Use stats to optimize your experience

## Technical Details

### Technology Stack

- **Three.js r134**: 3D graphics and rendering
- **Simplex Noise 2.4.0**: Procedural terrain generation
- **Stats.js r16**: Performance monitoring
- **Vanilla JavaScript**: ES6+ features

### Architecture

```
Game Components:
├── Scene Management
│   ├── Terrain System (Dynamic chunks)
│   ├── Lighting System (Multiple light sources)
│   └── Camera System (Free-look + follow)
├── Object Generation
│   ├── Kelp Forests (Curved geometry)
│   ├── Fish Schools (Flocking behavior)
│   └── Rock Formations (Deformed geometry)
├── Submarine System
│   ├── 3D Model (Multi-part geometry)
│   ├── Physics (Movement + collision)
│   └── Lighting (Headlights + ambient)
└── User Interface
    ├── Real-time Stats
    ├── Debug Information
    └── Control Instructions
```

### Performance Features

- **Frustum Culling**: Only render visible objects
- **Dynamic LOD**: Terrain adapts to distance
- **Object Pooling**: Efficient memory management
- **Chunk-based Loading**: Infinite world with finite memory

### Browser Compatibility

| Browser | Version | Status |
|---------|---------|---------|
| Chrome | 90+ | Fully Supported |
| Firefox | 88+ | Fully Supported |
| Safari | 14+ | Fully Supported |
| Edge | 90+ | Fully Supported |

## 🛠 Development

### Project Structure

```
submarine-coral-reef-exploration/
├── index.html              # Main game file
├── README.md               # This documentation
└── assets/                 # Future asset directory
    ├── textures/          # Texture files
    ├── models/            # 3D models
    └── audio/             # Sound effects
```

### Code Organization

The game is built as a single-file application with modular functions:

- **Initialization**: Scene setup and asset loading
- **Generation**: Procedural content creation
- **Animation**: Real-time updates and rendering
- **Controls**: Input handling and user interaction
- **UI**: Interface updates and information display

### Customization Options

```javascript
// Terrain generation parameters
const cellSize = 50;        // Size of each terrain chunk
const viewRadius = 3;       // Number of chunks around player

// Submarine physics
const speed = 0.5;          // Movement speed
const turnSpeed = 0.03;     // Rotation speed
const verticalSpeed = 0.3;  // Vertical movement speed

// Visual effects
const fogDensity = 0.006;   // Underwater fog intensity
const lightIntensity = 2;   // Headlight brightness
```

### Future Enhancements

- **Sound System**: Underwater ambient sounds and effects
- **Mission System**: Structured exploration objectives
- **Multiplayer Support**: Shared underwater exploration
- **Advanced Physics**: Water currents and submarine dynamics
- **Save System**: Progress persistence and world state
- **Mobile Support**: Touch controls and responsive design

## Troubleshooting

### Common Issues

**Black Screen on Startup**
- Ensure WebGL is enabled in your browser
- Try using a local server instead of direct file opening
- Check browser console for error messages

**Performance Issues**
- Lower the view radius in the code
- Disable shadows for better performance
- Use wireframe mode to debug rendering load

**Controls Not Responding**
- Click on the game window to ensure focus
- Check if any browser extensions are interfering
- Try refreshing the page

**Terrain Not Loading**
- Verify Simplex Noise library is loading correctly
- Check network connectivity for CDN resources
- Ensure JavaScript is enabled

### Debug Information

The game provides real-time debug information:
- **FPS Counter**: Monitor rendering performance
- **Object Count**: Track generated content
- **Position Data**: Current submarine location
- **Terrain Height**: Ground elevation at current position

### Browser Developer Tools

Enable the browser console to see detailed debug information:
```javascript
// Enable verbose logging
console.log('Game initialization complete');
console.log('Terrain generation active');
console.log('Marine life systems running');
```

## Contributing

We welcome contributions to enhance the underwater exploration experience!

### How to Contribute

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit Your Changes**
   ```bash
   git commit -m 'Add amazing underwater feature'
   ```
4. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Ideas

- **New Marine Life**: Add dolphins, sharks, or coral types
- **Enhanced Submarine**: More detailed models and animations
- **Sound Integration**: Underwater audio experience
- **Mobile Optimization**: Touch controls and responsive design
- **Performance Improvements**: Optimization and rendering enhancements

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Three.js Community**: For the amazing 3D graphics library
- **Simplex Noise**: For procedural generation capabilities
- **Marine Biology References**: For realistic underwater ecosystem inspiration
- **WebGL Specification**: For enabling browser-based 3D graphics
