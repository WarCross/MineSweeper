<template>
  <button
    class="cell"
    :class="{
      'is-visible': cell.isVisible,
    }"
    @click="$emit('click')"
    @contextmenu="handleRightClick"
  >
    <span class="cell-content">
      <span :class="cellValueClass">
        {{
          cell.isVisible
            ? cell.isMine
              ? '💣'
              : cell.adjacentMines > 0
                ? cell.adjacentMines
                : ''
            : cell.isFlagged
              ? '🚩'
              : ''
        }}
      </span>
    </span>
  </button>
</template>

<script>
export default {
  props: {
    cell: {
      type: Object,
      required: true,
    },
  },
  emits: ['click', 'rightclick'],
  computed: {
    cellValueClass() {
      if (!this.cell.isVisible) return ''
      if (this.cell.isMine) return '' // Для мины нет цвета
      switch (this.cell.adjacentMines) {
        case 1:
          return 'mine-count-1'
        case 2:
          return 'mine-count-2'
        case 3:
          return 'mine-count-3'
        case 4:
          return 'mine-count-4'
        case 5:
          return 'mine-count-5'
        case 6:
          return 'mine-count-6'
        case 7:
          return 'mine-count-7'
        case 8:
          return 'mine-count-8'
        default:
          return ''
      }
    },
  },
  methods: {
    handleRightClick(event) {
      event.preventDefault() // Prevent default context menu
      this.$emit('rightclick')
    },
  },
}
</script>

<style scoped>
.cell {
  border: 1px solid #ccc;
  font-size: 1.2rem;
  text-align: center;
  cursor: pointer;
  background-color: #eee;
  flex: 1 0 auto;
  aspect-ratio: 1 / 1; /* Соотношение сторон 1:1 */
  width: v-bind(cellSize + 'px'); /* Динамическая ширина ячейки */
  height: v-bind(cellSize + 'px'); /* Динамическая высота ячейки */
  position: relative;
  box-sizing: border-box; /* Чтобы border не влиял на размеры */
}

.cell:hover {
  background-color: #ddd;
}

.cell-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  font-size: 1em; /* Фиксированный размер шрифта */
  box-sizing: border-box;
}

.cell.is-visible {
  background-color: #fff;
  font-size: 1em; /* Фиксированный размер шрифта для открытых ячеек */
}

/* Цвета для чисел */
.mine-count-1 {
  color: blue;
}
.mine-count-2 {
  color: green;
}
.mine-count-3 {
  color: red;
}
.mine-count-4 {
  color: darkblue;
}
.mine-count-5 {
  color: brown;
}
.mine-count-6 {
  color: turquoise;
}
.mine-count-7 {
  color: black;
}
.mine-count-8 {
  color: white;
}
</style>
