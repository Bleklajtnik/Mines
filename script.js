// const mineSquares = document.querySelectorAll('.mineSquare');
const mineSquaresContainer = document.querySelector('.mineWrapper');
const mineNumber = document.querySelector('#mines');
const gameButton = document.querySelector('.actionBtn');
const gameButtonValue = document.querySelector('.actionBtnValue');
const viewBalance = document.querySelector('.balanceOutput');
const betInput = document.querySelector('#bet');
const cashoutP = document.querySelector('.cashout');
const multiplierOutput = document.querySelector('.multiplier');
const cashoutContainer = document.querySelector('.cashoutContainer');
const winResult = document.querySelector('.winResults');
const winResultMultiplier = document.querySelector('.winResultMultiplier');
const winResultPrize = document.querySelector('.winResultPrize');
const revealedTile = document.querySelectorAll('.fa-solid');
const blockBlocks = document.querySelectorAll('.inputCover');
const cashoutBlock = document.querySelector('.cashoutCover');
let isGameActive = false;
let losingSquares = [];
let balance = 1000.0;
let betValue = parseFloat(betInput.value, 10);
const multiplier = 0.99;
let newMultiplier = 1;
let winCounter = 0;
let winPrize = 0;
let totalTiles = 25;
let totalBombs;
let gameStarted = false;
let balanceChecked;
let mineSquares = [];
const winSound = new Audio('winSound.wav');
const loseSound = new Audio('loseSound.wav');
const createTile = (index) => {
  const tileSquare = document.createElement('div');
  const tileOverlay = document.createElement('div');
  const tileIcon = document.createElement('i');
  tileSquare.classList.add('mineSquare');
  tileOverlay.classList.add('overlay');
  tileIcon.classList.add('fa-solid');
  tileSquare.appendChild(tileOverlay);
  tileSquare.appendChild(tileIcon);
  mineSquaresContainer.prepend(tileSquare);
  return tileSquare;
};
const createBoard = () => {
  for (let i = 0; i < 25; i++) {
    const newTile = createTile(i);
    mineSquares.push(newTile);
  }
};
const createOptions = () => {
  for (let i = 1; i < 25; i++) {
    const option = document.createElement('option');
    option.setAttribute('value', i);
    option.textContent = i;
    mineNumber.appendChild(option);
  }
};
createOptions();
const startGame = () => {
  winCounter = 0;
  gameStarted = true;
  isGameActive = true;
  gameButtonValue.textContent = 'Cashout';
  cashoutContainer.style = 'display: block;';
  toggleBlockInteractions();
  randomizeMines();
  checkBalance(winCounter);
  losingBet();
};

