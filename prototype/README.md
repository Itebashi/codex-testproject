# Escape Room Prototype

This directory contains a very simple web-based prototype for a 2D adventure/escape game. Open `index.html` in a web browser to play.

## Compliance and Safety Features
- A pre-play safety checklist requires players to acknowledge age guidance and privacy information before the room becomes interactive.
- Dedicated buttons provide quick access to help, accessibility options, and player support details in line with the project’s [Game Compliance Report](../GAME_COMPLIANCE_REPORT.md).
- Accessibility toggles cover high-contrast visuals, enlarged text, and reduced motion, and can be adjusted during play.
- The session can be reset at any time, returning the player to the checklist so the consent flow can be repeated.

## How it Works
- The room is represented by a static image (`room.svg`).
The image is a simple inline SVG so that no binary assets are needed.

- Clickable hotspots are positioned over the image using absolute positioning.
- Clicking the box gives you a key that appears in the inventory list.
- Clicking the door checks the inventory. If you have the key, you escape and the game ends.

No external dependencies are required; everything runs in the browser with plain HTML, CSS, and JavaScript.
