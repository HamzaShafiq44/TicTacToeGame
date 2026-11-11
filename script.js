const gameBoard = document.querySelector('.game-board');
const boardSizeInput = document.getElementById('board-size');
const status = document.querySelector('.status');
const statusSymbol = document.querySelector('.status-symbol');
const statusMessage = document.querySelector('.status-message');
const playerOneInput = document.getElementById('player-one-name');
const playerTwoInput = document.getElementById('player-two-name');
const restartButton = document.getElementById('restart-button');
const themeToggleButton = document.getElementById('theme-toggle');
const scoreXElement = document.getElementById('score-x');
const scoreOElement = document.getElementById('score-o');
const scoreXName = document.getElementById('score-x-name');
const scoreOName = document.getElementById('score-o-name');
const roundNumberElement = document.getElementById('round-number');
const themeStorageKey = 'tic-tac-toe-theme';
const gameStorageKey = 'tic-tac-toe-progress';
const supportedBoardSizes = [3, 4, 5];

let cells = [];
let boardSize = 3;
let currentPlayer = 'X';
let board = Array(9).fill('');
let gameActive = true;
let roundNumber = 1;
const scores = { X: 0, O: 0 };

const getWinningLength = (size = boardSize) => size;

const getPlayerName = (playerSymbol) => {
  const input = playerSymbol === 'X' ? playerOneInput : playerTwoInput;
  const value = input.value.trim();
  return value || (playerSymbol === 'X' ? 'Player 1' : 'Player 2');
};

const updateStatus = (message, symbol = currentPlayer, state = 'playing') => {
  statusSymbol.textContent = symbol || '';
  statusSymbol.hidden = !symbol;
  statusMessage.textContent = message;
  status.dataset.state = state;
  status.dataset.player = symbol.toLowerCase();
};

const updateScoreboard = () => {
  scoreXElement.textContent = scores.X;
  scoreOElement.textContent = scores.O;
  scoreXName.textContent = getPlayerName('X');
  scoreOName.textContent = getPlayerName('O');
};

const updateTurnIndicator = () => {
  document.querySelector('.score-x').classList.toggle('active', gameActive && currentPlayer === 'X');
  document.querySelector('.score-o').classList.toggle('active', gameActive && currentPlayer === 'O');
};

const saveGameProgress = () => {
  const savedProgress = {
    board,
    boardSize,
    currentPlayer,
    gameActive,
    roundNumber,
    scores,
    playerNames: {
      X: playerOneInput.value,
      O: playerTwoInput.value
    }
  };

  try {
    localStorage.setItem(gameStorageKey, JSON.stringify(savedProgress));
  } catch (error) {
    console.error('Unable to save Tic-Tac-Toe progress in local storage.', error);
  }
};

const createBoard = (size) => {
  boardSize = size;
  board = Array(size * size).fill('');
  cells = Array.from({ length: size * size }, (_, index) => {
    const cell = document.createElement('button');
    cell.className = 'cell';
    cell.type = 'button';
    cell.dataset.index = index;
    cell.setAttribute('aria-label', `Cell ${index + 1}`);
    cell.addEventListener('click', () => handleCellClick(index));
    return cell;
  });

  gameBoard.replaceChildren(...cells);
  gameBoard.dataset.size = size;
  gameBoard.style.setProperty('--board-size', size);
  gameBoard.setAttribute('aria-label', `${size} by ${size} Tic-Tac-Toe board`);
  boardSizeInput.value = String(size);
};

const resetBoard = (newRound = true) => {
  if (newRound) {
    roundNumber += 1;
  }

  board = Array(boardSize * boardSize).fill('');
  currentPlayer = 'X';
  gameActive = true;
  roundNumberElement.textContent = roundNumber;

  cells.forEach((cell) => {
    cell.textContent = '';
    cell.disabled = false;
    cell.classList.remove('mark-x', 'mark-o', 'winning-cell');
  });

  document.querySelectorAll('.celebration').forEach((celebration) => celebration.remove());
  updateScoreboard();
  updateTurnIndicator();

  const openingMessage = newRound
    ? `Round ${roundNumber} — ${getPlayerName('X')} goes first!`
    : `${getPlayerName('X')}'s turn — let's play!`;
  updateStatus(openingMessage, 'X');
  saveGameProgress();
};

