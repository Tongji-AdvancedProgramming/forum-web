<script setup lang="ts">
import { doAxios } from "@/tools/axios.ts"
import axios from "axios"
import { ref, defineAsyncComponent, computed } from "vue"
import { message } from "ant-design-vue"
import { useRoute } from "vue-router"
import router from "@/tools/router"

const route = useRoute()
const boardId = computed(() => (<string>route.params["id"]).replace(/-/g, "/"))
const boardIdRaw = computed(() => <string>route.params["id"])

const loading = ref(false)
const title = ref("")

const send = (content: string) => {
  if (content.length == 0) {
    message.warn("内容不能为空")
    return
  } else if (title.value.length == 0) {
    message.warn("标题不能为空")
    return
  }

  let form = new FormData()
  form.append("boardId", boardId.value)
  form.append("title", title.value)
  form.append("content", content)

  loading.value = true
  doAxios(
    axios.post("/api/post", form),
    "发送帖子",
    () => {
      message.success("发送成功")
      router.push(`/forum/${boardIdRaw.value}`)
    },
    () => (loading.value = false),
  )
}
</script>

<template>
  <a-spin :spinning="loading">
    <a-card>
      <div>
        <div class="flex gap-3 text-sm font-bold mb-3">
          <div class="">标题</div>
          <a>标题指南</a>
          <a>提问的艺术</a>
        </div>
        <a-input v-model:value="title" class="h-[50px]" />
      </div>
      <a-divider />
      <div>
        <div class="text-sm font-bold mb-3">编辑内容</div>
        <EditorComponent :height="800" @submit="send" />
      </div>
    </a-card>
  </a-spin>
</template>

<style scoped></style>
