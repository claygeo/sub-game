## Submarine Coral Reef Exploration

Welcome to Submarine Coral Reef Exploration, an immersive 3D web-based game built with Three.js! Dive into an underwater world filled with coral reefs, fish schools, whales, seaweed, rocks, and even a mysterious shipwreck. Explore the dynamic ocean floor, pilot your submarine, and discover the beauty of the deep sea.

	Genre: Exploration / Simulation
	Technology: Three.js, Simplex Noise, JavaScript (ES6 Modules)
	Status: In Development (Last Updated: March 15, 2025)
	
## Features

	Navigate a customizable submarine through a procedurally generated coral reef environment.
	Encounter dynamic marine life, including fish schools, whales, and seaweed, generated using Simplex Noise.
	Explore a shipwreck and interact with the underwater terrain.
	Real-time performance stats and minimalistic design for smooth gameplay.
	Responsive design that adapts to different screen sizes.
	
## How to Play

	Controls
		
		W: Move the submarine forward.
		S: Move the submarine backward.
		A: Turn the submarine left.
		D: Turn the submarine right.
		Spacebar: Rise vertically.
		Shift: Sink vertically.
		The camera follows the submarine, providing a first-person exploration view.
		
## Gameplay 

	Start the game by opening index.html in a web browser.
	Explore the underwater world by navigating your submarine.
	Watch for randomly generated corals, fish, and other objects as you move.
	Avoid getting too close to the ocean floor to prevent collision (the submarine adjusts its height automatically).
	
## Setup and Installation

	Running Locally
	
		1. Clone or Download the Repository:
		
			Download the sub-game folder from the repository or copy it to your local machine.
		
		2. Open the Game:
		
			Navigate to the sub-game folder.
			Double-click index.html to open it in your web browser, or use a local server for best results (see below).
			
		3. Using a Local Server (Recommended):
		
			Install a simple HTTP server (e.g., via Node.js with http-server):
				Run npm install -g http-server in your terminal.
				Navigate to the sub-game folder and run http-server.
				Open your browser and go to http://localhost:8080 
				
			This avoids CORS issues and ensures ES6 modules load correctly.
				