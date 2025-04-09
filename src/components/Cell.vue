<template>
  <button
    class="cell"
    :class="{ 'is-visible': cell.isVisible }"
    @click="$emit('click')"
    @contextmenu="handleRightClick"
  >
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
  background-color: #eee; /* Цвет закрытой клетки */
  flex: 1 0 auto; /*  Важно для правильного распределения места */
  aspect-ratio: 1 / 1; /*  Ячейки всегда квадратные */
}

.cell:hover {
  background-color: #ddd;
}

.cell.is-visible {
  background-color: #fff; /* Цвет открытой клетки */
  border: none;
  cursor: default;
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
