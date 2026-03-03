import { createRouter, createWebHistory } from 'vue-router'
import StlVisualizer from '../views/StlVisualizer/StlVisualizer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'StlVisualizer',
      component: StlVisualizer,
    },
  ],
})

export default router
