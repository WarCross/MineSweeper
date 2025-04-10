// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { createPinia } from 'pinia' // Импортируем createPinia

const pinia = createPinia() // Создаем экземпляр Pinia

createApp(App)
  .use(router)
  .use(vuetify)
  .use(pinia) // Используем Pinia
  .mount('#app')
