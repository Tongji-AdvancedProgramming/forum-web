<script setup lang="ts">
import { Post } from "@/model/QuickType/Post"
import { doAxios, doAxiosAsync } from "@/tools/axios"
import axios from "axios"
import { defineAsyncComponent, ref } from "vue"
import { computed } from "vue"
import { useRoute } from "vue-router"
import { onMounted } from "vue"
import { ClockCircleOutlined, UserOutlined, EditOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons-vue"
import dayjs from "dayjs"
import AddComment from "@/components/forum/post/comment/AddComment.vue"
import { useStore } from "@/tools/store.ts"
import EditorComponent from "@/components/forum/post/editor/EditorComponent.vue"
import { message } from "ant-design-vue"
import { Modal, Spin } from "ant-design-vue/lib"

const route = useRoute()

// 我们把 为了避免学期字符串对路由造成干扰转换的/ 转换回来。
// const id = computed(() => (<String>route.params["id"]).replace(/-/g, "/"))
// 获取当前页面类型
// const type = computed(() => <String | undefined>route.params["type"] ?? "list")
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
let postsMap = new Map<number, Post>()

const fetch = async () => {
  await doAxiosAsync(
    axios.get("/api/post", { params: { postId: postId.value } }),
    "获取帖子",
    async (res: { posts: Post[] }) => {
      curPost.value = res.posts[0]
      curPosts.value = res.posts.slice(1)
      curPosts.value.forEach((v) => {
        postsMap.set(v.postId, v)
      })
    },
  )
}
await fetch()

onMounted(() => {
  import("@/tools/prism").then((Prism) => {
    Prism.default.highlightAll()
  })
})

const store = useStore()

const showEditButton = computed(() => store.state.user.stuNo === curPost.value.postSno || store.state.userLevel > 0)
const showDeleteButton = computed(() => store.state.user.stuNo === curPost.value.postSno || store.state.userLevel >= 4)
const showAnyButton = computed(() => showEditButton || showDeleteButton)

const editor = ref<InstanceType<typeof EditorComponent> | null>(null)
const editing = ref(false)
const edit = () => {
  editing.value = true
}
const finishEdit = () => {
  let newContent = editor.value?.getContent() ?? ""
  if (newContent.length === 0) {
    message.warn("内容不可为空")
    return
  }
  if (newContent === curPost.value.postContent) {
    editing.value = false
    return
  }

  let form = new FormData()
  form.append("postId", curPost.value.postId.toString())
  form.append("content", newContent)

  loading.value = true
  doAxios(
    axios.put("/api/post", form),
    "编辑帖子",
    () => {
      message.success("编辑帖子成功")
      curPost.value.postContent = newContent
      editing.value = false
    },
    () => (loading.value = false),
  )
}

const handleDelete = () => {
  Modal.confirm({
    title: "确定要删除吗",
    content: "帖子删除后，将对其他学生不可见。",
    onOk() {
      loading.value = true
      doAxios(
        axios.delete("/api/post", { params: { postId: curPost.value.postId } }),
        "删除帖子",
        () => {
          history.back()
        },
        () => (loading.value = false),
      )
    },
  })
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <a-card>
      <a-spin :spinning="loading">
        <div class="title">{{ curPost.postTitle }}</div>
        <div class="flex flex-col md:flex-row md:gap-5 mt-2 text-gray-400">
          <div>
            <clock-circle-outlined />
            {{ dayjs(curPost.postDate).format("lll") }}
          </div>
          <div class="flex gap-1">
            <user-outlined />
            <user-small-profile :uid="curPost.postSno" />
          </div>
        </div>
        <div class="mt-5">
          <div v-if="!editing" v-html="curPost.postContent" class="post-content" />
          <editor-component v-else hide-submit :init-content="curPost.postContent" :height="800" ref="editor" />
        </div>
        <post-toolbar v-if="showAnyButton">
          <a-tooltip title="编辑" v-if="showEditButton">
            <div>
              <a-button v-if="!editing" @click="edit"><edit-outlined /> </a-button>
              <a-button v-else type="primary" @click="finishEdit"><check-outlined /> </a-button>
            </div>
          </a-tooltip>
          <a-tooltip title="删除" v-if="showDeleteButton">
            <div>
              <a-button danger @click="handleDelete"><delete-outlined /> </a-button>
            </div>
          </a-tooltip>
        </post-toolbar>
      </a-spin>
    </a-card>

    <div v-for="post in curPosts" :key="post.postId">
      <reply-component
        :post="post"
        :ref-post="post.postAnswerId === curPost.postId ? undefined : postsMap.get(post.postAnswerId)"
      />
    </div>
    <add-comment :parent-id="curPost.postId" />
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
