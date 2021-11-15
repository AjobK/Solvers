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

  ngOnInit(): void { }

  getSudoku(): Array<Array<number>> {
    return this.sudoku
  }

  reset() {
    this.viewedSudoku = new Array(9).fill(new Array(9).fill(0))
    this.sudoku = JSON.parse(JSON.stringify(this.viewedSudoku))
  }

  solve() {
    let isDone = false
    let isStuck = false

    for (let passes = 1; !isDone && !isStuck; passes++) {
      isDone = true
      isStuck = true

      let possibilitiesGrid: any = []

      for (let y = 0; y < 9; y++) {
        let possibilitiesRow = []

        for (let x = 0; x < 9; x++) {
          let possibleNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

          if (this.sudoku[y][x] != 0) {
            possibilitiesRow.push([])
            continue
          }

          isDone = false
          

          // Horizontal check
          for (let rowPos = 0; rowPos < 9 && possibleNumbers.length > 0; rowPos++) {
            let currVal = this.sudoku[y][rowPos]

            if (currVal != 0 && possibleNumbers.indexOf(currVal) != -1)
              possibleNumbers.splice(possibleNumbers.indexOf(currVal), 1)  
          }

          // Vertical check
          for (let colPos = 0; colPos < 9 && possibleNumbers.length > 0; colPos++) {
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

          for (let i = 0; i < currSquare.length && possibleNumbers.length > 0; i++) {
            let currVal = currSquare[i]

            if (currVal != 0 && possibleNumbers.indexOf(currVal) != -1)
              possibleNumbers.splice(possibleNumbers.indexOf(currVal), 1)
          }

          if (possibleNumbers.length == 1) {
            isStuck = false
            this.sudoku[y][x] = possibleNumbers[0]
            possibilitiesRow.push([])
          } else {
            possibilitiesRow.push([...possibleNumbers])
          }
        }

        possibilitiesGrid.push(possibilitiesRow)
      }

      // Check possibilities per grid
      for (let y = 0; y < 9; y += 3) {
        for (let x = 0; x < 9; x += 3) {
          let takenNumbersInSquare = [
            ...this.sudoku[y].slice(x, x+3),
            ...this.sudoku[y+1].slice(x, x+3),
            ...this.sudoku[y+2].slice(x, x+3)
          ].filter((i) => i != 0)

          let possibleNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((i) => takenNumbersInSquare.indexOf(i) == -1)

          let allCombinations = [
            possibilitiesGrid[y].slice(x, x+3),
            possibilitiesGrid[y+1].slice(x, x+3),
            possibilitiesGrid[y+2].slice(x, x+3)
          ]

          possibleNumbers.forEach((possibleNumber) => {
            let multipleOptions = false
            let putAtCoords: any = []

            allCombinations.forEach((row, innerY) => {
              row.forEach((possibilitiesInField: any, innerX: any) => {
                let numberIsPossibleInField = possibilitiesInField.indexOf(possibleNumber) != -1

                if (!multipleOptions && numberIsPossibleInField) {
                  if (putAtCoords.length == 0) {
                    putAtCoords = [x + innerX, y + innerY]
                  } else if (putAtCoords.length > 0) {
                    multipleOptions = true
                  }
                }
              })
            })

            if (!multipleOptions && putAtCoords.length >= 2) {
              allCombinations[putAtCoords[1] - y][putAtCoords[0] - x].length = 0
              this.sudoku[putAtCoords[1]][putAtCoords[0]] = possibleNumber
            }
          })
        }
      }

      if (!isDone && isStuck)
          console.log(`[ERROR!!] Got stuck at ${passes} passes\n`)
      else if (isDone)
          console.log(`[SUCCESS] Done after ${passes} passes\n`)

      this.viewedSudoku = JSON.parse(JSON.stringify(this.sudoku))
      this.printSudoku(this.sudoku)
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

    console.log(newPrintArr.join(`\n${new Array(sudoku.length-1).fill('---+').join('')}---\n`))
  }

  addToSudoku(coords: any, value: any) {
    let newVal = value.data?.replace(/[^1-9]/g,'')
    this.sudoku[coords.y][coords.x] = newVal * 1
    
    console.log(this.sudoku)
  }

}
