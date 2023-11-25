<script setup lang="ts">
import { doAxios } from "@/tools/axios.ts"
import axios from "axios"
import { message } from "ant-design-vue"
import { ref } from "vue"

const props = defineProps<{
  parentId: number
}>()

const loading = ref(false)
const handleSubmit = (content: string) => {
  let form = new FormData()
  form.append("postId", props.parentId.toString())
  form.append("replyContent", content)

  loading.value = true
  doAxios(
    axios.post("/api/post/reply", form),
    "回复",
    () => {
      message.success("回复成功！")
      location.reload()
    },
    () => (loading.value = false),
  )
}
</script>

<template>
  <a-card>
    <div class="flex flex-col gap-3">
      <div class="font-normal text-xl">添加回复</div>
      <a-spin :spinning="loading">
        <editor-component @submit="handleSubmit" />
      </a-spin>
    </div>
  </a-card>
</template>

<style scoped></style>
