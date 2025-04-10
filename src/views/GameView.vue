<template>
  <div class="game-field">
    <div class="header">
      <div class="mines-left">Mines: {{ minesLeft }}</div>
      <button @click="restartGame" class="restart-button">🔄</button>
      <div class="timer">Time: {{ formattedTime }}</div>
    </div>
    <div class="grid">
      <div
        v-for="(cell, index) in cells"
        :key="index"
        class="cell"
        :class="[
          { 'is-bomb': cell.isBomb, 'is-revealed': cell.isRevealed, 'is-flagged': cell.isFlagged },
          getColorClass(cell.adjacentMines),
        ]"
        @click="revealCell(cell)"
        @contextmenu.prevent="flagCell(cell)"
      >
        <span v-if="cell.isRevealed && cell.adjacentMines > 0" class="cell-number">{{ cell.adjacentMines }}</span>
        <span v-if="cell.isBomb && cell.isRevealed" class="bomb">💣</span>
        <span v-if="cell.isFlagged" class="flag">🚩</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      gridSize: 10,
      minesCount: 10,
      cells: [],
      gameOver: false,
      gameWon: false,
      minesLeft: 0,
      timer: 0,
      timerInterval: null,
    };
  },
  computed: {
    formattedTime() {
      const minutes = Math.floor(this.timer / 60);
      const seconds = this.timer % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
  },
  mounted() {
    this.initGame(); // Запускаем игру при монтировании
  },
  methods: {
    initGame() {
      this.gameOver = false;
      this.gameWon = false;
      this.cells = [];
      this.minesLeft = this.minesCount;
      this.timer = 0;
      this.stopTimer();
      this.generateGrid();
    },
    startGame() {
      this.timer = 0; // Инициализируем таймер нулем
      this.timerInterval = setInterval(() => {
        this.timer++; // Увеличиваем таймер
      }, 1000);
    },
    stopGame() {
      clearInterval(this.timerInterval);
    },
    stopTimer() {
      clearInterval(this.timerInterval);
    },
    restartGame() {
      this.initGame();
    },
    generateGrid() {
      for (let i = 0; i < this.gridSize * this.gridSize; i++) {
        this.cells.push({
          index: i,
          isBomb: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
        });
      }
      this.placeMines();
      this.calculateAdjacentMines();
    },
    placeMines() {
      let minesToPlace = this.minesCount;
      while (minesToPlace > 0) {
        const randomIndex = Math.floor(Math.random() * this.cells.length);
        if (!this.cells[randomIndex].isBomb) {
          this.cells[randomIndex].isBomb = true;
          minesToPlace--;
        }
      }
    },
    calculateAdjacentMines() {
      for (let i = 0; i < this.cells.length; i++) {
        if (!this.cells[i].isBomb) {
          let count = 0;
          const neighbors = this.getNeighbors(i);
          neighbors.forEach((neighbor) => {
            if (neighbor && this.cells[neighbor].isBomb) {
              count++;
            }
          });
          this.cells[i].adjacentMines = count;
        }
      }
    },
    getNeighbors(index) {
      const neighbors = [];
      const row = Math.floor(index / this.gridSize);
      const col = index % this.gridSize;

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;

          const neighborRow = row + i;
          const neighborCol = col + j;
          const neighborIndex = neighborRow * this.gridSize + neighborCol;

          if (
            neighborRow >= 0 &&
            neighborRow < this.gridSize &&
            neighborCol >= 0 &&
            neighborCol < this.gridSize &&
            neighborIndex >= 0 &&
            neighborIndex < this.cells.length
          ) {
            neighbors.push(neighborIndex);
          }
        }
      }
      return neighbors;
    },
    revealCell(cell) {
      if (this.gameOver || cell.isRevealed || cell.isFlagged) return;

      if (!this.timerInterval) {
        this.startGame(); // Запускаем таймер при первом клике
      }

      cell.isRevealed = true;

      if (cell.isBomb) {
        this.gameOver = true;
        this.stopTimer();
      } else if (cell.adjacentMines === 0) {
        this.revealEmptyCells(cell.index);
      }

      this.checkWin();
    },
    revealEmptyCells(index) {
      const neighbors = this.getNeighbors(index);
      neighbors.forEach((neighborIndex) => {
        const neighborCell = this.cells[neighborIndex];
        if (
          neighborCell &&
          !neighborCell.isRevealed &&
          !neighborCell.isBomb &&
          !neighborCell.isFlagged
        ) {
          neighborCell.isRevealed = true;
          if (neighborCell.adjacentMines === 0) {
            this.revealEmptyCells(neighborIndex);
          }
        }
      });
    },
    flagCell(cell) {
      if (this.gameOver || cell.isRevealed) return;
      cell.isFlagged = !cell.isFlagged;
      this.minesLeft = this.minesCount - this.cells.filter(cell => cell.isFlagged).length;
    },
    checkWin() {
      const revealedCells = this.cells.filter((cell) => cell.isRevealed && !cell.isBomb);
      if (revealedCells.length === this.cells.length - this.minesCount) {
        this.gameWon = true;
        this.gameOver = true;
        this.stopTimer();
      }
    },
    getColorClass(count) {
      switch (count) {
        case 1:
          return "cell-number-1";
        case 2:
          return "cell-number-2";
        case 3:
          return "cell-number-3";
        case 4:
          return "cell-number-4";
        case 5:
          return "cell-number-5";
        case 6:
          return "cell-number-6";
        case 7:
          return "cell-number-7";
        case 8:
          return "cell-number-8";
        default:
          return "";
      }
    },
  },
};
</script>

<style scoped>
.game-field {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(10, 30px);
  grid-gap: 2px;
}

.cell {
  width: 30px;
  height: 30px;
  background-color: #ccc;
  border: 1px solid #999;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  cursor: pointer;
  user-select: none;
}

.cell.is-revealed {
  background-color: #eee;
  border: 1px solid #bbb;
}

.cell.is-bomb {
  background-color: red;
}

.cell.is-flagged {
  background-color: yellow;
}

.bomb {
  font-size: 24px;
}

.flag {
  font-size: 24px;
}

.cell-number-1 {
  color: blue;
}
.cell-number-2 {
  color: green;
}
.cell-number-3 {
  color: red;
}
.cell-number-4 {
  color: darkblue;
}
.cell-number-5 {
  color: brown;
}
.cell-number-6 {
  color: turquoise;
}
.cell-number-7 {
  color: black;
}
.cell-number-8 {
  color: white;
}
</style>
