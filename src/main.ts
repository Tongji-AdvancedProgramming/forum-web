import { createApp } from "vue"
import App from "./App.vue"
import "./style.css"
import "animate.css"

import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
import "dayjs/locale/zh-cn"
dayjs.locale("zh-cn")
dayjs.extend(localizedFormat)

import router from "@/tools/router.ts"
import { store } from "@/tools/store.ts"
import "@/tools/icons.ts"
import { OhVueIcon } from "oh-vue-icons"

createApp(App).use(router).use(store).component("v-icon", OhVueIcon).mount("#app")
