let p1_turn;
let game_board;
let events;
let round;
let last_pressed;

function tileSmallBoard(small_board, j) {
    for (let i=0; i<9; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.id = `tile-${j*9+i}`;
        small_board.appendChild(tile);
    }
}

function tileAllBoards() {
    // for (let i=1; i<=9; i++) {
    //     const cur_id = `#board-${i}`;
    //     const cur_board = document.querySelector(cur_id);
    //     tile_small_board(cur_board);
    // }
    const boards = document.querySelectorAll('.small-board');
    for (let i=0; i<boards.length; i++) {
        boards[i].style.display = 'grid';
        tileSmallBoard(boards[i], i);
    }
}

const play_button = document.querySelector('#play-human');
play_button.addEventListener('click', ()=>{
    const welcome = document.querySelector('#rules');
    welcome.style.display = 'none';
    const game = document.querySelector('#game');
    game.style.display = 'flex';
    const board = document.querySelector('#board');
    board.style.display = 'grid';
})

function tile() {
    let filled = 0;
    return {filled};
}

function square() {
    let won = 0;
    const tiles = [];
    for (let i=0; i<9; i++) {
        tiles.push(tile());
    }
    return {tiles, won};
}

function board() {
    const squares = [];
    for (let i=0; i<9; i++) {
        squares.push(square());
    }
    return {squares};
}

const winChecks = (function(){
    const horWin = (board)=>{
        for (let i=0; i<9; i+=3) {
            if (board.squares[i].won == 0) {
                continue;
            }
            if (board.squares[i].won==board.squares[i+1].won && board.squares[i].won==board.squares[i+2].won) {
                return board.squares[i].won;
            }
        }
        return 0;
    }
    const vertWin = (board)=>{
        for (let i=0; i<3; i++) {
            if (board.squares[i].won == 0) {
                continue;
            }
            if (board.squares[i].won==board.squares[i+3].won && board.squares[i].won==board.squares[i+6].won) {
                return board.squares[i].won;
            }
        }
        return 0;
    }
    const diagWin = (board)=>{
        if (board.squares[0].won > 0 && board.squares[0].won==board.squares[4].won && board.squares[0].won==board.squares[8].won) {
            return board.squares[0].won;
        }
        if (board.squares[2].won > 0 && board.squares[2].won==board.squares[4].won && board.squares[2].won==board.squares[6].won) {
            return board.squares[2].won;
        }
        return 0;
    }   
    return {horWin, vertWin, diagWin};
})();

function isOver(board) {
    // 0 1 2
    // 3 4 5
    // 6 7 8
    return Math.max(winChecks.horWin(board), winChecks.vertWin(board), winChecks.diagWin(board));
}

function shiftBold() {
    const p1_div = document.querySelector('#p1');
    const p2_div = document.querySelector('#p2');
    if (p1_turn) {
        p1_div.style.fontWeight = 700;
        p2_div.style.fontWeight = 400;
    }
    else {
        p1_div.style.fontWeight = 400;
        p2_div.style.fontWeight = 700;
    }
}

function hoverLegal(restrict) {
    // if (restrict==9 || game_board.squares[restrict].won != 0) {
    //     return;
    // }
    // const square = document.querySelector(`#board-${restrict}`);
    // const square_children = square.childNodes;
    // for (let i=0; i<square_children.length; i++) {
    //     square_children[i].style.backgroundColor = 'turquoise';
    // }
    let lb = restrict*9;
    let ub = lb + 9;
    if (restrict == 9 || game_board.squares[restrict].won != 0) {
        lb = 0; ub = 81;
    }
    for (let i=lb; i<ub; i++) {
        if (i%9==0 && game_board.squares[i/9].won!=0) {
            i+=8;
            continue;
        }
        let cur_id = `#tile-${i}`;
        const cur_tile = document.querySelector(cur_id);
        if (cur_tile.hasChildNodes()) {
            continue;
        }
        cur_tile.style.backgroundColor = 'turquoise';
    }
}

function removeLegal(restrict) {
    let lb = restrict*9;
    let ub = lb + 9;
    if (restrict == 9 || game_board.squares[restrict].won != 0) {
        lb = 0; ub = 81;
    }
    for (let i=lb; i<ub; i++) {
        if (i%9==0 && game_board.squares[i/9].won!=0) {
            i+=8;
            continue;
        }
        let cur_id = `#tile-${i}`;
        const cur_tile = document.querySelector(cur_id);
        cur_tile.style.backgroundColor = 'blanchedalmond';
    }
}

function makePromise(cur_tile, i) {
    return new Promise((resolve)=>{
        cur_tile.addEventListener('click', () => {
            const ctest = cur_tile;
            game_board.squares[Math.floor(i/9)].tiles[i%9].filled = p1_turn?1:2;
            last_pressed = i;
            const move = document.createElement('img');
            if (p1_turn) {
                move.src = './img/letter-x.svg';
                ctest.appendChild(move);
            }
            else {
                move.src = './img/letter-o.svg';
                ctest.appendChild(move);
            }
            resolve();
        }, {once: true});
    });
}

