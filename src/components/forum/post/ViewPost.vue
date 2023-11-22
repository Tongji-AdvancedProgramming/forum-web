<script setup lang="ts">
import { Post } from "@/model/QuickType/Post"
import { doAxios } from "@/tools/axios"
import axios from "axios"
import { onMounted, watch } from "vue"
import { ref } from "vue"
import { computed } from "vue"
import { useRoute } from "vue-router"
import Prism from "prismjs"
import { nextTick } from "vue"

const route = useRoute()

// 我们把 为了避免学期字符串对路由造成干扰转换的/ 转换回来。
const id = computed(() => (<String>route.params["id"]).replace(/-/g, "/"))
// 获取当前页面类型
const type = computed(() => <String | undefined>route.params["type"] ?? "list")
// 获取当前页面的Post Id
const postId = computed(() => <String | undefined>route.params["postId"] ?? "")

const loading = ref(false)
const curPost = ref<Post>({
  postId: 0,
  postTerm: "",
  postCcode: "",
  postHwupOrHwId: "",
  postWeek: 0,
  postChapter: 0,
  postAnswerId: 0,
  postType: "",
  postSno: "",
  postPriority: "",
  postTag01: "0",
  postTag02: "0",
  postTag03: "0",
  postTag04: "0",
  postTag05: "0",
  postTag06: "0",
  postTag07: "0",
  postTag08: "0",
  postTag09: "0",
  postTag10: "0",
  postTitle: "",
  postContent: "",
  postDate: new Date(),
  postIsDel: "0",
  postComment: "",
})
const curPosts = ref<Post[]>([])

const fetch = () => {
  loading.value = true
  doAxios(
    axios.get("/api/post", { params: { postId: postId.value } }),
    "获取帖子",
    (res: { posts: Post[] }) => {
      curPost.value = res.posts[0]
      curPosts.value = res.posts.slice(1)
      nextTick(() => {
        console.log("Prism:", Prism)
        Prism.highlightAll(false,(e)=>console.log(e))
      })
    },
    () => (loading.value = false),
  )
}
watch(postId, fetch)
onMounted(() => {
  fetch()
})
</script>

<template>
  <div v-if="loading">
    <a-skeleton active />
    <a-skeleton active />
    <a-skeleton active />
  </div>
  <div v-else>
    <a-card>
      <div class="title">{{ curPost.postTitle }}</div>
      <a-divider />
      <div v-html="curPost.postContent" class="post-content" />
    </a-card>
  </div>
</template>

<style scoped lang="scss">
.title {
  @apply font-normal text-3xl;
}
</style>

<style lang="scss">
.post-content {
  @import "@/assets/post.scss";

  @media (min-width: 1280px) {
    max-width: 825px;
  }

  @media (min-width: 1536px) {
    max-width: 1024px;
  }
}
</style>
