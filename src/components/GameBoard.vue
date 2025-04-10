<template>
  <div class="game-board">
    <div v-for="(row, rowIndex) in board" :key="rowIndex" class="game-row">
      <Cell
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        :cell="cell"
        @click="handleClick(rowIndex, colIndex)"
        @rightclick="handleRightClick(rowIndex, colIndex)"
      />
    </div>
  </div>
</template>

<script>
import Cell from './Cell.vue'

export default {
  components: {
    Cell,
  },
  props: {
    board: {
      type: Array,
      required: true,
    },
  },
  emits: ['click', 'rightclick'],
  methods: {
    handleClick(row, col) {
      this.$emit('click', row, col)
    },
    handleRightClick(row, col) {
      this.$emit('rightclick', row, col)
    },
  },
}
</script>

<style scoped>
.game-board {
  border: 1px solid #000;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 320px;
  margin: 20px auto;
}

.game-row {
  display: flex;
}
</style>
