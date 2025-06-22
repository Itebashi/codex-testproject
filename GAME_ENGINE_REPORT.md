# 2D Adventure Game Engine Planning Report

## Introduction
This document provides an initial study for developing a 2D adventure game engine inspired by classic titles such as **Shadowgate** and **悪魔の招待状 (Uninvited)**. Due to environment limitations, no live internet search was performed; instead this summary relies on existing knowledge about these games.

## Reference Games Overview

### Shadowgate
- Originally released on the Apple Macintosh (later ported to NES and other systems).
- Point-and-click interface where the player selects verbs (e.g., **Look**, **Open**, **Take**, **Use**) from a list.
- The player navigates through static rooms represented by background images.
- Puzzle solving is achieved through item interactions and examining objects.
- The game features text descriptions and occasional death scenes on incorrect actions.

### 悪魔の招待状 (Uninvited)
- Another point-and-click adventure from the same era, using a similar UI layout.
- The screen is divided into a background display, a text output window, and a panel of action buttons.
- Players can combine verbs with items or room objects. Inventory management is key to solving puzzles.
- Events and progression occur based on player interactions and triggered flags.

## Common Gameplay Mechanics
- **Static Room-Based Navigation**: Each location is represented by a single background image with associated interactive objects.
- **Action Buttons / Verb System**: A set of verbs allows the player to choose how to interact with the environment (e.g., Look, Take, Open, Close, Use, Talk).
- **Inventory Management**: Items can be picked up, used, or combined with other objects to solve puzzles.
- **Text Display**: Descriptive text communicates the results of actions, narrative events, and dialogue.
- **Event and Flag System**: Progress depends on certain conditions being met (e.g., items collected, puzzles solved).

## Suggested Engine Features
1. **Scene Management**
   - Load and display static backgrounds for each scene.
   - Support for interactive hotspots tied to objects within the scene.

2. **Verb-Based UI**
   - Present a configurable list of verbs/actions as UI buttons.
   - Allow verbs to be combined with targets (scene objects or inventory items).

3. **Inventory System**
   - Track items collected by the player.
   - Provide UI for examining and using items.

4. **Event Scripting**
   - Use a simple scripting language or data-driven JSON/YAML format to define scenes, items, and event triggers.
   - Support branching outcomes based on conditions (flags, inventory contents, previous choices).

5. **Text and Dialogue Management**
   - Display messages in a dedicated text window with optional character portraits.
   - Support for multi-line dialogue and simple text effects.

6. **Save/Load Mechanism**
   - Allow players to save progress and load from a previous state.

## Development Considerations
- **Data-Driven Design**: Keeping scenes, items, and events in easily editable data files will make it possible to author new content without code changes.
- **Extensible Input**: While classic games use mouse/keyboard, providing controller or touch support can broaden the audience.
- **Modularity**: Separate rendering, input, and game logic layers to simplify maintenance and potential platform ports.

## Conclusion
The engine should replicate the core feel of classic adventure titles while allowing for greater flexibility and modern conveniences. Focusing on a verb-based interface, static room navigation, and an extensible scripting system will provide a strong foundation for creating new adventures inspired by **Shadowgate** and **悪魔の招待状**.
