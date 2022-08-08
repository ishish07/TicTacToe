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
let mm = -1;
let board = [['', '', ''], ['', '', ''], ['', '', '']];
let turn = 'X';

// ***************************
// INITIAL GRID SETUP
// ***************************
makeGrid();
let ai = new node(9, board, 0, 0, 'X', -1);
let topNodeAI = new node(9, board, 0, 0, 'X', -1);
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
// ARTIFICIAL INTELLIGENCE
// ***************************

function startAIGame(ai) {
    if (ai.isTurn) {
        aiFirst.removeEventListener('click', first);
        disableBoard();
        let move = findBestMove(mm);
        makeMove(move);
        enableBoard();
        ai.isTurn = false;
    } else {
        enableBoard();
    }
    /*while (true) {
        if (ai.isTurn) { //if it is the AI's turn, make a move 
            disableBoard();
            makeMove(ai, ai.children[0]);
            ai.isTurn = false;
            enableBoard();
        } else if (ai.isX || ai.isO || ai.isDraw) {
            break;
        }
    }*/
}

function endAIGame() {
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
    buttons[3].textContent = "DIFFICULTY";
    counter = 0;
    turn = 'X';
    isAIFirst = false;
    ai = topNodeAI;
    mm = -1;
    aiFirst.removeEventListener('click', first);
    buttons[4].classList.remove('orange');
}

function makeMove(childNode) {
    board[childNode.row][childNode.col] = turn;
    smallBoxes[childNode.row * 3 + childNode.col].firstElementChild.textContent = turn;
    ai = childNode;
    turn = getTurn(turn);
    counter++;
    console.log(ai);
    if (checkCol(board) || checkRow(board) || checkDiag(board)) {
        disableBoard();
        endAIGame();
        buttons[4].classList.remove('orange');
        return;
    } else if (ai.options === 0) {
        draw();
        disableBoard();
        endAIGame();
        buttons[4].classList.remove('orange');
        return;
    }
}

function find1(child) {
    return child.minimax === 1;
}
function findneg1(child) {
    return child.minimax === -1;
}
function highestMM(arr) {
    let max = -1000;
    let toReturn = [];
    let index = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].minimaxSum > max) {
            max = arr[i].minimaxSum;
        }
    }
    for (let j = 0; j < arr.length; j++) {
        if (arr[j].minimaxSum === max) {
            toReturn[index] = arr[j];
            index++;
        }
    }
    return toReturn;
}
function lowestMM(arr) {
    let min = 300000;
    let toReturn = [];
    let index = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].minimaxSum < min) {
            min = arr[i].minimaxSum;
        }
    }
    for (let j = 0; j < arr.length; j++) {
        if (arr[j].minimaxSum === min) {
            toReturn[index] = arr[j];
            index++;
        }
    }
    return toReturn;
}
function highestMinus(arr) {
    let max = -1000;
    let toReturn = [];
    let index = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].xMinuso > max) {
            max = arr[i].xMinuso;
        }
    }
    for (let j = 0; j < arr.length; j++) {
        if (arr[j].xMinuso === max) {
            toReturn[index] = arr[j];
            index++;
        }
    }
    return toReturn;
}
function lowestMinus(arr) {
    let min = 300000;
    let toReturn = [];
    let index = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].xMinuso < min) {
            min = arr[i].xMinuso;
        }
    }
    for (let j = 0; j < arr.length; j++) {
        if (arr[j].xMinuso === min) {
            toReturn[index] = arr[j];
            index++;
        }
    }
    return toReturn;
}
function zero(child) {
    if (child.minimax === 0) {
        return child;
    }
}
function findBestMove() {
    if (mm === 1) { // ai is player 1 (X)
        if (ai.minimax === 1) { // create filtered array of children that have minimax of 1 and randomly pick one of them
            let possibleMoves = ai.children.filter(find1);
            let randomIndex = Math.floor(Math.random() * possibleMoves.length);
            return possibleMoves[randomIndex];
        } else if (ai.minimax === -1) { // randomly pick move
            let randomIndex = Math.floor(Math.random() * ai.children.length);
            return ai.children[randomIndex];
        } else { // iterate through children to find the moves with highest minimaxSum and xMinuso...
            let zeroChildren = ai.children.filter(zero);
            if (zeroChildren.length === 1) {
                return zeroChildren[0];
            }
            let mSumArray = highestMM(zeroChildren);
            if (mSumArray.length > 0 && mSumArray[0].minimaxSum > 0) {
                let randomIndex = Math.floor(Math.random() * mSumArray.length);
                return mSumArray[randomIndex];
            } else {
                let xMinusoArray = highestMinus(zeroChildren);
                let randomIndex = Math.floor(Math.random() * xMinusoArray.length);
                return xMinusoArray[randomIndex];
            }
        }
    } else { // ai is player 2 (O)
        if (ai.minimax === -1) {
            let possibleMoves = ai.children.filter(findneg1);
            let randomIndex = Math.floor(Math.random() * possibleMoves.length);
            return possibleMoves[randomIndex];
        } else if (ai.minimax === 1) {
            let randomIndex = Math.floor(Math.random() * ai.children.length);
            return ai.children[randomIndex];
        } else {
            let zeroChildren = ai.children.filter(zero);
            if (zeroChildren.length === 1) {
                return zeroChildren[0];
            }
            let mSumArray = lowestMM(zeroChildren);
            if (mSumArray.length > 0 && mSumArray[0].minimaxSum < 0) {
                let randomIndex = Math.floor(Math.random() * mSumArray.length);
                return mSumArray[randomIndex];
            } else {
                let xMinusoArray = lowestMinus(zeroChildren);
                let randomIndex = Math.floor(Math.random() * xMinusoArray.length);
                return xMinusoArray[randomIndex];
            }
        }
    }
    //return ai.children[0];
}

