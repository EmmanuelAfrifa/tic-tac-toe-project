let boxes = document.querySelectorAll('.boxes')
let markers = document.querySelectorAll('.choice-box')
let playerOneMark = '';
let player = 'cross';
let currentMark = 'cross';
let whosTurn = 'whos-turn-cross';
let whosTurnDisplay = document.querySelector('#who');

let playerOneScoreKeeper = document.getElementById('p1-score');
let playerTwoScoreKeeper = document.getElementById('p2-score');
let tiesScoreKeeper = document.getElementById('ties-score');

let homePageDisplay = document.querySelector('#start-container');
let gamePageDisplay = document.querySelector('#second-page');

let VsCPUButton = document.getElementById('new-game-cpu');
let VsPlayerButton = document.getElementById('new-game-player');

let gameResultsDisplay = document.querySelector('.game-results-display');
let winLoseMessage = document.querySelector('#win-lose');
let winnerLogoDisplay = document.querySelector('#win-logo');
let whoWonGame = document.querySelector('#who-won');
let RestartGameDisplay = document.querySelector('.restart-game-section');

let quitButton = document.querySelector('#quit-button');
let nextRoundButton = document.querySelector('#restart-new-game-button');
let restartGameButton = document.querySelector('#restart-button');
let noButton = document.querySelector('#no-button');
let yesButton = document.querySelector('#yes-button');

let circleWinsCounter = 0;
let crossWinsCounter = 0;
let tiesCounter = 0;
let gameMode;

let boardArray = Array.from(Array(9).keys());
let winCombinations = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6] // diagonals
];


// Adding event listeners to the markers
for (let i=0; i<markers.length; i++){
    markers[i].addEventListener('click', getFirstPlayerMarker);
}


// Getting the first players marker choice
function getFirstPlayerMarker(event){
    if (event.target.id === ''){
        if (event.target.children[0].id === 'x-box'){
            playerOneMark = 'cross';
        }
        else {
            playerOneMark = 'circle';
        } 
    }
    else {
        if (event.target.id === 'x-box'){
            playerOneMark = 'cross';
        }
        else {
            playerOneMark = 'circle';
        }
    }

    // Prefilling the score keepers with the appropriate markers
    if (playerOneMark === 'cross'){
        playerOneScoreKeeper.children[0].innerText = 'X';
        playerTwoScoreKeeper.children[0].innerText = 'O';
    }
    else {
        playerOneScoreKeeper.children[0].innerText = 'O';
        playerTwoScoreKeeper.children[0].innerText = 'X';
    }
    
}


// A function that displays the game board and hides the main page
function displayToggler(){
    homePageDisplay.style.display = 'none';
    gamePageDisplay.style.display = 'block';
}

// Adding event listener to the player vs cpu button
VsCPUButton.addEventListener('click', function(event){
    if(playerOneMark === ''){
        alert('Kindly select a marker before proceeding...');
        return;
    }

    if (playerOneScoreKeeper.children[0].innerText === 'X'){
        playerOneScoreKeeper.children[0].innerText += ' (YOU)';
        playerTwoScoreKeeper.children[0].innerText += ' (CPU)';
    }
    else {
        playerOneScoreKeeper.children[0].innerText = 'X (CPU)';
        playerTwoScoreKeeper.children[0].innerText = 'O (YOU)';
    }

    gameMode = 'CPU';

    // Checking the firstplayer's choice and making sure that 'X' always plays first
    displayToggler();
    if (playerOneScoreKeeper.children[0].innerText.slice(2) === '(YOU)'){
        boxClick()
    }
    else {
        setTimeout(computerMove, 50);
    }

})

// Adding event listener to the player vs player button
VsPlayerButton.addEventListener('click', function(event){
    if(playerOneMark === ''){
        alert('Kindly select a marker before proceeding...');
        return;
    }

    if (playerOneMark === 'cross'){
        playerOneScoreKeeper.children[0].innerText += ' (P1)';
        playerTwoScoreKeeper.children[0].innerText += ' (P2)';
    }
    else if (playerOneMark === 'circle') {
        playerOneScoreKeeper.children[0].innerText = 'X (P2)';
        playerTwoScoreKeeper.children[0].innerText = 'O (P1)';
    }

    gameMode = 'HUMANS';

    displayToggler();
    boxClick()
})