const checkWinner = () => {
  const winningLength = getWinningLength();
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1]
  ];

  for (let row = 0; row < boardSize; row += 1) {
    for (let column = 0; column < boardSize; column += 1) {
      const startIndex = row * boardSize + column;
      const symbol = board[startIndex];
      if (!symbol) {
        continue;
      }

      for (const [rowStep, columnStep] of directions) {
        const endRow = row + (winningLength - 1) * rowStep;
        const endColumn = column + (winningLength - 1) * columnStep;
        if (endRow < 0 || endRow >= boardSize || endColumn < 0 || endColumn >= boardSize) {
          continue;
        }

        const pattern = Array.from({ length: winningLength }, (_, offset) => (
          (row + offset * rowStep) * boardSize + column + offset * columnStep
        ));

        if (pattern.every((index) => board[index] === symbol)) {
          return { symbol, pattern };
        }
      }
    }
  }

  return null;
};

const updateBoardSize = () => {
  const selectedSize = Number(boardSizeInput.value);
  if (!supportedBoardSizes.includes(selectedSize) || selectedSize === boardSize) {
    return;
  }

  createBoard(selectedSize);
  resetBoard(true);
  updateStatus(
    `${selectedSize} × ${selectedSize} board — ${getWinningLength()} in a row to win. ${getPlayerName('X')} goes first!`,
    'X'
  );
  saveGameProgress();
};

const restoreGameProgress = () => {
  let savedProgress;

  try {
    const storedProgress = localStorage.getItem(gameStorageKey);
    if (!storedProgress) {
      return false;
    }
    savedProgress = JSON.parse(storedProgress);
  } catch (error) {
    console.error('Unable to read saved Tic-Tac-Toe progress.', error);
    return false;
  }

  const savedBoardSize = savedProgress?.boardSize
    ?? (savedProgress?.board?.length === 9 ? 3 : null);
  const validBoardSize = supportedBoardSizes.includes(savedBoardSize);
  const validBoard = validBoardSize
    && Array.isArray(savedProgress.board)
    && savedProgress.board.length === savedBoardSize * savedBoardSize
    && savedProgress.board.every((space) => space === '' || space === 'X' || space === 'O');
  const validPlayers = savedProgress?.playerNames
    && typeof savedProgress.playerNames.X === 'string'
    && typeof savedProgress.playerNames.O === 'string';
  const validScores = savedProgress?.scores
    && Number.isSafeInteger(savedProgress.scores.X)
    && savedProgress.scores.X >= 0
    && Number.isSafeInteger(savedProgress.scores.O)
    && savedProgress.scores.O >= 0;
  const validProgress = validBoard
    && (savedProgress.currentPlayer === 'X' || savedProgress.currentPlayer === 'O')
    && typeof savedProgress.gameActive === 'boolean'
    && Number.isSafeInteger(savedProgress.roundNumber)
    && savedProgress.roundNumber >= 1
    && validPlayers
    && validScores;

  if (!validProgress) {
    console.error('Saved Tic-Tac-Toe progress has an invalid format; starting a new game.');
    return false;
  }

  createBoard(savedBoardSize);
  board = savedProgress.board;
  currentPlayer = savedProgress.currentPlayer;
  gameActive = savedProgress.gameActive;
  roundNumber = savedProgress.roundNumber;
  scores.X = savedProgress.scores.X;
  scores.O = savedProgress.scores.O;
  playerOneInput.value = savedProgress.playerNames.X.slice(0, 20);
  playerTwoInput.value = savedProgress.playerNames.O.slice(0, 20);

  const result = checkWinner();
  const isDraw = board.every((space) => space !== '');
  if ((gameActive && (result || isDraw)) || (!gameActive && !result && !isDraw)) {
    console.error('Saved Tic-Tac-Toe progress is inconsistent; starting a new game.');
    scores.X = 0;
    scores.O = 0;
    playerOneInput.value = 'Player 1';
    playerTwoInput.value = 'Player 2';
    createBoard(3);
    return false;
  }

  cells.forEach((cell, index) => {
    const mark = board[index];
    cell.textContent = mark;
    cell.disabled = !gameActive;
    if (mark) {
      cell.classList.add(mark === 'X' ? 'mark-x' : 'mark-o');
    }
  });

  roundNumberElement.textContent = roundNumber;
  updateScoreboard();
  updateTurnIndicator();

  if (result) {
    result.pattern.forEach((index) => cells[index].classList.add('winning-cell'));
    updateStatus(`Congratulations, ${getPlayerName(result.symbol)}! You win this round!`, result.symbol, 'win');
  } else if (isDraw) {
    updateStatus("It's a draw! Nice game.", '🤝', 'draw');
  } else {
    updateStatus(`${getPlayerName(currentPlayer)}'s turn`);
  }

  return true;
};

