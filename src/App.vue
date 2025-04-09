<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title class="app-title">Minesweeper</v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link to="/settings" class="mr-2 app-link">
        <v-icon left>mdi-cog</v-icon>
        Настройки
      </router-link>
      <router-link to="/leaderboard" class="app-link">
        <v-icon left>mdi-trophy</v-icon>
        Таблица лидеров
      </router-link>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style scoped>
.app-title {
  font-family: 'Arial', sans-serif;
  font-size: 24px;
}

.app-link {
  color: white;
  text-decoration: none;
}

.app-link:hover {
  text-decoration: underline;
}
</style>
