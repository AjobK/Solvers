let sudokuEntry = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
]

function solveSudoku(inputSudoku) {
    let isDone = false
    let isStuck = false
    let sudoku = []

    for (var i = 0; i < inputSudoku.length; i++)
        sudoku[i] = inputSudoku[i].slice()

    for (let passes = 1; !isDone && !isStuck; passes++) {
        isDone = true
        isStuck = true

        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (sudoku[y][x] != 0) continue

                isDone = false
                
                let possibleNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

                // Horizontal check
                for (let rowPos = 0; rowPos < 9 && possibleNumbers.length != 0; rowPos++) {
                    let currVal = sudoku[y][rowPos]

                    if (currVal != 0 && possibleNumbers.indexOf(currVal) != -1)
                        possibleNumbers.splice(possibleNumbers.indexOf(currVal), 1)  
                }

                // Vertical check
                for (let colPos = 0; colPos < 9 && possibleNumbers.length != 0; colPos++) {
                    let currVal = sudoku[colPos][x]

                    if (currVal != null && possibleNumbers.indexOf(currVal) != -1)
                        possibleNumbers.splice(possibleNumbers.indexOf(currVal), 1)  
                }

                // Square check
                let checkStartPosX = ~~(x / 3) * 3
                let checkStartPosY = ~~(y / 3) * 3

                let currSquare = [
                    ...sudoku[checkStartPosY].slice(checkStartPosX, checkStartPosX + 3),
                    ...sudoku[checkStartPosY + 1].slice(checkStartPosX, checkStartPosX + 3),
                    ...sudoku[checkStartPosY + 2].slice(checkStartPosX, checkStartPosX + 3)
                ]

                for (let i = 0; i < currSquare.length; i++) {
                    let currVal = currSquare[i]

                    if (currVal != 0 && possibleNumbers.indexOf(currVal) != -1)
                        possibleNumbers.splice(possibleNumbers.indexOf(currVal), 1)
                }

                if (possibleNumbers.length == 1) {
                    isStuck = false
                    sudoku[y][x] = possibleNumbers[0]
                }
            }
        }

        if (!isDone && isStuck)  {
            console.log(`[ERROR!!] Got stuck at ${passes} passes\n`)
        } else if (isDone) {
            console.log(`[SUCCESS] Done after ${passes} passes\n`)
        } else {
            console.log(`\n[STEP ${passes}]\n`)
            printSudoku(sudoku)
            console.log('\n')
        }
    }

    return sudoku
}

function printSudoku(inputSudoku) {
    let sudoku = []

    for (var i = 0; i < inputSudoku.length; i++)
        sudoku[i] = inputSudoku[i].slice()

    let newPrintArr = []

    for (let y = 0; y < sudoku.length; y++) {
        sudoku[y] = sudoku[y].map((item) => item === 0 ? ' ' : item)
        newPrintArr.push(` ${sudoku[y].join(' | ')} `)
    }

    newPrintArr = newPrintArr.join('\n---+---+---+---+---+---+---+---+---\n')

    console.log(newPrintArr)
}

printSudoku(sudokuEntry)

console.log('\n\n------------------------------------\n\n')

printSudoku(solveSudoku(sudokuEntry))
