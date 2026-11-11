# Tic-Tac-Toe

A two-player Tic-Tac-Toe game built with plain HTML, CSS, and JavaScript. Play locally in a browser, enter player names, keep score across rounds, and switch between light and dark themes.

## Features

- 3×3 board with alternating X and O turns
- Editable names for both players
- Win detection for all rows, columns, and diagonals
- Winner message, highlighted winning cells, and a short confetti celebration
- Draw detection when the board fills without a winner
- Scoreboard and round counter; restarting clears the board but keeps scores
- Responsive layout, keyboard focus indicators, and reduced-motion support
- Light/dark theme toggle that remembers the selection in the browser

Scores and the current game are kept in page memory, so they reset when the page is reloaded. The theme preference is saved in local storage and remains after reload.

## Run locally

You need Node.js installed. No packages or build step are required.

1. Open a terminal in this project folder.
2. Start the local web server:

   ```sh
   node index.js
   ```

3. Open [http://localhost:4001](http://localhost:4001) in a browser.
4. Stop the server with `Ctrl+C`.

The server uses port `4001` by default. To use another port:

```sh
PORT=4002 node index.js
```

Then open `http://localhost:4002`.

## How to play

1. Optionally enter names for Player 1 (X) and Player 2 (O).
2. Select an empty square to place your mark. Players alternate turns.
3. Get three marks in a row, column, or diagonal to win.
4. Choose **Restart Game** to start another round. The scoreboard is kept until the page is reloaded.
5. Use the theme button to switch between light and dark mode.

## Project files

| File | Purpose |
| --- | --- |
| `index.html` | Game structure, player inputs, scoreboard, and controls |
| `styles.css` | Responsive layout, themes, colors, and animations |
| `script.js` | Board state, turns, win/draw checks, scores, and theme behavior |
| `index.js` | Small Node.js HTTP server for serving the app locally |