// A function that adds event listeners to the boxes
function boxClick(){
    for (let i=0; i<boxes.length; i++){
        boxes[i].addEventListener('click', markersToggler, {once: true});      
    }
}

// A function that displays the appropriate marker on the clicked box and also checks the win status to display
// the right message
function markersToggler(event){
    // Clearing and setting the class name of the event to boxes.
    event.className = 'boxes';

    event.target.classList.add(currentMark);
    boardArray[event.target.id] = currentMark; 
    player = currentMark;  

    currentMark = currentMark === 'cross' ? 'circle' : 'cross';
    whosTurn = whosTurn === 'whos-turn-cross' ? 'whos-turn-circle' : 'whos-turn-cross';
    whosTurnDisplay.className = whosTurn;

    if (gameMode === 'HUMANS'){
        let winStatus = getWinStatus(boardArray, player);
        if (winStatus){
            winStatusUpdates(winStatus);
        }
    }
    else if (gameMode === 'CPU'){
        let winStatus = getWinStatus(boardArray, player);
        if (winStatus){
            winStatusUpdates(winStatus);
        }
        else {
            setTimeout(computerMove, 50)
        }
        
    }
}

// A function that handles the CPU's move
function computerMove(){
    let aiPlayer;
    let huPlayer;

    if (playerOneScoreKeeper.children[0].innerText.slice(2) === "(YOU)") {
        huPlayer = "cross";
        aiPlayer = "circle";
    } else {
        huPlayer = "circle";
        aiPlayer = "cross";
    }

    let bestMove = minimax(boardArray, aiPlayer).index;

    boxes[bestMove].classList.add(currentMark);
    boardArray[bestMove] = currentMark;
    player = currentMark;

    let winStatus = getWinStatus(boardArray, player);
    if (winStatus){
        winStatusUpdates(winStatus);
    }

    

    if (!winStatus){
      
        currentMark = currentMark === 'cross' ? 'circle' : 'cross';
        whosTurn = whosTurn === 'whos-turn-cross' ? 'whos-turn-circle' : 'whos-turn-cross';
        whosTurnDisplay.className = whosTurn;
        boxClick();
    }

}

// Implementation of the minimax algorithm that makes the ai very difficult to beat
function minimax(board, whosGo) {
    let availableSpots = emptyboxes(board);
    let huPlayer;
    let aiPlayer;
  
    if (playerOneScoreKeeper.children[0].innerText.slice(2) === "(YOU)") {
        huPlayer = "cross";
        aiPlayer = "circle";
    } else {
        huPlayer = "circle";
        aiPlayer = "cross";
    }
  
    if (getWinStatus(board, huPlayer)) {
        let ans = getWinStatus(board, huPlayer);
        if (ans.winner === 'draw'){
            return {score : 0};
        }
        else {
            return { score: -1 }; 
        }   
    }   
    else if (getWinStatus(board, aiPlayer)) {
        let ans = getWinStatus(board, aiPlayer);
        if (ans.winner === 'draw'){
            return {score : 0};
        }
        else {
            return { score: 1 }; 
        } 

    } 
 
    let moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
        let newmove = {};
        newmove.index = board[availableSpots[i]];
  
        board[availableSpots[i]] = whosGo;
  
        if (whosGo === huPlayer) {
            let result = minimax(board, aiPlayer);
            newmove.score = result.score;
        } 
        else if (whosGo === aiPlayer) {
            let result = minimax(board, huPlayer);
            newmove.score = result.score;
        }
  
        board[availableSpots[i]] = newmove.index;
  
        moves.push(newmove);
    }
  
    let bestMove;
    if (whosGo === aiPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
            }
        }
    } 
    else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
            }
        }
    }
  
    return moves[bestMove];
}
  
  
// A function that checks the game status (whether there is a win or draw)
function getWinStatus(board, player){
    let playedBoxes = board.reduce((accumulator, currentValue, index) => 
    (currentValue === player) ? accumulator.concat(index) : accumulator, []);

    let gameWinObject = null;
    for (let [index, winCombo] of winCombinations.entries()){
        if (winCombo.every((cell) => playedBoxes.indexOf(cell) > -1)){
            gameWinObject = {index: winCombo, winner: player};
            break;
        }
    }

    //Checking for draw
    if (isDraw() && (!gameWinObject)){
        gameWinObject = {winner: 'draw'};
    }
    return gameWinObject;
}

