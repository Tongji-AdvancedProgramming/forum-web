import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"

import router from "@/tools/router.ts"
import { store } from "@/tools/store.ts"

createApp(App).use(router).use(store).mount("#app")
