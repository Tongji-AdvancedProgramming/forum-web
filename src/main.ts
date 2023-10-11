import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"

import router from "./tools/router.ts"

createApp(App).use(router).mount("#app")