// A function that returns an array of all the boxes on the board that are empty
function emptyboxes(board){
    return board.filter((element) => typeof element === 'number');
}

// A function that determines if the game is a draw
function isDraw(){
    let emptyBoxes = emptyboxes(boardArray);
    if (emptyBoxes.length === 0){
        return true;
    }
}

// A function that displays the appropriate message depending on the game status (win or draw) and also who won.
function winStatusUpdates(winStatus){
    if (winStatus.winner === 'cross'){
        crossWinsCounter++;
        if (playerOneScoreKeeper.children[0].innerText[0] === 'X'){
            playerOneScoreKeeper.children[1].innerText = crossWinsCounter;
            winLoseMessage.innerText = 'PLAYER 1 WINS!';

            if (gameMode === 'CPU'){
                winLoseMessage.innerText = 'YOU WON!';
            }
        }
        else {
            playerTwoScoreKeeper.children[1].innerText = crossWinsCounter;
            winLoseMessage.innerText = 'PLAYER 2 WINS!';
            
            if (gameMode === 'CPU'){
                winLoseMessage.innerText = 'OH NO, YOU LOST!';
            }
        }
        whoWonGame.style.color = '#31C3BD';
        gameResultsDisplay.style.display = 'flex';

        let [a,b,c] = winStatus.index;
        let crosses = document.querySelectorAll('.cross')
        for (let j=0; j<crosses.length; j++){
            if (crosses[j].id == a || crosses[j].id == b || crosses[j].id == c){
                crosses[j].style.setProperty('--changeCrossAfter', '#1F3641')
            }
        }

        for (let i=0; i<winStatus.index.length; i++){
            boxes[winStatus.index[i]].style.backgroundColor = '#31C3BD';
        }


        let winnerMarkElement = document.querySelector('.winner-mark');
    
        if (winnerMarkElement.classList.contains('o-winner-logo') || winnerMarkElement.className === 'winner-mark') {
            winnerMarkElement.classList.remove('o-winner-logo');
            winnerMarkElement.classList.add('x-winner-logo');
        }
    
        winnerMarkElement.style.display = 'block';      
    }
    else if (winStatus.winner === 'circle'){
        circleWinsCounter++;
        if (playerOneScoreKeeper.children[0].innerText[0] === 'O'){
            playerOneScoreKeeper.children[1].innerText = circleWinsCounter;
            winLoseMessage.innerText = 'PLAYER 1 WINS!';

            if (gameMode === 'CPU'){
                winLoseMessage.innerText = 'YOU WON!';
            }
        }
        else {
            playerTwoScoreKeeper.children[1].innerText = circleWinsCounter;
            winLoseMessage.innerText = 'PLAYER 2 WINS!';

            if (gameMode === 'CPU'){
                winLoseMessage.innerText = 'OH NO, YOU LOST!';
            }
        }
        whoWonGame.style.color = '#F2B137';
        gameResultsDisplay.style.display = 'flex';
        let [a,b,c] = winStatus.index;
        let circles = document.querySelectorAll('.circle')
        for (let j=0; j<circles.length; j++){
            if (circles[j].id == a || circles[j].id == b || circles[j].id == c){
                circles[j].style.setProperty('--changeCircleAfter', '#1F3641')
            }
        }

        for (let i=0; i<winStatus.index.length; i++){
            boxes[winStatus.index[i]].style.backgroundColor = '#F2B137';
        }

        let winnerMarkElement = document.querySelector('.winner-mark');
    
        if (winnerMarkElement.classList.contains('x-winner-logo') || winnerMarkElement.className === 'winner-mark') {
            winnerMarkElement.classList.remove('x-winner-logo');
            winnerMarkElement.classList.add('o-winner-logo');
        }
    
        winnerMarkElement.style.display = 'block';;
    }
    else if (winStatus.winner === 'draw'){
        tiesCounter++;
        tiesScoreKeeper.children[1].innerText = tiesCounter;
        gameResultsDisplay.style.display = 'flex';
        whoWonGame.style.color = '#A8BFC9';
        winnerLogoDisplay.className = 'winner-mark';
        whoWonGame.innerHTML = `<div class="winner-mark" id="win-logo"></div>ROUND TIED`;
        winLoseMessage.hidden = true;
    }
}

