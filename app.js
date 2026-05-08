const tileDisplay = document.querySelector('.tile-container');
const keyBoard = document.querySelector('.key-container');
const messageDisplay = document.querySelector('.message-container');

// Fixed the typo here:
const MOTHER_MESSAGE = ['HAPPY', 'MOTHERS', 'DAY', 'LOVE', 'YOU', 'BEST', 'MOM', 'EVER'];
let currentLevel = 0;
let wordle = MOTHER_MESSAGE[currentLevel].toUpperCase();
let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

const keys = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<<'
];

// Initialize an empty array for guesses
const guessRows = [[], [], [], [], [], []];

const createGrid = () => {
    tileDisplay.innerHTML = '';
    const wordLength = wordle.length;
    
    for (let i = 0; i < 6; i++) {
        guessRows[i] = new Array(wordLength).fill('');
    }

    guessRows.forEach((guessRow, guessRowIndex) => {
        const rowElem = document.createElement('div');
        rowElem.setAttribute('id', 'guessRow-' + guessRowIndex);
        rowElem.classList.add('tile-row'); 
        
        guessRow.forEach((_, guessIndex) => {
            const tileElem = document.createElement('div');
            tileElem.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex);
            tileElem.classList.add('tile');
            rowElem.append(tileElem);
        });
        tileDisplay.append(rowElem);
    });
};

// Initialize the first grid
createGrid();

keys.forEach(key => {
    const buttonElem = document.createElement('button');
    buttonElem.textContent = key;
    buttonElem.setAttribute('id', key);
    buttonElem.addEventListener('click', () => handleClick(key));
    keyBoard.append(buttonElem);
});

const handleClick = (key) => {
    if (!isGameOver) {
        if (key === '<<') {
            deleteLetter();
            return;
        }
        if (key === 'ENTER') {
            checkRow();
            return;
        }
        addLetter(key);
    }
};

const addLetter = (letter) => {
    if (currentTile < wordle.length && currentRow < 6) {
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
        tile.textContent = letter;
        guessRows[currentRow][currentTile] = letter;
        tile.setAttribute('data', letter);
        currentTile++;
    }
};

const deleteLetter = () => {
    if (currentTile > 0) {
        currentTile--;
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
        tile.textContent = '';
        guessRows[currentRow][currentTile] = '';
        tile.setAttribute('data', '');
    }
};

// Next Level Logic
const nextLevel = () => {
    currentLevel++;
    wordle = MOTHER_MESSAGE[currentLevel].toUpperCase();
    currentRow = 0;
    currentTile = 0;
    createGrid();
    
    // Clear keyboard colors
    keys.forEach(key => {
        const keyBtn = document.getElementById(key);
        if (keyBtn) keyBtn.className = '';
    });
    
    showMessage(`Word ${currentLevel + 1} of ${MOTHER_MESSAGE.length}`);
};

const checkRow = () => {
    const guess = guessRows[currentRow].join('');
    
    if (currentTile === wordle.length) {
        flipTile();
        
        if (guess === wordle) {
            showMessage('Magnificent!');
            if (currentLevel < MOTHER_MESSAGE.length - 1) {
                setTimeout(nextLevel, 3000);
            } else {
                setTimeout(() => {
                    tileDisplay.innerHTML = '';
                    
                    showFinalMessage("Happy Mothers Day Love You Best Mom Ever! ❤️");
                    isGameOver = true;
                }, 3000);
            }
        } else {
            if (currentRow >= 5) {
                isGameOver = true;
                showMessage(`Game Over! The word was ${wordle}`);
            } else {
                currentRow++;
                currentTile = 0;
            }
        }
    }
};

const showMessage = (message) => {
    const messageElem = document.createElement('p');
    messageElem.textContent = message;
    messageDisplay.append(messageElem);
    setTimeout(() => messageDisplay.removeChild(messageElem), 2500);
};

const showFinalMessage = (message) => {
    const messageElem = document.createElement('p');
    messageElem.textContent = message;
    messageDisplay.append(messageElem);
};

const addcolorToKey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter);
    if (key) key.classList.add(color);
};

const flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes;
    let checkWordle = wordle;
    const guess = [];

    rowTiles.forEach(tile => {
        guess.push({ letter: tile.getAttribute('data'), color: 'grey' });
    });

    guess.forEach((g, index) => {
        if (g.letter === wordle[index]) {
            g.color = 'green';
            checkWordle = checkWordle.replace(g.letter, '');
        }
    });

    guess.forEach(g => {
        if (g.color !== 'green' && checkWordle.includes(g.letter)) {
            g.color = 'yellow';
            checkWordle = checkWordle.replace(g.letter, '');
        }
    });

    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip');
            tile.classList.add(guess[index].color);
            addcolorToKey(guess[index].letter, guess[index].color);
        }, 500 * index);
    });
};

document.addEventListener('keydown', (e) => {
    if (isGameOver) return;

    const key = e.key.toUpperCase();

    if (key === 'ENTER') {
        handleClick('ENTER');
    } else if (key === 'BACKSPACE') {
        handleClick('<<');
    } else if (/^[A-Z]$/.test(key)) {
        // This regex ensures it's only a single letter A-Z
        handleClick(key);
    }
});