function tile_small_board(small_board) {
    for (let i=0; i<9; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        small_board.appendChild(tile);
    }
}

function tile_all_boards() {
    for (let i=1; i<=9; i++) {
        const cur_id = `#board-${i}`;
        const cur_board = document.querySelector(cur_id);
        tile_small_board(cur_board);
    }
}

tile_all_boards();