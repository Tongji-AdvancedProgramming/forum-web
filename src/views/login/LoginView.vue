<script setup lang="ts">
import { ref } from "vue"
import { message } from "ant-design-vue"
import axios from "axios"
import { doAxios } from "@/tools/axios.ts"
import { useRouter } from "vue-router"
import { ForumConfig } from "@/config.ts"
import App = ForumConfig.App

const baseUrl = ref(App.BaseUrl)

interface LoginData {
  username: string
  password: string
  code: string
}

const loginData = ref<LoginData>({ code: "", password: "", username: "" })

const router = useRouter()

const handleLogin = () => {
  if (
    loginData.value.password.length == 0 ||
    loginData.value.username.length == 0 ||
    loginData.value.code.length == 0
  ) {
    message.warn("您有字段未填写")
    return
  }

  let form = new FormData()
  form.append("username", loginData.value.username)
  form.append("password", loginData.value.password)
  form.append("code", loginData.value.code)

  doAxios(axios.post("/api/login", form, { withCredentials: true }), "登录", () => {
    message.success("登录成功")
    router.push("/").then(() => location.reload())
  })
}

const showTips = ref(false)
</script>

<template>
  <div>
    <div class="mt-10 lg:mt-32">
      <div class="flex">
        <div class="grow" />
        <div class="flex flex-col gap-5 items-center max-w-[280px]">
          <div class="text-3xl lg:text-5xl">登录到论坛</div>
          <div class="mt-5 text-center">本系统与交作业网站相连接，请使用交作业网站账号密码登录。</div>
          <div class="flex flex-col gap-5 mt-10 w-[200px] md:w-[300px] lg:w-[300px]">
            <a-input v-model:value="loginData.username" placeholder="学号" size="large" class="md:h-[50px]" />
            <a-input-password v-model:value="loginData.password" placeholder="密码" size="large" class="md:h-[50px]" />
            <div class="flex gap-5">
              <a-input v-model:value="loginData.code" placeholder="验证码" size="large" class="md:h-[50px]" />
              <img :src="`${baseUrl}/api/captcha`" alt="Captcha" class="w-[100px] md:w-auto" />
            </div>
            <a-button size="large" type="primary" class="mt-6 font-light" @click="handleLogin">登录！</a-button>
          </div>
          <a class="mt-5 text-center text-green-900" @click="showTips = true">注册/忘记密码</a>
          <a-alert v-if="showTips">
            <template #message>
              目前本网站未开放注册功能，已选课同学和助教请使用交作业网站的账号密码登录；
              未选课同学暂时无法使用，敬请谅解。 如您忘记密码，请联系教师重置密码。如需要更改密码，
              直接前往交作业网站更改即可。
            </template>
          </a-alert>
        </div>
        <div class="grow" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
