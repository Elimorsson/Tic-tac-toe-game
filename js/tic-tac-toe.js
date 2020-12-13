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
var cpuTurn = false;

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
const xOption = document.querySelector('#player-choice-1');
const yOption = document.querySelector('#player-choice-2');


window.onload = function () {
    newGameButton.focus();
};

newGameButton.addEventListener('click', (event) => {
    loadAds(event);
    startGame();
});
exitGameButton.addEventListener('click', () => { window.location.replace("https://en.wikipedia.org/wiki/Tic-tac-toe"); })
chooses.forEach((choose, index) => {
    choose.addEventListener('click', () => {
        shapeChoosen(index);
    })
});


xOption.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        shapeChoosen(0);
    }
});
yOption.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        shapeChoosen(1);
    }
});


document.addEventListener('keyup', (e) => {
    if (e.code === "ArrowRight") {
        if (document.activeElement.id === newGameButton.id) {
            exitGameButton.focus();
        }
        if (document.activeElement.id === xOption.id) {
            yOption.focus();
        }
        if (document.activeElement.id === cells[0].id ||
            document.activeElement.id === cells[1].id ||
            document.activeElement.id === cells[3].id ||
            document.activeElement.id === cells[4].id ||
            document.activeElement.id === cells[6].id ||
            document.activeElement.id === cells[7].id) {
            cells[parseInt(document.activeElement.id.split("").pop()) + 1].focus();
        }
    }
    if (e.code === "ArrowLeft") {
        if (document.activeElement.id === exitGameButton.id) {
            newGameButton.focus();
        }
        if (document.activeElement.id === yOption.id) {
            xOption.focus();
        }
        if (document.activeElement.id === cells[1].id ||
            document.activeElement.id === cells[2].id ||
            document.activeElement.id === cells[4].id ||
            document.activeElement.id === cells[5].id ||
            document.activeElement.id === cells[7].id ||
            document.activeElement.id === cells[8].id) {
            cells[parseInt(document.activeElement.id.split("").pop()) - 1].focus();
        }
    }
    if (e.code === "ArrowUp") {
        if (document.activeElement.id === cells[3].id ||
            document.activeElement.id === cells[4].id ||
            document.activeElement.id === cells[5].id ||
            document.activeElement.id === cells[6].id ||
            document.activeElement.id === cells[7].id ||
            document.activeElement.id === cells[8].id) {
            cells[parseInt(document.activeElement.id.split("").pop()) - 3].focus();
        }
    }
    if (e.code === "ArrowDown") {
        if (document.activeElement.id === cells[0].id ||
            document.activeElement.id === cells[1].id ||
            document.activeElement.id === cells[2].id ||
            document.activeElement.id === cells[3].id ||
            document.activeElement.id === cells[4].id ||
            document.activeElement.id === cells[5].id) {
            cells[parseInt(document.activeElement.id.split("").pop()) + 3].focus();
        }
    }
})


window.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        // console.log(document.activeElement.id + " entered ");
    }
});



const startGame = () => {
    modalOverlay.style.display = 'none';
    game.style.opacity = '100%';
    board.style.visibility = "hidden";
    choosingBox.style.opacity = 0;
    choosingBox.style.visibility = "hidden";
    setTimeout(() => {
        cellValues = ['', '', '', '', '', '', '', '', ''];
        winningPlayer = '';
        winningCombination = [];
        numberOfTurnsLeft = 9;
        firstTurn = true;
        computerCells = [];
        cpuTurn = false;
        cells.forEach((c, i) => {
            const cellContent = c.querySelector(`.${classNames.cellContent}`);
            cellContent.innerHTML = cellValues[i];
            cellContent.classList.remove(classNames.populated);
            c.classList.remove(classNames.winner);
        });
        adContainer.style.width = '30%';
        adContainer.style.height = '12%';
        winnerContainer.style.opacity = '100%';
        choosingBox.style.opacity = '100%';
        choosingBox.style.visibility = "visible";
        xOption.focus();
    }, 10500);


}


const shapeChoosen = (index) => {
    userShapeChosen = index === 0 ? user.x : index === 1 ? user.o : console.log('there is a problem on choosing shape');
    computerShape = userShapeChosen === user.x ? user.o : user.x;
    startBoard();
}

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
        if (cpuTurn) return;
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
                setTimeout(computerMove, 800);
            }
            cpuTurn = true;
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
        while (chosen === null) {
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
    cpuTurn = false;
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
    game.style.opacity = '0.3';
    newGameButton.focus();
    initializeIMA();
};

const highlightWinningCells = () => {
    cells[winningCombination[0]].classList.add(classNames.winner)
    cells[winningCombination[1]].classList.add(classNames.winner)
    cells[winningCombination[2]].classList.add(classNames.winner)
}



// ------------------------------advertisment area---------------------------------
var gameElement;
var adsLoaded = false;
var adContainer;
var adDisplayContainer;
var adsLoader;
var adsManager;


// On window load, attach an event to the play button click
// that triggers playback on the video element
window.addEventListener('load', function (event) {
    gameElement = document.getElementById('game');

    initializeIMA();
});
window.addEventListener('resize', function (event) {
    console.log("window resized");
    if (adsManager) {
        var width = gameElement.width;
        var height = gameElement.height;
        adsManager.resize(width, height, google.ima.ViewMode.NORMAL);
    }
});

function initializeIMA() {
    console.log("initializing IMA");
    adContainer = document.getElementById('ad-container');
    adDisplayContainer = new google.ima.AdDisplayContainer(adContainer, gameElement);
    adsLoader = new google.ima.AdsLoader(adDisplayContainer)
    adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onAdsManagerLoaded,
        false);
    adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError,
        false);
    adContainer.style.width = '100%';
    adContainer.style.height = '100%';

    var adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
        'sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&' +
        'impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&' +
        'cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=';

    // Specify the linear and nonlinear slot sizes. This helps the SDK to
    // select the correct creative if multiple are returned.

    adsRequest.linearAdSlotWidth = window.width;
    adsRequest.linearAdSlotHeight = window.height;
    adsRequest.nonLinearAdSlotWidth = window.width;
    adsRequest.nonLinearAdSlotHeight = window.height;


    // Pass the request to the adsLoader to request ads
    adsLoader.requestAds(adsRequest);
}

function onContentPauseRequested() {
    contentElement.removeEventListener('ended', contentEndedListener);
}
function loadAds(event) {
    // Prevent this function from running on if there are already ads loaded
    if (adsLoaded) {
        return;
    }
    adsLoaded = true;

    // Prevent triggering immediate playback when ads are loading
    event.preventDefault();

    console.log("loading ads");
    // // Initialize the container. Must be done via a user action on mobile devices.
    adDisplayContainer.initialize();

    var width = window.width;
    var height = window.height;
    try {
        adsManager.init(width, height, google.ima.ViewMode.NORMAL);
        if (this.adsManager) {
            this.adsManager.resize(-1, -1, google.ima.ViewMode.FULLSCREEN);
        }
        adsManager.start();
    } catch (adError) {
        // Play the video without ads, if an error occurs
        console.log("AdsManager could not be started " + adError);
    }
    adsLoaded = false;
}
function onAdsManagerLoaded(adsManagerLoadedEvent) {
    // Instantiate the AdsManager from the adsLoader response and pass it the video element
    adsManager = adsManagerLoadedEvent.getAdsManager(
        gameElement);
    adsManager.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError);
}

function onAdError(adErrorEvent) {
    // Handle the error logging.
    console.log(adErrorEvent.getError());
    if (adsManager) {
        adsManager.destroy();
    }
}