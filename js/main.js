'use strict'

const MINE = '💣'
const EMPTY = ' '
const FLAG = '🚩'


var gShownCount
var gMarkedCount
var gBoard = []
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gStartTime
var gIntervalID
var gLevel = [{

}
]


// console.log('gGame', gGame);

function init() {
    gGame.isOn = true
    gBoard = buildBoard(4, 4)
    renderBoard(gBoard)
    setMinesNegsCount(gBoard)

    // console.log('createBoard(ROWS = 4, COLS = 4)', createBoard(4, 4));
    // console.log('gBoard:', gBoard)
    // console.log('getNeighbors(gBoard, 1, 1)', getNeighbors(gBoard, 1, 1));
    // console.log('countAround(gBoard, 1, 1)', countAround(gBoard, 1, 1));
}

// console.log('createBoard(ROWS = 4, COLS = 4)', createBoard(4, 4));
// console.log('gBoard:', gBoard);


function buildBoard(ROWS = 4, COLS = 4) {
    var board = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {

            var cell = {
                minesAroundCount: mineCountAround(gBoard, i, j), //should be a function (setMinesNegCount?)
                isShown: false,
                isMine: false,
                isMarked: false
            }
            // manually place 2 mines
            // if (i === 0 && j === 0 || i === 2 && j === 2) {

            //     cell.isMine = true
            // }

            // // randomly place 2 mines
            // for (var i = 0; i < 2; i++) {
            //     if (cell.id === getRandomId()) {
            //         cell.isMine = true
            //     }
            // }

            // if (i === 0 && j === 0 || i === 2 && j === 2) {

            //     cell.isMine = true
            // }
            row.push(cell)
        }
        board.push(row)
        //    board.charAt(getRandomInt(0, board.length))
    }

    for (var i = 0; i < 2; i++) {
        addRandomMine(board)
    }
    // console.log('board.charAt(getRandomInt(0, board.length))', getRandomInt(0, board.length ** 2))
    // console.log(' board.length', board.length);
    // console.log('board', board);
    return board
}

// console.log('randomMine(gBoard)', randomMine(gBoard));

// console.log('getRandomFromArray(gBoard)',getRandomFromArray(gBoard));

// function getRandomFromArray(gBoard) {
//     return gBoard[getRandomInt(0, gBoard - 1)]
// }


// console.log('setRandomMine(gBoard)', setRandomMine(gBoard))
// function setRandomMine(board) {



//     var copyBoard = []

//     for (var i = 0; i < board.length; i++) {

//         for (var j = 0; j < board[0].length; j++) {

//             var cell = board[i][j]
//             copyBoard.push(cell)
//         }
//     }
//     console.log('copyBoard', copyBoard);

//     var rndIdx = getRandomInt(0, copyBoard.length)
//     var mine = copyBoard[rndIdx]
//     copyBoard.splice(rndIdx, 1)
//     mine[rndIdx].isMine = true

//     console.log('mine', mine);

//     return mine

// }



// function drawNum() {
//     var rndIdx = getRandomInt(0, gNums.length);
//     var num = gNums[rndIdx];
//     gNums.splice(rndIdx, 1);
//     return num;
// }

function renderBoard(board) {

    var strHTML = ''
    // var className

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            if (board[i][j].isMine) {
                cell = MINE
            } else {
                cell = EMPTY
            }


            strHTML += `<td onclick="cellClicked(this, ${i}, ${j})" class="cell cellId-${i}-${j}" oncontextmenu="cellMarked(this ,${i},${j});return false;"></td>`

        }
        strHTML += '</tr>'
    }

    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
    // console.log('strHTML', strHTML);
}


function setMinesNegsCount(gBoard) {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {

            // console.log('i', i, 'j', j);

            var currCell = gBoard[i][j]

            // console.log('currCell', currCell);

            currCell.minesAroundCount = mineCountAround(gBoard, i, j)

            // console.log('currCell.minesAroundCount', currCell.minesAroundCount);

            var elCell = document.querySelector(`.cellID-${i}-${j}`)

            if (currCell.isShown) {
                // if (currCell.isMine) {
                //     // loss()
                //     elCell.innerText = 'boom'
                // }
                elCell.innerText = currCell.minesAroundCount
            }
        }
    }
}


function mineCountAround(gBoard, rowIdx, colIdx) {
    var mineCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            if (gBoard[i][j].isMine) {
                mineCount++
            }
        }
    }
    return mineCount
}


function cellClicked(elCell, rowIdx, colIdx) {

    var cell = gBoard[rowIdx][colIdx]

    if (!cell.isMarked && gGame.isOn === true) {
        cell.isShown = true
        shownCount()
        if (gGame.shownCount + gGame.markedCount === 1) {
            startTimer()
        }
        if (gGame.shownCount + gGame.markedCount === 16) {
            endTimer()
        }

        // console.log('gGame', gGame);
        console.log('gGame.markedCount', gGame.markedCount);

        if (!cell.isMine) {
            elCell.innerText = cell.minesAroundCount
        } else {
            elCell.innerText = MINE
        }
        lose()

    }
    // console.log('cell.mineCountAround', cell.minesAroundCount)
    // console.log('gBoard:', gBoard)
}


