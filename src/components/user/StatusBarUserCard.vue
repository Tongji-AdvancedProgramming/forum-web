<script setup lang="ts">
import { useStore } from "vuex"
import { ref } from "vue"
import { getStudentString } from "@/model/Student.ts"
import { doAxios } from "@/tools/axios.ts"
import axios from "axios"

const store = useStore()

const showNickname = ref(true)

const logout = () => {
  doAxios(axios.post("/api/logout", {}, { withCredentials: true }), "登出", () => {
    store.commit("logOut")
    location.reload()
  })
}
</script>

<template>
  <div>
    <div v-if="store.state.loggedIn">
      <a-dropdown>
        <div class="flex items-center hover:drop-shadow-lg hover:cursor-pointer duration-300">
          <a-avatar>
            <template #icon><img :src="store.state.userInfo.avatar" alt="" /></template>
          </a-avatar>
          <div class="flex flex-col ml-1">
            <div v-if="showNickname">{{ store.state.userInfo.nickname }}</div>
            <div v-else>{{ getStudentString(store.state.user) }}</div>
          </div>
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a href="javascript:">个人中心</a>
            </a-menu-item>
            <a-menu-item>
              <a @click="logout">退出登录</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <div v-else>
      <a class="text-black" href="/login">未登录</a>
    </div>
  </div>
</template>

<style scoped></style>
