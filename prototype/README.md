# Escape Room Prototype

This directory contains a very simple web-based prototype for a 2D adventure/escape game. Open `index.html` in a web browser to play.

## How it Works
- The room is represented by a static image (`room.svg`).
The image is a simple inline SVG so that no binary assets are needed.

- Clickable hotspots are positioned over the image using absolute positioning.
- Clicking the box gives you a key that appears in the inventory list.
- Clicking the door checks the inventory. If you have the key, you escape and the game ends.

No external dependencies are required; everything runs in the browser with plain HTML, CSS, and JavaScript.
