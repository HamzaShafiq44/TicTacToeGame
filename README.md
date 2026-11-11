# Tic-Tac-Toe

A two-player Tic-Tac-Toe game built with plain HTML, CSS, and JavaScript. Play locally in a browser, enter player names, keep score across rounds, and switch between light and dark themes.

## Features

- Selectable 3×3, 4×4, and 5×5 boards with alternating X and O turns
- Editable names for both players
- Win detection for all rows, columns, and diagonals
- Winner message, highlighted winning cells, and a short confetti celebration
- Draw detection when the board fills without a winner
- Scoreboard and round counter; restarting clears the board but keeps scores
- Game progress, scores, round number, and player names restored after a page refresh
- Responsive layout, keyboard focus indicators, and reduced-motion support
- Light/dark theme toggle that remembers the selection in the browser
- Algorithmic winning-line detection: match the board size (3, 4, or 5 in a row)
- Draw state marked with a handshake (🤝)

Game progress, scores, player names, and the theme preference are saved in the browser's local storage and restored after a page reload. This data is local to the current browser and device; it is not shared across browsers or devices.

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
2. Choose a 3×3, 4×4, or 5×5 board. Changing the board size starts a fresh round while keeping the scores.
3. Select an empty square to place your mark. Players alternate turns.
4. Get the number of marks matching the board size in a row (3, 4, or 5), horizontally, vertically, or diagonally.
5. A tied full board is shown with a handshake (🤝).
6. Choose **Restart Game** to start another round. Scores are kept between rounds and page reloads.
7. Use the theme button to switch between light and dark mode.

## Project files

| File | Purpose |
| --- | --- |
| `index.html` | Game structure, player inputs, scoreboard, and controls |
| `styles.css` | Responsive layout, themes, colors, and animations |
| `script.js` | Board state, turns, win/draw checks, scores, and theme behavior |
| `index.js` | Small Node.js HTTP server for serving the app locally |

## Saved data

The browser stores the current board, whose turn it is, round result, player names, scores, and theme selection in local storage. Clearing the browser's site data removes this saved progress. The project does not send game data to a server or synchronize it across devices.
