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
  aspect-ratio: 1 / 1;
  width: v-bind(cellSize + 'px'); /* Динамическая ширина ячейки */
  height: v-bind(cellSize + 'px'); /* Динамическая высота ячейки */
  position: relative;
  box-sizing: border-box; /*  Чтобы border не влиял на размеры */
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
.cell:nth-child(1n).is-visible {
  color: blue;
}
.cell:nth-child(2n).is-visible {
  color: green;
}
.cell:nth-child(3n).is-visible {
  color: red;
}
.cell:nth-child(4n).is-visible {
  color: purple;
}
.cell:nth-child(5n).is-visible {
  color: maroon;
}
.cell:nth-child(6n).is-visible {
  color: teal;
}
.cell:nth-child(7n).is-visible {
  color: black;
}
.cell:nth-child(8n).is-visible {
  color: gray;
}
</style>
