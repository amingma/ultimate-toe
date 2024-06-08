let p1_turn;
let game_board;
let events;

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
        tileSmallBoard(boards[i], i);
    }
}

const play_button = document.querySelector('button');
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

function makePromise(cur_tile) {
    return new Promise((resolve)=>{
        cur_tile.addEventListener('click', () => {
            const ctest = cur_tile;
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
    if (restrict==9) {
        lb = 0; ub = 81;
    }
    for (let i=lb; i<ub; i++) {
        let cur_id = `#tile-${i}`;
        const cur_tile = document.querySelector(cur_id);
        if (cur_tile.hasChildNodes()) {
            continue;
        }
        //cur_tile.addEventListener('click', clickSquare(cur_tile));
        events.push(makePromise(cur_tile));
    }
}

function removeListeners(restrict) {
    let lb = restrict*9;
    let ub = lb+9;
    if (restrict==9) {
        lb = 0; ub = 81;
    }
    for (let i=lb; i<ub; i++) {
        let cur_id = `#tile-${i}`;
        const cur_tile = document.querySelector(cur_id);
        if (cur_tile.hasChildNodes()) {
            continue;
        }
        const replacement = cur_tile.cloneNode(true);
        cur_tile.parentNode.replaceChild(replacement, cur_tile);
    }
}

async function playGame(restrict) {
    shiftBold();
    events = [];
    addListeners(events, restrict);
    await Promise.race(events);
    removeListeners(restrict);
    p1_turn = !p1_turn;
    playGame(restrict);
}

function startGame() {
    tileAllBoards();
    game_board = board();
    p1_turn = true;
    playGame(9);
}

startGame();