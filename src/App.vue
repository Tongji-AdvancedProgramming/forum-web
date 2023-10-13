<script setup lang="ts">
import antTheme from "./assets/antdv-theme.json"
import { onMounted, ref } from "vue"
import { doAxios } from "@/tools/axios.ts"
import axios from "axios"
import { StudentRaw } from "@/model/QuickType/StudentRaw.ts"
import { useStore } from "vuex"
import { convertToStudent } from "@/model/Student.ts"
import FooterView from "@/components/FooterView.vue"
import InfoCompletionModal from "@/components/user/InfoCompletionModal.vue"

const isMobile = window.innerWidth < 768
const headerHeight = ref(isMobile ? "50px" : "64px")

const infoCompletionOpen = ref(true)

const store = useStore()

onMounted(() => {
  doAxios(axios.get("/api/user"), "检查用户信息", (rawStudent: StudentRaw) => {
    let user = convertToStudent(rawStudent)
    store.commit("setUser", user)
  })
})
</script>

<template>
  <a-config-provider :theme="antTheme">
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
      >
        <div class="">
          <span class="font-light">同济高程论坛</span>
        </div>
      </a-layout-header>
      <a-layout-content>
        <div :style="{ marginTop: headerHeight }">
          <router-view />
        </div>
      </a-layout-content>
      <a-layout-footer :style="{ background: 'transparent' }">
        <footer-view />
      </a-layout-footer>
    </a-layout>

    <info-completion-modal v-model:open="infoCompletionOpen" />
  </a-config-provider>
</template>

<style scoped></style>

<style>
body {
  margin: 0;
  background: rgb(213, 254, 228);
  background: radial-gradient(circle, rgba(213, 254, 228, 1) 0%, rgba(255, 255, 255, 1) 100%);
  min-height: 100vh;

  font-weight: 200;
}
</style>
