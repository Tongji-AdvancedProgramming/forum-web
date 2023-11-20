<script setup lang="ts">
import { Board } from "@/model/QuickType/Board.ts"
import { doAxios } from "@/tools/axios.ts"
import axios from "axios"
import { onMounted, ref, watch } from "vue"
import { Post } from "@/model/QuickType/Post.ts"

interface Props {
  board: Board
}

const props = defineProps<Props>()

const posts = ref<Post[]>()

const fetch = () => {
  let id = props.board.id
  if (id != undefined && id.length > 0)
    doAxios(axios.get("/api/post", { params: { boardId: id } }), "获取帖子", (_posts: Post[]) => {
      posts.value = _posts
    })
}
watch(props.board, fetch)
onMounted(() => {
  fetch()
})
</script>

<template>
  <a-card>
    <div class="text-sm font-bold">所有帖子</div>
    <div class="mt-3 flex flex-col gap-3">
      <div v-for="post in posts" :key="post.postId">{{ JSON.stringify(post) }}</div>
    </div>
  </a-card>
</template>

<style scoped></style>