function fillInAI(e) {
    aiFirst.removeEventListener('click', first);
    disableBoard();
    //smallBoxes[e.target.id].removeEventListener()
    counter++;
    let num = parseInt(e.target.getAttribute('id'));
    if (num < 3) {
        board[0][num] = turn;
        for (let i = 0; i < ai.children.length; i++) {
            if (ai.children[i].row === 0 && ai.children[i].col === num) {
                ai = ai.children[i];
                console.log(ai);
            }
        }
    } else if (num < 6) {
        board[1][num - 3] = turn;
        for (let i = 0; i < ai.children.length; i++) {
            if (ai.children[i].row === 1 && ai.children[i].col === num - 3) {
                ai = ai.children[i];
                console.log(ai);
            }
        }
    } else {
        board[2][num - 6] = turn;
        for (let i = 0; i < ai.children.length; i++) {
            if (ai.children[i].row === 2 && ai.children[i].col === num - 6) {
                ai = ai.children[i];
                console.log(ai);
            }
        }
    }
    smallBoxes[num].firstElementChild.textContent = turn;
    smallBoxes[num].removeEventListener('mouseup', fillIn);
    turn = getTurn(turn);
    if (checkCol(board) || checkRow(board) || checkDiag(board)) {
        if (e.target.firstElementChild.textContent === 'X') {
            xWins++;
        } else {
            oWins++;
        }
       endAIGame();
       return;
    } else if (counter === 9) {
        draw();
        endAIGame();
        return;
    }
    ai.isTurn = true;
    let move = findBestMove();
    makeMove(move);
    enableBoard();
}

function first(ai) {
    makeButtonOrange(4);
    ai.turn = getTurn(ai.turn);
    ai.isTurn = !ai.isTurn;
    isAIFirst = !isAIFirst;
    mm = 1;
    startAIGame(ai);
}