const showCelebration = () => {
  const celebration = document.createElement('div');
  celebration.className = 'celebration';
  celebration.setAttribute('aria-hidden', 'true');

  for (let index = 0; index < 28; index += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.setProperty('--x', `${Math.random() * 100}vw`);
    piece.style.setProperty('--delay', `${Math.random() * 0.35}s`);
    celebration.append(piece);
  }

  document.body.append(celebration);
  window.setTimeout(() => celebration.remove(), 2200);
};

const toggleTheme = () => {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  themeToggleButton.textContent = isDarkMode ? 'Light mode' : 'Dark mode';
  themeToggleButton.setAttribute(
    'aria-label',
    isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
  );
  themeToggleButton.setAttribute('aria-pressed', String(isDarkMode));
  localStorage.setItem(themeStorageKey, isDarkMode ? 'dark' : 'light');
};

const handleCellClick = (index) => {
  if (!gameActive || board[index] !== '') {
    return;
  }

  board[index] = currentPlayer;
  cells[index].textContent = currentPlayer;
  cells[index].classList.add(currentPlayer === 'X' ? 'mark-x' : 'mark-o');

  const result = checkWinner();
  if (result) {
    const { symbol, pattern } = result;
    const winnerName = getPlayerName(symbol);
    scores[symbol] += 1;
    gameActive = false;
    cells.forEach((button) => {
      button.disabled = true;
    });
    pattern.forEach((winningIndex) => {
      cells[winningIndex].classList.add('winning-cell');
    });
    updateScoreboard();
    updateTurnIndicator();
    updateStatus(`Congratulations, ${winnerName}! You win this round!`, symbol, 'win');
    saveGameProgress();
    showCelebration();
    return;
  }

  if (board.every((space) => space !== '')) {
    gameActive = false;
    cells.forEach((button) => {
      button.disabled = true;
    });
    updateTurnIndicator();
    updateStatus("It's a draw! Nice game.", '🤝', 'draw');
    saveGameProgress();
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateTurnIndicator();
  updateStatus(`${getPlayerName(currentPlayer)}'s turn`);
  saveGameProgress();
};

restartButton.addEventListener('click', () => resetBoard(true));
boardSizeInput.addEventListener('change', updateBoardSize);
themeToggleButton.addEventListener('click', toggleTheme);

const savedTheme = localStorage.getItem(themeStorageKey);
const isDarkMode = savedTheme === 'dark';
document.body.classList.toggle('dark-mode', isDarkMode);
themeToggleButton.textContent = isDarkMode ? 'Light mode' : 'Dark mode';
themeToggleButton.setAttribute(
  'aria-label',
  isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
);
themeToggleButton.setAttribute('aria-pressed', String(isDarkMode));

playerOneInput.addEventListener('input', () => {
  updateScoreboard();
  if (gameActive && currentPlayer === 'X') {
    updateStatus(`${getPlayerName('X')}'s turn`);
  }
  saveGameProgress();
});

playerTwoInput.addEventListener('input', () => {
  updateScoreboard();
  if (gameActive && currentPlayer === 'O') {
    updateStatus(`${getPlayerName('O')}'s turn`);
  }
  saveGameProgress();
});

if (!restoreGameProgress()) {
  createBoard(3);
  updateScoreboard();
  updateTurnIndicator();
  updateStatus(`${getPlayerName('X')}'s turn — let's play!`, 'X');
  saveGameProgress();
}
