import { createRouter, createWebHistory } from "vue-router"

const routes = [
  { path: "/", component: () => import("@/views/home/HomeView.vue") },
  { path: "/login", component: () => import("@/views/login/LoginView.vue") },
  { path: "/forum/:id", component: () => import("@/views/forum/ForumPage.vue") },
  { path: "/forum/:id/:type", component: () => import("@/views/forum/ForumPage.vue") },
  { path: "/forum/:id/:type/:postId", component: () => import("@/views/forum/ForumPage.vue") },
  { path: "/help/login", component: () => import("@/views/help/LoginFaq.vue") },
  { path: "/help/emoji", component: () => import("@/views/help/EmojiView.vue") },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
