import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/index.vue'
import MeteorsGame from '@/views/MeteorsGame.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/meteors',
    name: 'meteors',
    component: MeteorsGame
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
