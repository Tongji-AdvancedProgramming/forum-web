<script setup lang="ts">
import antTheme from "./assets/antdv-theme.json"
import { computed, h, onMounted, ref } from "vue"
import { doAxios } from "@/tools/axios.ts"
import axios from "axios"
import { StudentRaw } from "@/model/QuickType/StudentRaw.ts"
import { useStore } from "@/tools/store"
import { convertToStudent } from "@/model/Student.ts"
import FooterView from "@/views/FooterView.vue"
import { StudentInfo } from "@/model/QuickType/StudentInfo.ts"
import StatusBarUserCard from "@/components/user/global/StatusBarUserCard.vue"
import { useRoute } from "vue-router"
import CNLocale from "ant-design-vue/es/locale/zh_CN"
import { SearchOutlined } from "@ant-design/icons-vue"
import { useWindowSize } from "@vueuse/core/index"

const windowSize = useWindowSize()

const isMobile = computed(() => windowSize.width.value < 768)
const headerHeight = computed(() => (isMobile.value ? "50px" : "64px"))

const store = useStore()
const route = useRoute()

onMounted(() => {
  if (route.path !== "/help/login") {
    doAxios(axios.get("/api/user"), "检查用户信息", (rawStudent: StudentRaw) => {
      let user = convertToStudent(rawStudent)
      store.commit("setUser", user)
      doAxios(axios.get("/api/user/info"), "获取用户论坛信息", (rawStudentInfo: StudentInfo) => {
        store.commit("setUserInfo", rawStudentInfo)
      })
    })
  }
})

/* 搜索（做一些处理以改善移动端体验） */
const searching = ref(false)
</script>

<template>
  <a-config-provider :theme="antTheme" :locale="CNLocale">
    <a-layout :style="{ background: 'transparent' }">
      <a-layout-header
        :style="{
          position: 'fixed',
          zIndex: 1,
          width: '100%',
          background: '#fff',
          paddingInline: '20px',
          height: headerHeight,
          lineHeight: headerHeight,
        }"
        class="shadow"
      >
        <div v-if="searching">
          <inline-search-box @blur="searching = false" />
        </div>
        <div v-else class="flex items-center">
          <span class="font-light">同济高程论坛</span>
          <inline-search-box class="ml-10 hidden md:inline" />
          <a-button shape="circle" :icon="h(SearchOutlined)" class="ml-3 md:hidden" @click="searching = true" />
          <div class="grow" />
          <status-bar-user-card />
        </div>
      </a-layout-header>
      <a-layout-content>
        <div :style="{ marginTop: headerHeight }">
          <suspense>
            <router-view />
          </suspense>
        </div>
      </a-layout-content>
      <a-layout-footer :style="{ background: 'transparent' }">
        <footer-view />
      </a-layout-footer>
    </a-layout>
  </a-config-provider>
</template>

<style scoped></style>

<style>
body {
  margin: 0;
  background: rgb(213, 254, 228);
  background: radial-gradient(circle, rgba(213, 254, 228, 1) 0%, rgba(255, 255, 255, 1) 100%);
  background-attachment: fixed;
  min-height: 100vh;

  font-weight: 200;
}
</style>
