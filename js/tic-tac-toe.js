const classNames = {
    cell: 'cell',
    cellContent: 'cell-content',
    populated: 'populated',
    winner: 'winner'
};

const user = {
    x: 'X',
    o: 'O'
};

const winningCombbinationMatrix = {
    0: [[1, 2], [3, 6], [4, 8]],
    1: [[0, 2], [4, 7]],
    2: [[0, 1], [5, 8], [4, 6]],
    3: [[0, 6], [4, 5]],
    4: [[3, 5], [1, 7], [0, 8], [2, 6]],
    5: [[3, 4], [2, 8]],
    6: [[7, 8], [0, 3], [2, 4]],
    7: [[6, 8], [1, 4]],
    8: [[6, 7], [2, 5], [0, 4]]
};

var xIsNext = true;
let cellValues = ['', '', '', '', '', '', '', '', ''];
let winningPlayer;
let winningCombination = [];
var numberOfTurnsLeft = 9;
var userFormChosen;

const cells = document.querySelectorAll(`.${classNames.cell}`);
const modalOverlay = document.querySelector('#modal-overlay');
const game = document.querySelector('#game');
const board = document.querySelector('#board');
const winnerContainer = document.querySelector('#winner-container');
const winnerDetails = document.querySelector('#winner-container > span');
const newGameButton = document.querySelector('#new-game-button');
const exitGameButton = document.querySelector('#exit-game-button');
const chooses = document.querySelectorAll('.character');
const choosingBox = document.querySelector('#choosing-character');

newGameButton.addEventListener('click', () => startGame());
exitGameButton.addEventListener('click', () => { window.location.replace("https://en.wikipedia.org/wiki/Tic-tac-toe"); })
chooses.forEach((choose, index) => {
    choose.addEventListener('click' , () => {
        userFormChosen = index === 0 ? user.x : index === 1 ? user.o : console.log('there is a problem on choosing form');
        choosingBox.style.opacity = 0;
        choosingBox.style.visibility = "hidden";
        board.style.visibility = "visible";
        xIsNext = userFormChosen === user.x ? true : false;
        startGame();
    })
});


const startGame = () => {
    cellValues = ['', '', '', '', '', '', '', '', ''];
    winningPlayer;
    winningCombination = [];
    numberOfTurnsLeft = 9;
    game.style.opacity = '100%';
    modalOverlay.style.display = 'none';
    winnerContainer.style.opacity = '100%';



    cells.forEach((c, i) => {
        const cellContent = c.querySelector(`.${classNames.cellContent}`);
        cellContent.innerHTML = cellValues[i];
        cellContent.classList.remove(classNames.populated);
        c.classList.remove(classNames.winner);
    });
}


cells.forEach((c, i) => {
    c.addEventListener('click', () => {
        if (!cellValues[i]) {
            cellValues[i] = xIsNext ? user.x : user.o;
            this.xIsNext = !xIsNext
            numberOfTurnsLeft--;
            if (calculateWinner(i)) {
                if (winningPlayer !== 'tie') {
                    highlightWinningCells();
                }
                showModal();
            }

            const cellContent = c.querySelector(`.${classNames.cellContent}`);
            cellContent.innerHTML = cellValues[i];
            cellContent.classList.add(classNames.populated);
        }
    })

});


const calculateWinner = (chosenIndex) => {
    const winningRanges = winningCombbinationMatrix[chosenIndex];
    for (let i = 0; i < winningRanges.length; i++) {
        const currentEntry = cellValues[chosenIndex];
        const firstOption = cellValues[winningRanges[i][0]];
        const secondOption = cellValues[winningRanges[i][1]];

        if (currentEntry === firstOption && currentEntry === secondOption) {
            winningPlayer = currentEntry;
            winningCombination = [chosenIndex, winningRanges[i][0], winningRanges[i][1]];
            return true;
        }
    }
    if (numberOfTurnsLeft === 0) {
        winningPlayer = 'tie';
        return true;
    }
    return false;
};

const showModal = () => {
    winnerDetails.innerHTML = winningPlayer == user.x ? `You Are The Winner!` : winningPlayer === user.o ? `You Lost` : `It Was a Tie`;
    modalOverlay.style.display = 'grid';
    game.style.opacity = '0.3'
};

const highlightWinningCells = () => {
    cells[winningCombination[0]].classList.add(classNames.winner)
    cells[winningCombination[1]].classList.add(classNames.winner)
    cells[winningCombination[2]].classList.add(classNames.winner)
}

