<template>
  <v-container class="game-view-container">
    <h1 class="game-title">Minesweeper</h1>

    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" class="button-container">
        <p class="game-info">Уровень сложности: {{ settingsStore.difficulty }}</p>
        <p class="game-info">Размер поля: {{ settingsStore.rows }}x{{ settingsStore.cols }}</p>
        <p class="game-info">Осталось мин: {{ totalMines - flaggedMines }}</p>
        <p class="game-info">Осталось времени: {{ formattedTime }}</p>

        <v-btn color="primary" @click="restartGame" class="restart-button">
          <v-icon left>mdi-restart</v-icon>
          Перезапуск
        </v-btn>
      </v-col>
    </v-row>

    <GameBoard :board="board" @click="handleCellClick" @rightclick="handleCellRightClick" />
  </v-container>
</template>

<script>
import { useSettingsStore } from '../stores/settings'
import { ref, onMounted, computed } from 'vue'
import GameBoard from '../components/GameBoard.vue'
import { useRouter } from 'vue-router'

export default {
  components: {
    GameBoard,
  },
  setup() {
    const settingsStore = useSettingsStore()
    const board = ref([])
    const gameover = ref(false)
    const timeLeft = ref(0)
    const timerInterval = ref(null)
    const gameStarted = ref(false)
    const router = useRouter()

    const totalMines = computed(() => settingsStore.mines)

    const flaggedMines = computed(() => {
      let count = 0
      for (let row = 0; row < board.value.length; row++) {
        for (let col = 0; col < board.value[row].length; col++) {
          if (board.value[row][col].isFlagged) {
            count++
          }
        }
      }
      return count
    })

    const setTimeLimit = () => {
      const rows = settingsStore.rows
      const cols = settingsStore.cols

      if (rows === 8 && cols === 8) {
        timeLeft.value = 10 * 60
      } else if (rows === 16 && cols === 16) {
        timeLeft.value = 20 * 60
      } else if (rows === 32 && cols === 32) {
        timeLeft.value = 30 * 60
      } else {
        timeLeft.value = 15 * 60
      }
    }

    const generateBoard = () => {
      const rows = settingsStore.rows
      const cols = settingsStore.cols
      const mines = settingsStore.mines

      if (mines > rows * cols) {
        console.error('Too many mines!')
        return
      }

      const newBoard = Array(rows)
        .fill(null)
        .map(() =>
          Array(cols)
            .fill(null)
            .map(() => ({
              isMine: false,
              isVisible: false,
              isFlagged: false,
              adjacentMines: 0,
            })),
        )

      let minesPlaced = 0
      while (minesPlaced < mines) {
        const row = Math.floor(Math.random() * rows)
        const col = Math.floor(Math.random() * cols)

        if (!newBoard[row][col].isMine) {
          newBoard[row][col].isMine = true
          minesPlaced++
        }
      }

      // Calculate adjacent mines for each cell
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (!newBoard[row][col].isMine) {
            let adjacentMines = 0
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue
                const newRow = row + i
                const newCol = col + j
                if (
                  newRow >= 0 &&
                  newRow < rows &&
                  newCol >= 0 &&
                  newCol < cols &&
                  newBoard[newRow][newCol].isMine
                ) {
                  adjacentMines++
                }
              }
            }
            newBoard[row][col].adjacentMines = adjacentMines
          }
        }
      }

      board.value = newBoard
    }

    const startTimer = () => {
      timerInterval.value = setInterval(() => {
        timeLeft.value--

        if (timeLeft.value <= 0) {
          stopTimer()
          gameover.value = true
          alert('Время истекло! Вы проиграли.')
        }
      }, 1000)
    }

    const stopTimer = () => {
      clearInterval(timerInterval.value)
    }

    const formattedTime = computed(() => {
      const minutes = Math.floor(timeLeft.value / 60)
      const seconds = timeLeft.value % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    })

    const handleCellClick = (row, col) => {
      if (gameover.value || board.value[row][col].isVisible || board.value[row][col].isFlagged) {
        return
      }

      if (!gameStarted.value) {
        gameStarted.value = true
        startTimer()

        // Если первый клик на мину, перемещаем ее
        if (board.value[row][col].isMine) {
          moveMine(row, col)
        }
      }

      board.value[row][col].isVisible = true

      if (board.value[row][col].isMine) {
        alert('Game Over!') // TODO: Replace with better UI
        gameover.value = true
        stopTimer()
        // Optionally reveal all mines
        board.value.forEach((row) =>
          row.forEach((cell) => {
            if (cell.isMine) {
              cell.isVisible = true
            }
          }),
        )
        return
      }

      if (board.value[row][col].adjacentMines === 0) {
        openAdjacentCells(row, col)
      }

      checkWin()
    }

    const moveMine = (row, col) => {
      let newRow, newCol
      const rows = settingsStore.rows
      const cols = settingsStore.cols

      // Ищем случайную клетку без мины
      do {
        newRow = Math.floor(Math.random() * rows)
        newCol = Math.floor(Math.random() * cols)
      } while (board.value[newRow][newCol].isMine)

      // Перемещаем мину
      board.value[row][col].isMine = false
      board.value[newRow][newCol].isMine = true

      // Пересчитываем adjacentMines для затронутых клеток
      recalculateAdjacentMines(row, col)
      recalculateAdjacentMines(newRow, newCol)
    }

    const recalculateAdjacentMines = (row, col) => {
      const rows = settingsStore.rows
      const cols = settingsStore.cols

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = row + i
          const newCol = col + j

          if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            // Пересчитываем adjacentMines только если это не мина
            if (!board.value[newRow][newCol].isMine) {
              let adjacentMines = 0
              for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                  if (x === 0 && y === 0) continue
                  const checkRow = newRow + x
                  const checkCol = newCol + y
                  if (
                    checkRow >= 0 &&
                    checkRow < rows &&
                    checkCol >= 0 &&
                    checkCol < cols &&
                    board.value[checkRow][checkCol].isMine
                  ) {
                    adjacentMines++
                  }
                }
              }
              board.value[newRow][newCol].adjacentMines = adjacentMines
            } else {
              board.value[newRow][newCol].adjacentMines = 0 // Если это мина, ставим 0
            }
          }
        }
      }
    }

    const handleCellRightClick = (row, col) => {
      if (gameover.value || board.value[row][col].isVisible) {
        return
      }

      board.value[row][col].isFlagged = !board.value[row][col].isFlagged

      if (board.value[row][col].isFlagged) {
        if (flaggedMines.value > totalMines.value) {
          // Добавлена проверка
          board.value[row][col].isFlagged = false // Отменяем установку флага
          //  Здесь можно добавить какое-то сообщение пользователю, что нельзя установить больше флажков.
        }
      }
    }

    const openAdjacentCells = (row, col) => {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue
          const newRow = row + i
          const newCol = col + j

          if (
            newRow >= 0 &&
            newRow < settingsStore.rows &&
            newCol >= 0 &&
            newCol < settingsStore.cols
          ) {
            if (!board.value[newRow][newCol].isVisible && !board.value[newRow][newCol].isFlagged) {
              handleCellClick(newRow, newCol) // Recursive call
            }
          }
        }
      }
    }

    const checkWin = () => {
      let allNonMineCellsOpen = true
      let cellsToOpen = settingsStore.rows * settingsStore.cols - settingsStore.mines
      let openedCells = 0
      for (let row = 0; row < settingsStore.rows; row++) {
        for (let col = 0; col < settingsStore.cols; col++) {
          if (board.value[row][col].isVisible && !board.value[row][col].isMine) {
            openedCells++
          }
        }
      }
      if (openedCells === cellsToOpen) {
        alert('You Win!') // TODO: Replace with better UI
        gameover.value = true
        stopTimer()
        saveResult()
      }
    }

    const saveResult = () => {
      const name = prompt('Введите ваше имя:') // TODO: Replace with better UI
      if (name) {
        const result = {
          name: name,
          time:
            settingsStore.rows === 8
              ? 600 - timeLeft.value
              : settingsStore.rows === 16
                ? 1200 - timeLeft.value
                : settingsStore.rows === 32
                  ? 1800 - timeLeft.value
                  : 900 - timeLeft.value, // Вычисляем потраченное время
          date: new Date().toLocaleDateString(),
        }

        let results = JSON.parse(localStorage.getItem('minesweeper_results')) || []
        results.push(result)

        // Сортируем результаты по времени
        results.sort((a, b) => a.time - b.time)

        // Ограничиваем количество результатов до 10
        results = results.slice(0, 10)

        localStorage.setItem('minesweeper_results', JSON.stringify(results))
      }
    }

    const restartGame = () => {
      gameover.value = false
      gameStarted.value = false
      timeLeft.value = 0
      stopTimer()
      generateBoard()
      setTimeLimit()
    }

    const goToSettings = () => {
      router.push('/') // Перенаправляем на главный экран (настройки)
    }

    onMounted(() => {
      generateBoard()
      setTimeLimit()
    })

    return {
      settingsStore,
      board,
      handleCellClick,
      handleCellRightClick,
      gameover,
      formattedTime,
      restartGame,
      goToSettings,
      totalMines,
      flaggedMines,
    }
  },
}
</script>
<style scoped>
.game-view-container {
  padding: 20px;
}

.game-title {
  text-align: center;
  color: #333;
}

.game-info {
  margin-bottom: 5px;
  color: #555;
  text-align: center; /*  Центрируем текст */
}
.button-container {
  display: grid;
  place-items: center; /*  Центрируем кнопку по горизонтали и вертикали */
}

.restart-button {
  margin-top: 10px;
  width: 150px; /* Задаем конкретную ширину */
  margin: 0 auto; /*  Центрируем кнопку */
}
</style>
