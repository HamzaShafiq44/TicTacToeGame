const cells = document.querySelectorAll('.cell');
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

const winningPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

let currentPlayer = 'X';
let board = Array(9).fill('');
let gameActive = true;
let roundNumber = 1;
const scores = { X: 0, O: 0 };

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

const resetBoard = () => {
  board = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;
  roundNumber += 1;
  roundNumberElement.textContent = roundNumber;

  cells.forEach((cell) => {
    cell.textContent = '';
    cell.disabled = false;
    cell.classList.remove('mark-x', 'mark-o', 'winning-cell');
  });

  document.querySelectorAll('.celebration').forEach((celebration) => celebration.remove());
  updateScoreboard();
  updateTurnIndicator();
  updateStatus(`Round ${roundNumber} — ${getPlayerName('X')} goes first!`, 'X');
};

const updateTurnIndicator = () => {
  document.querySelector('.score-x').classList.toggle('active', gameActive && currentPlayer === 'X');
  document.querySelector('.score-o').classList.toggle('active', gameActive && currentPlayer === 'O');
};

const checkWinner = () => {
  for (const pattern of winningPatterns) {
    const [a, b, c] = pattern;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { symbol: board[a], pattern };
    }
  }

  return null;
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

cells.forEach((cell) => {
  cell.addEventListener('click', () => {
    if (!gameActive) {
      return;
    }

    const index = Number(cell.dataset.index);

    if (board[index] !== '') {
      return;
    }

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer === 'X' ? 'mark-x' : 'mark-o');

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
      showCelebration();
      return;
    }

    if (board.every((space) => space !== '')) {
      gameActive = false;
      cells.forEach((button) => {
        button.disabled = true;
      });
      updateTurnIndicator();
      updateStatus("It's a draw! Nice game.", '', 'draw');
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnIndicator();
    updateStatus(`${getPlayerName(currentPlayer)}'s turn`);
  });
});

restartButton.addEventListener('click', resetBoard);
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
});

playerTwoInput.addEventListener('input', () => {
  updateScoreboard();
  if (gameActive && currentPlayer === 'O') {
    updateStatus(`${getPlayerName('O')}'s turn`);
  }
});

updateScoreboard();
updateTurnIndicator();
updateStatus(`${getPlayerName('X')}'s turn — let's play!`, 'X');