function addListeners(events, restrict) {
    let lb = restrict*9;
    let ub = lb+9;
    if (restrict==9 || game_board.squares[restrict].won != 0) {
        lb = 0; ub = 81;
    }
    for (let i=lb; i<ub; i++) {
        if (i%9==0 && game_board.squares[i/9].won!=0) {
            i+=8;
            continue;
        }
        let cur_id = `#tile-${i}`;
        const cur_tile = document.querySelector(cur_id);
        if (cur_tile.hasChildNodes()) {
            continue;
        }
        events.push(makePromise(cur_tile, i));
    }
}

function removeListeners(restrict) {
    let lb = restrict*9;
    let ub = lb+9;
    if (restrict==9 || game_board.squares[restrict].won != 0) {
        lb = 0; ub = 81;
    }
    for (let i=lb; i<ub; i++) {
        if (i%9==0 && game_board.squares[i/9].won!=0) {
            i+=8;
            continue;
        }
        let cur_id = `#tile-${i}`;
        const cur_tile = document.querySelector(cur_id);
        if (cur_tile.hasChildNodes()) {
            continue;
        }
        const replacement = cur_tile.cloneNode(true);
        cur_tile.parentNode.replaceChild(replacement, cur_tile);
    }
}

const squareChecks = (function() {
    const horWin = (square)=>{
        for (let i=0; i<9; i+=3) {
            if (square.tiles[i].filled == 0) {
                continue;
            }
            if (square.tiles[i].filled==square.tiles[i+1].filled && square.tiles[i].filled==square.tiles[i+2].filled) {
                return square.tiles[i].filled;
            }
        }
        return 0;
    }
    const vertWin = (square)=>{
        for (let i=0; i<3; i++) {
            if (square.tiles[i].filled == 0) {
                continue;
            }
            if (square.tiles[i].filled==square.tiles[i+3].filled && square.tiles[i].filled==square.tiles[i+6].filled) {
                return square.tiles[i].filled;
            }
        }
        return 0;
    }
    const diagWin = (square)=>{
        if (square.tiles[0].filled > 0 && square.tiles[0].filled==square.tiles[4].filled && square.tiles[0].filled==square.tiles[8].filled) {
            return square.tiles[0].filled;
        }
        if (square.tiles[2].filled > 0 && square.tiles[2].filled==square.tiles[4].filled && square.tiles[2].filled==square.tiles[6].filled) {
            return square.tiles[2].filled;
        }
        return 0;
    }
    return {horWin, vertWin, diagWin};
})();

function squareWon(square) {
    return Math.max(squareChecks.horWin(square), squareChecks.vertWin(square), squareChecks.diagWin(square));
}

function updateSquare(square_num) {
    const cur_square = document.querySelector(`#board-${square_num}`);
    let marking = document.createElement('img');
    marking.src = p1_turn?'./img/letter-x.svg':'./img/letter-o.svg';
    while(cur_square.hasChildNodes()) {
        cur_square.removeChild(cur_square.lastChild);
    }
    cur_square.style.display = 'flex';
    cur_square.style.justifyContent = 'center';
    cur_square.appendChild(marking);
}

function checkSquare() {
    const square_num = Math.floor(last_pressed/9);
    const result = squareWon(game_board.squares[square_num]);
    if (result !=0) {
        updateSquare(square_num);
        game_board.squares[square_num].won = result;
    }
}

function resetBoard() {
    const boards = document.querySelectorAll('.small-board');
    for (let i=0; i<boards.length; i++) {
        boards[i].replaceChildren();
    }
}

function processGame(result) {
    const game = document.querySelector('#game');
    const postgame_screen = document.querySelector('#postgame');
    const postgame_text = document.querySelector('#finaltext');
    const postgame_button = document.querySelector('#rematch');
    game.style.display = 'none';
    if (result==0) {
        postgame_text.textContent = 'Game ended in a draw';
    }
    else if (result==1) {
        postgame_text.textContent = 'Congratulations to Player 1 for winning!';
    }
    else {
        postgame_text.textContent = 'Congratulations to Player 2 for winning!';
    }
    postgame_button.addEventListener('click', ()=>{
        resetBoard();
        startGame();
        postgame_screen.style.display = 'none';
        game.style.display = 'flex';
    })
    postgame_screen.style.display = 'flex';
}

async function playGame(restrict) {
    shiftBold();
    hoverLegal(restrict);
    events = [];
    addListeners(events, restrict);
    await Promise.race(events);
    removeListeners(restrict);
    removeLegal(restrict);
    checkSquare();
    round += 1;
    const result = isOver(game_board);
    if (round > 80 || result) {
        processGame(result);
        return;
    }
    restrict = Math.floor(last_pressed%9);
    p1_turn = !p1_turn;
    playGame(restrict);
}

function startGame() {
    tileAllBoards();
    game_board = board();
    p1_turn = true;
    round = 0;
    playGame(9);
}

startGame();