const randomizeMines = () => {
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
const resetSettings = () => {
  isGameActive = false;
  totalTiles = 25;
  winPrize = 0;
  cashoutP.textContent = '';
  gameButtonValue.textContent = 'Bet';
  multiplierOutput.textContent = '1.00';
  cashoutContainer.style = 'display: none;';
};
const endGame = () => {
  mineSquares.forEach((square) => {
    const tileValue = square.children[1];
    const overlay = square.children[0];
    overlay.style = 'animation: overlayAnimation 0.5s ease-out forwards;';
    tileValue.classList.remove('fa-gem', 'fa-bomb', 'unrevealed');
    square.classList.remove('win', 'lose', 'revealed');
  });
  toggleBlockInteractions();
  resetSettings();
  randomizeMines();
};
const revealSquares = () => {
  mineSquares.forEach((square, index) => {
    const tileValue = square.children[1];
    const overlay = square.children[0];
    overlay.style = 'animation: revealAnimation 0.5s ease-out forwards;';
    tileValue.style = 'animation: tileValuePop 0.3s ease-out 0.5s forwards;';
    setTimeout(() => {
      tileValue.style = 'animation:none;';
    }, 1500);
    if (losingSquares.includes(index)) {
      square.classList.add('lose');
      tileValue.classList.add('fa-bomb');
    } else {
      square.classList.add('win');
      tileValue.classList.add('fa-gem');
    }
    if (!square.classList.contains('revealed')) {
      tileValue.classList.add('unrevealed');
    }
  });
};
const losingBet = () => {
  balance -= betValue;
  balance = balance.toFixed(2);
  viewBalance.textContent = balance;
};
const changeBetCheck = () => {
  betValue = parseInt(betInput.value, 10);
};
const winUpdate = (revealedTiles, totalTiles, totalBombs) => {
  newMultiplier = multiplier;
  for (let i = 0; i < revealedTiles; i++) {
    const safeTiles = totalTiles - i - totalBombs;
    newMultiplier *= 1 / (safeTiles / (totalTiles - i));
  }
  winPrize = betValue * newMultiplier;
  winPrize = winPrize.toFixed(2);
  cashoutP.textContent = winPrize;
  multiplierOutput.textContent = newMultiplier.toFixed(2);
};
const cashout = () => {
  balance = Number(balance) + Number(winPrize);
  viewBalance.textContent = balance.toFixed(2);

  endGame();
};

const checkBalance = () => {
  if (betValue > balance) {
    // alert('Nie masz wystarczających środków na koncie');
    return false;
  }
  return true;
};
const toggleWinResultView = () => {
  winResult.style.display = 'flex';
  winResultMultiplier.textContent = newMultiplier.toFixed(2);
  winResultPrize.textContent = winPrize;
  winSound.currentTime = 0;
  winSound.play();
  setTimeout(() => {
    winResult.style.display = 'none';
  }, 1500);
};
const toggleGameBtnValue = () => {
  gameButtonValue.innerHTML = '<i class="fa-solid fa-bomb"></i>';
  cashoutBlock.classList.add('blockInteraction');
  setTimeout(() => {
    cashoutBlock.classList.remove('blockInteraction');
  }, 1500);
};
const handleActionButton = () => {
  if (!isGameActive && checkBalance()) {
    startGame();
  } else if (!checkBalance()) {
    alert('Nie masz wystarczających środków na koncie');
  } else {
    revealSquares();
    toggleWinResultView();
    toggleGameBtnValue();
    setTimeout(cashout, 1500);
  }
};
const toggleBlockInteractions = () => {
  if (gameStarted) {
    blockBlocks.forEach((block) => {
      block.classList.add('blockInteraction');
    });
    betInput.style.color = '#97acbe';
    mineNumber.style.color = '#97acbe';
  } else {
    blockBlocks.forEach((block) => {
      block.classList.remove('blockInteraction');
    });
    betInput.style.color = '#fff';
    mineNumber.style.color = '#fff';
  }
};
const clickingTiles = (square, index) => {
  if (!isGameActive || square.classList.contains('win') || square.classList.contains('lose')) {
    return;
  }
  const tileValue = square.children[1];
  const overlay = square.children[0];
  overlay.style = 'animation: revealAnimation 0.5s ease-out forwards;';
  tileValue.style = 'animation: tileValuePop 0.5s  ease-out 0.5s forwards;';
  if (losingSquares.includes(index)) {
    square.classList.add('revealed');
    tileValue.classList.add('fa-bomb');
    setTimeout(() => {
      loseSound.play();
    }, 300);
    toggleGameBtnValue();
    revealSquares();
    setTimeout(() => {
      endGame();
    }, 1500);
  } else {
    winSound.currentTime = 0;
    setTimeout(() => {
      winSound.play();
    }, 300);

    square.classList.add('win', 'revealed');
    tileValue.classList.add('fa-gem');
    winCounter++;
    winUpdate(winCounter, totalTiles, totalBombs);
  }
};

createBoard();
mineSquares.forEach((square, index) => {
  square.addEventListener('click', () => clickingTiles(square, index));
});
betInput.addEventListener('input', changeBetCheck);
mineNumber.addEventListener('change', endGame);
gameButton.addEventListener('click', handleActionButton);
