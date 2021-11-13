import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.scss']
})
export class SudokuComponent implements OnInit {
  // Starts out with dummy sudoku
  // public viewedSudoku: Array<Array<number>> = [
  //   [5, 3, 0, 0, 7, 0, 0, 0, 0],
  //   [6, 0, 0, 1, 9, 5, 0, 0, 0],
  //   [0, 9, 8, 0, 0, 0, 0, 6, 0],
  //   [8, 0, 0, 0, 6, 0, 0, 0, 3],
  //   [4, 0, 0, 8, 0, 3, 0, 0, 1],
  //   [7, 0, 0, 0, 2, 0, 0, 0, 6],
  //   [0, 6, 0, 0, 0, 0, 2, 8, 0],
  //   [0, 0, 0, 4, 1, 9, 0, 0, 5],
  //   [0, 0, 0, 0, 8, 0, 0, 7, 9]
  // ]

  public viewedSudoku: Array<Array<number>> = [
    [0, 9, 0, 0, 0, 0, 8, 7, 0],
    [0, 0, 8, 0, 1, 9, 0, 3, 0],
    [0, 0, 1, 0, 0, 2, 0, 0, 0],
    [0, 6, 0, 0, 2, 5, 0, 0, 8],
    [0, 0, 3, 7, 0, 0, 1, 0, 0],
    [4, 0, 0, 0, 0, 0, 3, 0, 2],
    [0, 3, 4, 1, 5, 0, 0, 0, 6],
    [9, 0, 0, 0, 8, 0, 4, 0, 0],
    [0, 0, 0, 6, 0, 0, 0, 0, 0]
  ]

  public sudoku: Array<Array<number>> = JSON.parse(JSON.stringify(this.viewedSudoku))

  // When a sudoku has been solver you can see the steps with this array
  public sudokuSteps: Array<Array<Array<number>>> = []

  constructor() { }

  ngOnInit(): void { }

  getSudoku(): Array<Array<number>> {
    console.log('GET ITTT')
    return this.sudoku
  }

  reset() {
    this.viewedSudoku = new Array(9).fill(new Array(9).fill(0))
    this.sudoku = JSON.parse(JSON.stringify(this.viewedSudoku))
  }

  solve() {
    let isDone = false
    let isStuck = false

    this.printSudoku(this.sudoku)

    console.log(this.sudoku)

    for (let passes = 1; !isDone && !isStuck; passes++) {
        isDone = true
        isStuck = true

        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (this.sudoku[y][x] != 0) continue

                isDone = false
                
                let possibleNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

                // Horizontal check
                for (let rowPos = 0; rowPos < 9 && possibleNumbers.length != 0; rowPos++) {
                    let currVal = this.sudoku[y][rowPos]

                    if (currVal != 0 && possibleNumbers.indexOf(currVal) != -1)
                        possibleNumbers.splice(possibleNumbers.indexOf(currVal), 1)  
                }

                // Vertical check
                for (let colPos = 0; colPos < 9 && possibleNumbers.length != 0; colPos++) {
                    let currVal = this.sudoku[colPos][x]

                    if (currVal != null && possibleNumbers.indexOf(currVal) != -1)
                        possibleNumbers.splice(possibleNumbers.indexOf(currVal), 1)  
                }

                // Square check
                let checkStartPosX = ~~(x / 3) * 3
                let checkStartPosY = ~~(y / 3) * 3

                let currSquare = [
                    ...this.sudoku[checkStartPosY].slice(checkStartPosX, checkStartPosX + 3),
                    ...this.sudoku[checkStartPosY + 1].slice(checkStartPosX, checkStartPosX + 3),
                    ...this.sudoku[checkStartPosY + 2].slice(checkStartPosX, checkStartPosX + 3)
                ]

                for (let i = 0; i < currSquare.length; i++) {
                    let currVal = currSquare[i]

                    if (currVal != 0 && possibleNumbers.indexOf(currVal) != -1)
                        possibleNumbers.splice(possibleNumbers.indexOf(currVal), 1)
                }

                if (possibleNumbers.length == 1) {
                    isStuck = false
                    this.sudoku[y][x] = possibleNumbers[0]
                }
            }
        }

        if (!isDone && isStuck)  {
            console.log(`[ERROR!!] Got stuck at ${passes} passes\n`)
        } else if (isDone) {
            console.log(`[SUCCESS] Done after ${passes} passes\n`)
        } else {
            // console.log(`\n[STEP ${passes}]\n`)
            // this.printSudoku(this.sudoku)
            // console.log('\n')
        }

        this.viewedSudoku = JSON.parse(JSON.stringify(this.sudoku))
    }
  }

  printSudoku(inputSudoku: Array<Array<number>>) {
    let sudoku = []

    for (var i = 0; i < inputSudoku.length; i++)
        sudoku[i] = inputSudoku[i].slice()

    let newPrintArr: Array<any> = []

    for (let y = 0; y < sudoku.length; y++) {
        sudoku[y] = sudoku[y].map((item: number | string) => item === 0 ? ' ' : item)
        newPrintArr.push(` ${sudoku[y].join(' | ')} `)
    }

    console.log(newPrintArr.join('\n---+---+---+---+---+---+---+---+---\n'))
  }

  addToSudoku(coords: any, value: any) {
    let newVal = value.data?.replace(/[^1-9]/g,'')
    this.sudoku[coords.y][coords.x] = newVal * 1
    
    console.log(this.sudoku)
  }

}
