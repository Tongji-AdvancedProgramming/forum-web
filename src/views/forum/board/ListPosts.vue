<script setup lang="ts">
import { Board } from "@/model/QuickType/Board.ts"
import { doAxios } from "@/tools/axios.ts"
import axios from "axios"
import { computed, onMounted, ref, watch } from "vue"
import { Post } from "@/model/QuickType/Post.ts"
import dayjs from "dayjs"
import { useRoute } from "vue-router"
import { PlusOutlined } from "@ant-design/icons-vue"
import router from "@/tools/router"

const route = useRoute()
const boardId = computed(() => <String>route.params["id"])

interface Props {
  board: Board
}
const props = defineProps<Props>()

const posts = ref<Post[]>()

const fetch = () => {
  let id = props.board.id
  if (id != undefined && id.length > 0)
    doAxios(axios.get("/api/post/list", { params: { boardId: id } }), "获取帖子", (_posts: Post[]) => {
      posts.value = _posts
    })
}
watch(props.board, fetch)
onMounted(() => {
  fetch()
})

const postNew = () => {
  router.push(`/forum/${boardId.value}/new`)
}
</script>

<template>
  <a-card>
    <div class="text-lg font-normal">所有帖子</div>
    <div class="mt-6 flex gap-3">
      <!-- <div class="grow"/> -->
      <a-button type="primary" @click="postNew"><PlusOutlined/> 发布新帖子</a-button>
    </div>
    <div class="flex flex-col gap-3">
      <a-list item-layout="horizontal" :data-source="posts">
        <template #renderItem="{ item }: { item: Post }">
          <a-list-item>
            <a-list-item-meta>
              <template #title>
                <a :href="`/forum/${boardId}/post/${item.postId}`">{{ item.postTitle }}</a>
              </template>
              <template #description>
                <div class="flex flex-col md:flex-row md:gap-3">
                  <div>{{ dayjs(item.postDate).format("lll") }}</div>
                  <div>發送者：Cinea醬</div>
                </div>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </a-card>
</template>

<style scoped></style>
