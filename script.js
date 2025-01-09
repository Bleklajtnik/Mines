const mineSquares = document.querySelectorAll('.mineSquare');
const mineNumber = document.querySelector('#mines');
const gameButton = document.querySelector('.actionBtn');
const viewBalance = document.querySelector('.balanceOutput');
const betInput = document.querySelector('#bet');
const cashoutP = document.querySelector('.cashout');
const multiplierOutput = document.querySelector('.multiplier');
const cashoutContainer = document.querySelector('.cashoutContainer');
let isGameActive = false;
let losingSquares = [];
let balance = 1000.0;

const multiplier = 0.99;
let winCounter = 0;
let winPrize = 0;
let totalTiles = 25;
let totalBombs;
let tilesRevealed = 0;
let gameStarted = false;

const startGame = () => {
  winCounter = 0;
  gameStarted = true;
  isGameActive = true;
  gameButton.classList.add('btnCashout');
  gameButton.textContent = 'Cashout';
  cashoutContainer.style = 'display: block;';
  initializeGame();
  checkBalance(winCounter);
};

const initializeGame = () => {
  gameStarted = 0;
  totalBombs = mineNumber.value;
  losingSquares = [];
  while (losingSquares.length < totalBombs) {
    const randomIndex = Math.floor(Math.random() * mineSquares.length);
    if (!losingSquares.includes(randomIndex)) {
      losingSquares.push(randomIndex);
    }
  }
};

const resetGame = () => {
  mineSquares.forEach((square) => {
    square.classList.remove('win', 'lose');
  });
  initializeGame();
  isGameActive = false;
  totalTiles = 25;
  winPrize = 0;
  cashoutP.textContent = '';
  gameButton.textContent = 'Bet';
  multiplierOutput.textContent = '1.00';
  cashoutContainer.style = 'display: none;';
};

const revealSquares = () => {
  mineSquares.forEach((square, index) => {
    if (losingSquares.includes(index)) {
      square.classList.add('lose');
    } else {
      square.classList.add('win');
    }
  });
};

const winUpdate = (revealedGems, totalTiles, totalBombs) => {
  const bet = parseInt(betInput.value, 10);
  let newMultiplier = multiplier;
  for (let i = 0; i < revealedGems; i++) {
    const safeTiles = totalTiles - i - totalBombs;
    newMultiplier *= 1 / (safeTiles / (totalTiles - i));
  }
  winPrize = bet * newMultiplier;
  winPrize = winPrize.toFixed(2);
  cashoutP.textContent = winPrize;
  multiplierOutput.textContent = newMultiplier.toFixed(2);
  tilesRevealed = revealedGems;
};
const cashout = () => {
  balance = Number(balance) + Number(winPrize);
  viewBalance.textContent = balance.toFixed(2);

  resetGame();
};
const checkBalance = (winCounter) => {
  const bet = parseInt(betInput.value, 10);
  if (bet > balance) {
    alert('Nie masz wystarczających środków na koncie');
    return false;
  }

  balance -= bet;
  balance = balance.toFixed(2);
  console.log(balance, 'balans');
  viewBalance.textContent = balance;
};

const handleActionButton = () => {
  if (!isGameActive && !checkBalance()) {
    startGame();
  } else if (tilesRevealed === 0) {
    console.log('No tiles revealed, balance remains unchanged.');
    resetGame();
  } else {
    cashout();
  }
};

mineSquares.forEach((square, index) => {
  square.addEventListener('click', () => {
    if (!isGameActive || square.classList.contains('win') || square.classList.contains('lose')) {
      return;
    }
    if (losingSquares.includes(index)) {
      revealSquares();
      setTimeout(() => {
        resetGame();
        gameButton.classList.remove('btnCashout');
        gameButton.textContent = 'Bet';
      }, 1000);
    } else {
      square.classList.add('win');
      winCounter++;
      winUpdate(winCounter, totalTiles, totalBombs);
    }
  });
});

mineNumber.addEventListener('change', resetGame);
gameButton.addEventListener('click', handleActionButton);
