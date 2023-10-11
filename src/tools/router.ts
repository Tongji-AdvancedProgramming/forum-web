import { createRouter, createWebHistory } from "vue-router"

const routes = [
  { path: "/", component: () => import("@/components/home/HomeView.vue") },
  { path: "/login", component: () => import("@/components/login/LoginView.vue") },
  { path: "/help/login", component: () => import("@/components/help/LoginFaq.vue") },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