// Adding an event listener to the quit button
quitButton.addEventListener('click', quit);

// Reseting all changes made to their default state
function quit(){
    let circles = document.querySelectorAll('.circle')
    for (let j=0; j<circles.length; j++){
        circles[j].style.setProperty('--changeCircleAfter', '#F2B137')
    }

    let crosses = document.querySelectorAll('.cross')
    for (let j=0; j<crosses.length; j++){
        crosses[j].style.setProperty('--changeCrossAfter', '#31C3BD')
    }

    for (let i=0; i<boxes.length; i++){
        boxes[i].className = 'boxes';
        boxes[i].style.backgroundColor = '#1F3641'
        boxes[i].removeEventListener('click', markersToggler)
    }

    circleWinsCounter = 0;
    crossWinsCounter = 0;
    tiesCounter = 0;
    playerOneMark = '';    

    playerOneScoreKeeper.children[1].innerText = 0;
    playerTwoScoreKeeper.children[1].innerText = 0;
    tiesScoreKeeper.children[1].innerText = 0;

    if (playerOneScoreKeeper.children[0].innerText[0] === 'O'){
        playerOneScoreKeeper.children[0].innerText = 'O'
        playerTwoScoreKeeper.children[0].innerText = 'X'
    }
    else if (playerOneScoreKeeper.children[0].innerText[0] === 'X'){
        playerOneScoreKeeper.children[0].innerText = 'X'
        playerTwoScoreKeeper.children[0].innerText = 'O'
    }

    boardArray = Array.from(Array(9).keys());
    player = 'cross';
    currentMark = 'cross';
    whosTurn = 'whos-turn-cross';
    whosTurnDisplay.className = whosTurn;

    winLoseMessage.hidden = false;  
    whoWonGame.innerHTML = `<div class="winner-mark" id="win-logo"></div>TAKES THE ROUND`;

    // Toggling the display states for the various displays 
    gameResultsDisplay.style.display = 'none';
    homePageDisplay.style.display = 'flex';
    gamePageDisplay.style.display = 'none';
  
}

// Adding an event handler to the nextRoundButton
nextRoundButton.addEventListener('click', nextRound);

// A function that clears the gameboard but keeps the scores
function nextRound(){
    let circles = document.querySelectorAll('.circle')
    for (let j=0; j<circles.length; j++){
        circles[j].style.setProperty('--changeCircleAfter', '#F2B137')
    }

    let crosses = document.querySelectorAll('.cross')
    for (let j=0; j<crosses.length; j++){
        crosses[j].style.setProperty('--changeCrossAfter', '#31C3BD')
    }

    for (let i=0; i<boxes.length; i++){
        boxes[i].className = 'boxes';
        boxes[i].style.backgroundColor = '#1F3641';
        boxes[i].removeEventListener('click', markersToggler)
    }

    boardArray = Array.from(Array(9).keys());
    player = 'cross';
    currentMark = 'cross';
    whosTurn = 'whos-turn-cross';
    whosTurnDisplay.className = whosTurn;

    winLoseMessage.hidden = false;
    whoWonGame.innerHTML = `<div class="winner-mark" id="win-logo"></div>TAKES THE ROUND`;

    gameResultsDisplay.style.display = 'none';
    gamePageDisplay.style.display = 'flex';
    
    if (gameMode === 'CPU'){
        if (playerOneScoreKeeper.children[0].innerText.slice(2) === '(YOU)'){
            boxClick()
        }
        else {
            setTimeout(computerMove, 50);
        }
    }
    else if (gameMode === HUMANS){
        boxClick()
    }
}

// Adding an event listener to the restartGameButton.
restartGameButton.addEventListener('click', restartGame);

// This it displays a popup when called
function restartGame(){
    RestartGameDisplay.style.display = 'flex';
}

// Adding an event listener to the no button
noButton.addEventListener('click', nocancelGame)

// It hides the popup which was displayed when the restartGame function is called
function nocancelGame(){
    RestartGameDisplay.style.display = 'none';
}

// Adding an event listener to the yes Button
yesButton.addEventListener('click', yesCancelGame)

// It restarts the current round.
function yesCancelGame(){
    nextRound();
    RestartGameDisplay.style.display = 'none';
}