easy.addEventListener('click', () => {
    changeDiffBtn('EASY');
});
medium.addEventListener('click', () => {
    changeDiffBtn('MEDIUM');
});
impossible.addEventListener('click', () => {
    endAIGame();
    aiFirst.addEventListener('click', first);
    makeButtonOrange(2);
    difficulty.textContent = "IMPOSSIBLE";
    resetScore();
    console.log(ai);
    clearUIBoard();
    disableBoard();
    startAIGame(ai);
});
function enableBoard() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                smallBoxes[i * 3 + j].addEventListener('mouseup', fillInAI);
            } else {
                smallBoxes[i * 3 + j].removeEventListener('mouseup', fillInAI);
            }
        }
    }
}
function disableBoard() {
    for (let i = 0; i < 9; i++) {
        smallBoxes[i].removeEventListener('mouseup', fillIn);
    }
}
function makeButtonOrange(index) {
    if (index === 0) {
        buttons[0].classList.add('orange');
        buttons[2].classList.remove('orange');
        buttons[3].textContent = "DIFFICULTY";
        buttons[4].classList.remove('orange');
    } else if (index === 1) {
        buttons[1].classList.toggle('orange');
    } else if (index === 2) {
        buttons[0].classList.remove('orange');
        buttons[2].classList.add('orange');
    } else if (index === 4) {
        buttons[4].classList.toggle('orange');
    }
}

function clearUIBoard() {
    for (let j = 0; j < 9; j++) {
        smallBoxes[j].addEventListener('mouseup', fillIn);
        smallBoxes[j].firstElementChild.classList.remove('blink_me_winner');
        smallBoxes[j].firstElementChild.classList.remove('blink_me_draw');
        smallBoxes[j].firstElementChild.textContent = "";
    }
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
            position.minimaxSum += currEval;
            maxEval = Math.max(maxEval, currEval);
        }
        position.minimax = maxEval;
    } else {
        let minEval = 100;
        for (let i = 0; i < position.children.length; i++) {
            let currEval = minimax(position.children[i], true);
            position.minimaxSum += currEval;
            minEval = Math.min(minEval, currEval);
        }
        position.minimax = minEval;
    }
    return position.minimax;
}

function node(options, board, row, col, turn, id) {
    this.xWins = 0; this.oWins = 0; this.draw = 0; this.xMinuso = 0;
    this.row = row; this.col = col;
    this.isX = false; this.isO = false; this.isDraw = false;
    this.options = options; this.board = board;
    this.id = id;
    this.children = [];
    this.turn = getTurn(turn);
    this.minimax = 0;
    this.minimaxSum = 0;
    this.isTurn = false;
    if (this.id == -1) {
        getChildren(this);
        minimax(this,true);
    } else {
        evaluate(this);
    }
}

function getChildren(parent) {
    if (parent.isX) {
        parent.minimax = 1;
        return;
    }
    if (parent.isO) {
        parent.minimax = -1;
        return;
    }
    if (parent.isDraw) {
        parent.minimax = 0;
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
    if (node.options < 5 && (checkCol(node.board) || 
                             checkRow(node.board) || 
                             checkDiag(node.board))) {
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
    parent.xMinuso += child.xWins - child.oWins;
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
// STARTING AND ENDING GAME
// ***************************

function startGame(index) {
    endGame();
    makeButtonOrange(index);
    for (let j = 0; j < smallBoxes.length; j++) {
        smallBoxes[j].addEventListener('mouseup', fillIn);
        smallBoxes[j].firstElementChild.classList.remove('blink_me_winner');smallBoxes[j].firstElementChild.classList.remove('blink_me_draw');
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
        //buttons[i].classList.add('navy');
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
    return counter > 4 && (checkRow(board) || checkCol(board) || checkDiag(board));
}

function checkRow(board) {
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
function checkCol(board) {
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
function checkDiag(board) {
    //if (num % 2 === 0) {
        if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== '') {
            blink(0); blink(4); blink(8);
            return true;
        } else if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== '') {
            blink(2); blink(4); blink(6);
            return true;
        }
   // }
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





