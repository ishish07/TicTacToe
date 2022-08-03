// ***************************
// VARIABLE DECLARATIONS
// ***************************

let grid = document.querySelector('.grid');
let smallBoxes = document.getElementsByClassName("small-box");
let startButton = document.querySelector('.start');
let buttons = document.getElementsByClassName('button');
let score = document.querySelector('.scoreboard');
let reset = document.querySelector('.reset');
let counter = 0;
let xWins = 0;
let oWins = 0;

let board = [['', '', ''], ['', '', ''], ['', '', '']];
let turn = 'X';


// ***************************
// INITIAL GRID SETUP
// ***************************

makeGrid();
startButton.addEventListener('click', startGame);

function makeGrid() { 
    let counter = 0;
    for (let row = 0; row < 3; row++) {
        let rowDiv = document.createElement('div');
        rowDiv.classList.add('row');
        grid.appendChild(rowDiv);
        for (let col = 0; col < 3; col++) {
            let smallBox = document.createElement('div');
            let spanItem = document.createElement('span');
            spanItem.classList.add('spanItem');
            smallBox.appendChild(spanItem);
            smallBox.classList.add('small-box');
            smallBox.setAttribute('id', counter);
            rowDiv.appendChild(smallBox);
            counter++;
        }
    }
}

// ***************************
// STARTING AND ENDING GAME
// ***************************

function startGame() {
    endGame();
    buttons[0].style.backgroundColor = "#DD6B4D";
    for (let j = 0; j < smallBoxes.length; j++) {
        smallBoxes[j].addEventListener('mouseup', fillIn);
        smallBoxes[j].firstElementChild.classList.remove('blink_me_winner');
        smallBoxes[j].firstElementChild.classList.remove('blink_me_draw');
        smallBoxes[j].firstElementChild.textContent = "";
    } 
}

function draw() {
    for (let i = 0; i < 9; i++) {
        smallBoxes[i].firstElementChild.classList.add('blink_me_draw');
    }
}

function endGame() {
    score.firstElementChild.innerHTML = "Player X: " + xWins;
    score.lastElementChild.innerHTML = "Player O: " + oWins;
   // score.innerHTML = "Player X: " + xWins + "     " + "Player O: " + oWins;
    for (let j = 0; j < smallBoxes.length; j++) {
        smallBoxes[j].removeEventListener('mouseup', fillIn);
        if (j < 3) {
            board[0][j] = '';
        } else if (j < 6) {
            board[1][j % 3] = '';
        } else {
            board[2][j % 6] = '';
        }
    }
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.backgroundColor = "#183661"
    }
    counter = 0;
    turn = 'X';
}

// ***************************
// DURING THE GAME
// ***************************

function fillIn(e) {
    counter++;
    let num = parseInt(e.target.getAttribute('id'));
    if (num < 3) {
        board[0][num] = turn;
    } else if (num < 6) {
        board[1][num - 3] = turn;
    } else {
        board[2][num - 6] = turn;
    }
    smallBoxes[num].firstElementChild.textContent = turn;
    smallBoxes[num].removeEventListener('mouseup', fillIn);
    if (turn === 'X') {
        turn = 'O';
    } else {
        turn = 'X';
    }
    if (checkWinner(e)) {
        if (e.target.firstElementChild.textContent === 'X') {
            xWins++;
        } else {
            oWins++;
        }
        endGame();
    } else if (counter === 9) {
        draw();
        endGame();
    }
}

// ***************************
// WIN CHECKING
// ***************************

function checkWinner(e) {
    let num = parseInt(e.target.getAttribute('id'));
    return counter > 4 && (checkRow(num) || checkCol(num) || checkDiag(num));
}

function checkRow(num) {
    if (board[0][0] === board[0][1] && board[0][1] === board[0][2] && board[0][0] !== '') {
        blink(0); blink(1); blink(2);
        return true;
    } else if (board[1][0] === board[1][1] && board[1][1] === board[1][2] && board[1][0] !== '') {
        blink(3); blink(4); blink(5);
        return true;
    } else if (board[2][0] === board[2][1] && board[2][1] === board[2][2] && board[2][0] !== '') {
        blink(6); blink(7); blink(8);
        return true;
    }
    return false;
}
function checkCol(num) {
    if (board[0][0] === board[1][0] && board[1][0] === board[2][0] && board[0][0] !== '') {
        blink(0); blink(3); blink(6);
        return true;
    } else if (board[0][1] === board[1][1] && board[1][1] === board[2][1] && board[0][1] !== '') {
        blink(1); blink(4); blink(7);
        return true;
    } else if (board[0][2] === board[1][2] && board[1][2] === board[2][2] && board[0][2] !== '') {
        blink(2); blink(5); blink(8);
        return true;
    }
    return false;
}
function checkDiag(num) {
    if (num % 2 === 0) {
        if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== '') {
            blink(0); blink(4); blink(8);
            return true;
        } else if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== '') {
            blink(2); blink(4); blink(6);
            return true;
        }
    }
    return false;
}

function blink(num) {
    smallBoxes[num].firstElementChild.classList.add('blink_me_winner');
}

reset.addEventListener('click', resetScore);
function resetScore() {
    xWins = 0;
    oWins = 0;
    score.firstElementChild.innerHTML = "Player X: " + xWins;
    score.lastElementChild.innerHTML = "Player O: " + oWins;
}