// console.log('addRandomMine(gBoard)', addRandomMine(gBoard));

// console.log('gBoard[0])[0]',gBoard[0][0])

function addRandomMine(board) {
    var emptyCells = []
    for (var i = 0; i < board.length; i++) {
        // console.log('i', i);
        for (var j = 0; j < board[0].length; j++) {


            if (board[i][j].isMine === false) {
                var currCell = { i, j }
                emptyCells.push(currCell);
            }
        }
    }

    // console.log('emptyCells', emptyCells);

    // Model
    var randomCell = emptyCells[getRandomInt(0, emptyCells.length)];
    // console.log('randomCell', randomCell);
    board[randomCell.i][randomCell.j].isMine = true

    // DOM

    // renderCell(randomCell, MINE_IMG)

    // console.log('randomCell', randomCell);
    // console.log('randomCell.i', randomCell.i);
    // console.log('board', board);
}

function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}


// cellId-${i}-${j}"


// Returns the class name for a specific cell

function getClassName(location) {
    var cellClass = 'cellId-' + location.i + '-' + location.j;
    return cellClass
}



function shownCount() {

    gShownCount = 0

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isShown) {
                gShownCount++
            }
        }
    }

    console.log('shownCount', gShownCount);

    gGame.shownCount = gShownCount
    // console.log('gGame', gGame);

    return gGame.shownCount
}


function markedCount() {

    gMarkedCount = 0

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMarked) {
                gMarkedCount++
            }
        }
    }

    gGame.markedCount = gMarkedCount

    return gGame.markedCount
}


function startTimer() {
    var elSeconds = document.querySelector('.seconds');

    gStartTime = Date.now()
    gIntervalID = setInterval(function () {

        var timeDiff = Date.now() - gStartTime
        elSeconds.innerText = timeDiff;
    }, 10);
}

function endTimer() {
    clearInterval(gIntervalID)
    gGame.isOn = false
}


function cellMarked(elCell, rowIdx, colIdx) {

    var cell = gBoard[rowIdx][colIdx]

    if (!cell.isShown && gGame.isOn === true) {

        if (!cell.isMarked) {
            cell.isMarked = true
            elCell.innerText = FLAG
            markedCount()

        } else {
            cell.isMarked = false
            gMarkedCount--
            elCell.innerText = '.'
        }

        if (gGame.markedCount + gGame.shownCount === 1) {
            startTimer()
        }

        if (gGame.shownCount + gGame.markedCount === 16) {
            endTimer()
        }
        // console.log('gBoard', gBoard)
    }
}

el.addEventListener('contextmenu', function (ev) {
    ev.preventDefault()
    cellMarked(idxI, idxJ)
    return false
}, false)


function lose() {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {

            var cell = gBoard[i][j]
            var elCell = document.querySelector(`.cellID-${i}-${j}`)

            console.log('gBoard', gBoard)

            if (cell.isShown === true && cell.isMine === true) {
                // elCell.innerText = MINE
                endTimer()
                if (cell.isMine === true) {
                    elCell.innerText = MINE
                }
            }
        }
    }
}


// const noContext = document.getElementById('noContextMenu');

// noContext.addEventListener('contextmenu', e => {
//   e.preventDefault();
// });

// console.log('getRandomId(gBoard, randomTimes = 2)', getRandomId());

// function getRandomId() {
//     var ids = []
//     for (var i = 101; i < 117; i++) {
//         var id = i
//         ids.push(id)
//     }

//     var rndIdx = getRandomInt(0, ids.length)
//     var num = ids[rndIdx];
//     ids.splice(rndIdx, 1);

//     return num

// }



// console.log('countAround(gBoard, 2, 1)', mineCountAround(gBoard, 2, 1));

// function renderCell(i, j, value) {
//     var elCell = document.querySelector(`.cell-${i}-${j}`)
//     elCell.innerHTML = value
//     return elCell
// }
// function createBoard() {
//     var board = [];
//     for (var i = 0; i < 8; i++) {
//         board.push([])
//         for (var j = 0; j < 8; j++) {
//             board[i][j] = (Math.random() > 0.5) ? LIFE : ''
//             // board[i][j] = (i === 0 || i === 7 ||j === 0 || j === 7) ? LIFE : ''
//         }
//     }
//     return board;
// }


// }
// minesAroundCount: 4,
// isShown: true,
// isMine: false,
// isMarked: true
// }


// function getNeighbors(gBoard, idxI, idxJ) {
//     var neighbors = []
//     for (var i = idxI - 1; i <= idxI + 1; i++) {
//         if (i < 0 || i > gBoard.length - 1) continue

//         for (var j = idxJ - 1; j <= idxJ + 1; j++) {
//             if (i === idxI && j === idxJ) continue
//             if (j < 0 || j > gBoard[i].length - 1) continue

//             neighbors.push(gBoard[idxI][idxJ])
//         }
//     }



//     return neighbors
// }

// console.log('getNeighbors(gBoard, 2, 1)', getNeighbors(gBoard, 2, 1));
