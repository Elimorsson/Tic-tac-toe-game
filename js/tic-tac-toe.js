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

var firstTurn = true;
var cellValues = ['', '', '', '', '', '', '', '', ''];
var winningPlayer;
var winningCombination = [];
var numberOfTurnsLeft = 9;
var userShapeChosen;
var computerShape;
var computerCells = [];

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
const myWindow = window;

newGameButton.addEventListener('click', () => startGame());
exitGameButton.addEventListener('click', () => { window.location.replace("https://en.wikipedia.org/wiki/Tic-tac-toe"); })
chooses.forEach((choose, index) => {
    choose.addEventListener('click', () => {
        userShapeChosen = index === 0 ? user.x : index === 1 ? user.o : console.log('there is a problem on choosing shape');
        computerShape = userShapeChosen === user.x ? user.o : user.x;
        startBoard();
    })
});




const startGame = () => {
    cellValues = ['', '', '', '', '', '', '', '', ''];
    winningPlayer = '';
    winningCombination = [];
    numberOfTurnsLeft = 9;
    firstTurn = true;
    computerCells = [];

    modalOverlay.style.display = 'none';
    winnerContainer.style.opacity = '100%';
    game.style.opacity = '100%';
    board.style.visibility = "hidden";
    choosingBox.style.opacity = '100%';
    choosingBox.style.visibility = "visible";


    cells.forEach((c, i) => {
        const cellContent = c.querySelector(`.${classNames.cellContent}`);
        cellContent.innerHTML = cellValues[i];
        cellContent.classList.remove(classNames.populated);
        c.classList.remove(classNames.winner);
    });

}

window.onload =  function() {
    document.getElementById("new-game-button1").focus;
};

window.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      console.log("entered " + document.activeElement.id);
    }});

const startBoard = () => {
    game.style.opacity = '100%';
    game.style.display = 'grid';
    choosingBox.style.opacity = 0;
    choosingBox.style.visibility = "hidden";
    board.style.visibility = "visible";
    window.document.getElementById("cell4").focus();

}


cells.forEach((c, i) => {
    c.addEventListener('click', () => {
        if (!cellValues[i]) {
            cellValues[i] = userShapeChosen;
            numberOfTurnsLeft--;
            const cellContent = c.querySelector(`.${classNames.cellContent}`);
            cellContent.innerHTML = cellValues[i];
            cellContent.classList.add(classNames.populated);
            if (calculateWinner(i)) {
                if (winningPlayer !== 'tie') {
                    highlightWinningCells();
                }
                showModal();
            }
            else if (numberOfTurnsLeft > 0) {
                setTimeout(computerMove,600);
            }
        }
    });
});


const computerMove = () => {
    var chosen;
    if (firstTurn) {
        var userChoose;
        for (let i = 0; i < 9; i++) {
            if (cellValues[i] != '') {
                userChoose = i;
            }
        }
        chosen = generateFirstCell(userChoose);
        while (chosen === null){
            chosen = generateFirstCell(userChoose);
        }
        firstTurn = false;
    }
    else {
        if (computerCells.length < 2) {
            var toChoose = checkIfUserCouldWin();
            chosen = toChoose ?? chooseTheBestOption();
        }
        else {
            var toChoose = checkIfCpuCouldWin();
            chosen = toChoose ?? checkIfUserCouldWin();
            chosen = chosen ?? chooseTheBestOption();
        }
    }
    cellValues[chosen] = computerShape;
    computerCells.push(chosen);
    numberOfTurnsLeft--;
    if (calculateWinner(chosen)) {
        if (winningPlayer !== 'tie') {
            highlightWinningCells();
        }
        showModal();
    }
    cells.forEach((c, i) => {
        if (i === chosen) {
            const cellContent = c.querySelector(`.${classNames.cellContent}`);
            cellContent.innerHTML = cellValues[chosen];
            cellContent.classList.add(classNames.populated);
        }
    })
}

const generateFirstCell = (userChoose) => {
    var num = Math.floor(Math.random() * 9);
    return num === userChoose ? null : num;
}

const checkIfUserCouldWin = () => {
    for (let i = 0; i < 9; i++) {
        if (!cellValues[i]) {
            var optionalCombinations = winningCombbinationMatrix[i];
            for (let j = 0; j < optionalCombinations.length; j++) {
                const firstValue = cellValues[optionalCombinations[j][0]];
                const secondValue = cellValues[optionalCombinations[j][1]];
                if (firstValue === userShapeChosen && secondValue === userShapeChosen) return i;
            }
        }
    }
    return null;
}

const checkIfCpuCouldWin = () => {
    for (let i = 0; i < computerCells.length; i++) {
        var optionalCombinations = winningCombbinationMatrix[computerCells[i]];
        for (let j = 0; j < optionalCombinations.length; j++) {
            const firstValue = cellValues[optionalCombinations[j][0]];
            const secondValue = cellValues[optionalCombinations[j][1]];
            if (firstValue === computerShape && secondValue === '') return optionalCombinations[j][1];
            if (firstValue === '' && secondValue === computerShape) return optionalCombinations[j][0];
        }
    }
    return null;
}

const chooseTheBestOption = () => {
    for (let i = 0; i < computerCells.length; i++) {
        var optionalCombinations = winningCombbinationMatrix[computerCells[i]];
        for (let j = 0; j < optionalCombinations.length; j++) {
            const firstValue = cellValues[optionalCombinations[j][0]];
            const secondValue = cellValues[optionalCombinations[j][1]];
            if (firstValue === '' && secondValue === '') return optionalCombinations[j][0]
        }
        for (let j = 0; j < cellValues.length; j++) {
            if (!cellValues[j]) return j;
        }
    }
}

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
    winnerDetails.innerHTML = winningPlayer == userShapeChosen ? `You Are The Winner!` : winningPlayer === computerShape ? `You Lost` : `Draw`;
    modalOverlay.style.display = 'grid';
    game.style.opacity = '0.3'
};

const highlightWinningCells = () => {
    cells[winningCombination[0]].classList.add(classNames.winner)
    cells[winningCombination[1]].classList.add(classNames.winner)
    cells[winningCombination[2]].classList.add(classNames.winner)
}

