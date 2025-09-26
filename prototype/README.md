# Escape Room Prototype

This directory contains a very simple web-based prototype for a 2D adventure/escape game.

## Play locally
Open `index.html` in any modern web browser to try the basic prototype with external CSS and JavaScript files.

## Shareable single-file build
If you want to share the game just by pasting a link, use the `shareable.html` file. All styling, script logic, and art are inline so it runs anywhere with no additional assets.

### Generate a data URL
You can convert the single HTML file into a `data:` URL that can be dropped directly into a chat message:

```bash
node tools/make-data-url.mjs shareable.html > url.txt
```

The resulting string inside `url.txt` starts with `data:text/html;base64,`. Paste that entire string into the chat—most messaging apps will turn it into a clickable link that opens the game immediately in the browser.

### Switch languages through the URL or UI
The shareable version supports English and Japanese. There is a language toggle built into the page, and the choice is reflected in the fragment so it can be shared. When linking to the hosted HTML use `?lang=en` (default is `ja`); if you are sharing the inlined `data:` URL use `#lang=en` at the end of the string.

## How it works
- The room art is drawn with inline SVG so no binary assets are required.
- Clickable hotspots are positioned over the image using absolute positioning.
- Clicking the box gives you a key that appears in the inventory list.
- Clicking the door checks the inventory. If you have the key, you escape and the game ends.

No external dependencies are required; everything runs in the browser with plain HTML, CSS, and JavaScript.
