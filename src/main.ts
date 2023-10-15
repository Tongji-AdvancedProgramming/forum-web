import { createApp } from "vue"
import App from "./App.vue"
import "./style.css"
import "animate.css"

import router from "@/tools/router.ts"
import { store } from "@/tools/store.ts"
import "@/tools/icons.ts"
import { OhVueIcon } from "oh-vue-icons"

createApp(App).use(router).use(store).component("v-icon", OhVueIcon).mount("#app")
