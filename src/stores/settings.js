import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    difficulty: 'easy',
    rows: 8,
    cols: 8,
    mines: 10,
  }),
  actions: {
    setDifficulty(difficulty) {
      this.difficulty = difficulty
      switch (difficulty) {
        case 'easy':
          this.rows = 8
          this.cols = 8
          this.mines = 10
          break
        case 'medium':
          this.rows = 16
          this.cols = 16
          this.mines = 40
          break
        case 'hard':
          this.rows = 16
          this.cols = 32
          this.mines = 100
          break
      }
    },
  },
})
