<template>
  <v-container>
    <h2>Таблица рекордов</h2>
    <v-table>
      <thead>
        <tr>
          <th>Имя</th>
          <th>Время (сек)</th>
          <th>Дата</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="result in sortedResults" :key="result.name">
          <td>{{ result.name }}</td>
          <td>{{ result.time }}</td>
          <td>{{ result.date }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script>
import { ref, onMounted, computed } from 'vue'

export default {
  setup() {
    const results = ref([])

    onMounted(() => {
      loadResults()
    })

    const loadResults = () => {
      const storedResults = localStorage.getItem('minesweeper_results')
      if (storedResults) {
        results.value = JSON.parse(storedResults)
      }
    }

    const sortedResults = computed(() => {
      return [...results.value].sort((a, b) => a.time - b.time)
    })

    return {
      sortedResults,
    }
  },
}
</script>
