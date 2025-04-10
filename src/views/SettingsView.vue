<template>
  <v-container class="settings-container">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <h1 class="settings-title">Настройки игры</h1>

        <v-radio-group
          v-model="selectedDifficulty"
          label="Выберите уровень сложности"
          class="radio-group"
        >
          <v-radio label="Простой (8x8, 10 мин)" value="easy"></v-radio>
          <v-radio label="Средний (16x16, 40 мин)" value="medium"></v-radio>
          <v-radio label="Сложный (32x16, 100 мин)" value="hard"></v-radio>
        </v-radio-group>

        <v-btn color="success" @click="startGame" class="start-button"> Начать игру </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '../stores/settings'

export default {
  setup() {
    const settingsStore = useSettingsStore()
    const selectedDifficulty = ref(settingsStore.difficulty)
    const router = useRouter()

    const startGame = () => {
      // Сохраняем настройки в Pinia
      settingsStore.setDifficulty(selectedDifficulty.value)

      // Переходим на экран игры
      router.push('/game')
    }

    return {
      selectedDifficulty,
      startGame,
    }
  },
}
</script>

<style scoped>
.settings-container {
  background-color: #f5f5f5;
  padding: 20px;
}

.settings-title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.radio-group .v-radio {
  margin-bottom: 8px;
}

.start-button {
  width: 100%;
  margin-top: 20px;
}
</style>
