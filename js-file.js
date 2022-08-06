// ***************************
// VARIABLE DECLARATIONS
// ***************************

let grid = document.querySelector('.grid');
let smallBoxes = document.getElementsByClassName("small-box");
let startButton = document.querySelector('.start');
let buttons = document.getElementsByClassName('button');
let score = document.querySelector('.scoreboard');
let reset = document.querySelector('.reset');
let difficulty = document.querySelector('.difficulty');
let easy = document.querySelector('.easy');
let medium = document.querySelector('.medium');
let impossible = document.querySelector('.impossible');
let aiFirst = document.querySelector('.ai-first');
let counter = 0;
let xWins = 0;
let oWins = 0;
let isAIFirst = false;
let board = [['', '', ''], ['', '', ''], ['', '', '']];
let turn = 'X';


// ***************************
// ARTIFICIAL INTELLIGENCE
// ***************************

function startAIGame(ai, human) {

}

aiFirst.addEventListener('click', () => {
    aiFirst.classList.toggle('navy');
    aiFirst.classList.toggle('orange');
    isAIFirst = !isAIFirst;
});

easy.addEventListener('click', () => {
    buttons[3].classList.add('orange');
    buttons[3].classList.remove('navy');
    startGame(3); resetScore();
    changeDiffBtn('EASY');
    board = [['', '', ''], ['', '', ''], ['', '', '']];
    let dummy = new node(9, board, 0, 0, 'X', -1);
    console.log(dummy);
});
medium.addEventListener('click', () => {
    buttons[3].classList.add('orange');
    buttons[3].classList.remove('navy');
    startGame(3); resetScore();
    changeDiffBtn('MEDIUM');
    board = [['', '', ''], ['', '', ''], ['', '', '']];
    let dummy = new node(9, board, 0, 0, 'X', -1);
    console.log(dummy);
});
impossible.addEventListener('click', () => {
    buttons[3].classList.add('orange');
    buttons[3].classList.remove('navy');
    resetScore(); startAIGame();
    changeDiffBtn('IMPOSSIBLE');
    board = [['', '', ''], ['', '', ''], ['', '', '']];
    let dummy = new node(9, board, 0, 0, 'X', -1);
    let human = new node(9, board, 0, 0, 'X', -1);
    console.log(dummy);
    
});
function changeDiffBtn(level) {
    difficulty.textContent = level;
}

function minimax(position, maximizingPlayer) {
    if (position.isX) {
        return 1;
    } 
    if (position.isO) {
        return -1;
    }
    if (position.isDraw) {
        return 0;
    }
    if (maximizingPlayer) {
        let maxEval = -100;
        for (let i = 0; i < position.children.length; i++) {
            let currEval = minimax(position.children[i], false);
            maxEval = Math.max(maxEval, currEval);
        }
        position.minimax = maxEval;
    } else {
        let minEval = 100;
        for (let i = 0; i < position.children.length; i++) {
            let currEval = minimax(position.children[i], true);
            minEval = Math.min(minEval, currEval);
        }
        position.minimax = minEval;
    }
    return position.minimax;
}

function node(options, board, row, col, turn, id) {
    this.xWins = 0; this.oWins = 0; this.draw = 0;
    this.row = row; this.col = col;
    this.isX = false; this.isO = false; this.isDraw = false;
    this.options = options; this.board = board;
    this.id = id;
    this.children = [];
    this.turn = getTurn(turn);
    this.minimax = 0;
    if (this.id == -1) {
        getChildren(this);
        minimax(this,true);
    } else {
        evaluate(this);
    }
}

function getChildren(parent) {
    if (parent.isX || parent.isO || parent.isDraw) {
        return;
    }
    let index = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (parent.board[i][j] === '') {
                let child = new node(parent.options - 1, copyBoard(parent.board), i, j, parent.turn, i * 3 + j);
                getChildren(child);
                parent.children[index] = child;
                updateParent(parent, child);
                index++;
            }
        }
    }
}

function evaluate(node) {
    node.board[node.row][node.col] = node.turn;
    if (node.options < 5 && (checkCol(node.id, node.board) || 
                             checkRow(node.id, node.board) || 
                             checkDiag(node.id, node.board))) {
        if (node.turn === 'X') {
            node.isX = true;
            node.xWins++;
        } else {
            node.isO = true;
            node.oWins++;
        } 
    } else if (node.options === 0) {
        node.isDraw = true;
        node.draw += 1;
    }
}

function getTurn(turn) {
    if (turn === 'X') {
        return 'O';
    }
    return 'X';
}

function updateParent(parent, child) {
    parent.xWins += child.xWins;
    parent.oWins += child.oWins;
    parent.draw += child.draw;
}

function copyBoard(board) {
    let copy = [['','',''],['','',''],['','','']];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            copy[i][j] = board[i][j];
        }
    }
    return copy;
}

// ***************************
// INITIAL GRID SETUP
// ***************************

makeGrid();
startGame(0);
startButton.addEventListener('click', () => {
    startGame(0);
});

function makeGrid() { 
    resetScore();
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

function startGame(index) {
    endGame();
    buttons[index].classList.add('orange');
    buttons[index].classList.remove('navy');
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
    score.firstElementChild.innerHTML = "PLAYER X: " + xWins;
    score.lastElementChild.innerHTML = "PLAYER O: " + oWins;
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
        buttons[i].classList.add('navy');
    }
    buttons[3].textContent = "DIFFICULTY";
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
    return counter > 4 && (checkRow(num, board) || checkCol(num, board) || checkDiag(num, board));
}

function checkRow(num, board) {
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
function checkCol(num, board) {
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
function checkDiag(num, board) {
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


function resetScore() {
    xWins = 0;
    oWins = 0;
    score.firstElementChild.innerHTML = "Player X: " + xWins;
    score.lastElementChild.innerHTML = "Player O: " + oWins;
}
reset.addEventListener('click', () => {
    resetScore();
});





