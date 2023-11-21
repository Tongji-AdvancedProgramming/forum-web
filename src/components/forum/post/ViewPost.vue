<script setup lang="ts">
import { Post } from "@/model/QuickType/Post"
import { doAxios } from "@/tools/axios"
import axios from "axios"
import { onMounted, watch } from "vue"
import { ref } from "vue"
import { computed } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()

// 我们把 为了避免学期字符串对路由造成干扰转换的/ 转换回来。
const id = computed(() => (<String>route.params["id"]).replace(/-/g, "/"))
// 获取当前页面类型
const type = computed(() => <String | undefined>route.params["type"] ?? "list")
// 获取当前页面的Post Id
const postId = computed(() => <String | undefined>route.params["postId"] ?? "")

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

const curReplyPosts = ref<Post[]>([])

const fetch = () => {
  doAxios(
    axios.get("/api/post", { params: { postId: postId.value } }),
    "获取帖子",
    (res: { post: Post; followedPosts: Post[] }) => {
      curPost.value = res.post
      curReplyPosts.value = res.followedPosts
    },
  )
}
watch(postId, fetch)
onMounted(() => {
  fetch()
})
</script>

<template>
  <a-card>
    <div class="title">{{ curPost.postTitle }}</div>
  </a-card>
</template>

<style scoped lang="scss">
.title {
  @apply font-bold;
}
</style>
