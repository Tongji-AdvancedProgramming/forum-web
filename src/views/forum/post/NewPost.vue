<script setup lang="ts">
import { doAxios } from "@/tools/axios.ts"
import axios from "axios"
import { ref, defineAsyncComponent, computed } from "vue"
import { message } from "ant-design-vue"
import { Board } from "@/model/QuickType/Board.ts"
import { useRoute } from "vue-router"
import router from "@/tools/router"

const route = useRoute()
const boardId = computed(() => <String>route.params["id"])

const TinyMceEditor = defineAsyncComponent(() => import("@/components/forum/editor/TinyMceEditor.vue"))

interface Props {
  board: Board
}

const props = defineProps<Props>()

const title = ref("")
const mceContent = ref("")

const send = () => {
  if (mceContent.value.length > 0) {
    let content = mceContent.value

    if (content.length == 0) {
      message.warn("内容不能为空")
      return
    } else if (title.value.length == 0) {
      message.warn("标题不能为空")
      return
    }

    let form = new FormData()
    form.append("boardId", props.board.id)
    form.append("title", title.value)
    form.append("content", content)

    doAxios(axios.post("/api/post", form), "发送帖子", () => {
      message.success("发送成功")
      router.push(`/forum/${boardId.value}`)
    })
  }
}
</script>

<template>
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
      <CommentComponent />
    </div>
  </a-card>
</template>

<style scoped></style>
