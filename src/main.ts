import { createApp } from "vue"
import App from "./App.vue"
import "./style.css"

import "animate.css"
import "prismjs/themes/prism-coy.min.css"
import "prismjs/plugins/line-numbers/prism-line-numbers.min.css"
import "prismjs/plugins/toolbar/prism-toolbar.min.css"

import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
import "dayjs/locale/zh-cn"
dayjs.locale("zh-cn")
dayjs.extend(localizedFormat)

import router from "@/tools/router.ts"
import { store, key } from "@/tools/store.ts"
import "@/tools/icons.ts"
import { OhVueIcon } from "oh-vue-icons"

createApp(App).use(router).use(store, key).component("v-icon", OhVueIcon).mount("#app")
