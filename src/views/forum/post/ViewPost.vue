<script lang="ts" setup>
import { DefaultPost, Post } from "@/model/QuickType/Post"
import { doAxios, doAxiosAsync } from "@/tools/axios"
import axios from "axios"
import { computed, onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import {
  CheckOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons-vue"
import dayjs from "dayjs"
import AddComment from "@/components/forum/post/comment/AddComment.vue"
import { useStore } from "@/tools/store.ts"
import EditorComponent from "@/components/forum/post/editor/EditorComponent.vue"
import { message } from "ant-design-vue"
import { Modal } from "ant-design-vue/lib"
import { ForumConfig } from "@/config.ts"
import ChooseTag from "@/components/forum/post/tag/ChooseTag.vue"

const Level = ForumConfig.Level

const route = useRoute()

// 我们把 为了避免学期字符串对路由造成干扰转换的/ 转换回来。
// const id = computed(() => (<String>route.params["id"]).replace(/-/g, "/"))
// 获取当前页面类型
// const type = computed(() => <String | undefined>route.params["type"] ?? "list")
// 获取当前页面的Post Id
const postId = computed(() => <String | undefined>route.params["postId"] ?? "")

const loading = ref(false)
const curPost = ref<Post>(DefaultPost)
const curPosts = ref<Post[]>([])
let postsMap = new Map<number, Post>()
const showHidden = ref(false)

const fetch = async () => {
  loading.value = true
  await doAxiosAsync(
    axios.get("/api/post", { params: { postId: postId.value, showHidden: showHidden.value } }),
    "获取帖子",
    async (res: { posts: Post[] }) => {
      curPost.value = res.posts[0]
      curPosts.value = res.posts.slice(1)

      postsMap.clear()
      curPosts.value.forEach((v) => {
        postsMap.set(v.postId, v)
      })
    },
    async () => {
      loading.value = false
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

const showEditButton = computed(
  () => store.state.user.stuNo === curPost.value.postSno || store.state.userLevel >= Level.TA,
)
const showDeleteButton = computed(
  () => store.state.user.stuNo === curPost.value.postSno || store.state.userLevel >= Level.TA,
)
const showViewHiddenButton = computed(() => store.state.userLevel >= Level.TA)
const showTagChooseButton = computed(() => store.state.userLevel >= Level.TA)
const showAnyButton = computed(
  () => showEditButton.value || showDeleteButton.value || showTagChooseButton.value || showViewHiddenButton.value,
)

// 编辑

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

// 删除

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

// 显示隐藏

const toggleShowHidden = () => {
  showHidden.value = !showHidden.value
  fetch()
}

// 设置标签

const showTagChooseModal = ref(false)
const ct = ref<InstanceType<typeof ChooseTag> | null>(null)
const setTags = () => {
  showTagChooseModal.value = true
}
const setTagsOk = () => {
  let tags = ct.value?.getSelected()
  if (tags) {
    let params = new URLSearchParams()
    params.append("postId", curPost.value.postId.toString())
    tags.forEach((v) => params.append("tag", v))

    loading.value = true
    doAxios(
      axios.put("/api/post/tag", undefined, { params: params }),
      "设置标签",
      () => {
        message.success("设置标签成功")
        location.reload()
      },
      () => (loading.value = false),
    )
  }
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <!--帖子-->
    <a-card>
      <a-spin :spinning="loading">
        <!--帖子标题和时间-->
        <div class="title">
          {{ curPost.postTitle }}
          <post-tags :post="curPost" />
        </div>
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

        <!--帖子内容-->
        <div class="mt-5">
          <div v-if="!editing" class="post-content" v-html="curPost.postContent" />
          <editor-component v-else ref="editor" :height="800" :init-content="curPost.postContent" hide-submit />
        </div>

        <!--工具栏-->
        <post-toolbar v-if="showAnyButton">
          <a-tooltip v-if="showEditButton" title="编辑">
            <div>
              <a-button v-if="!editing" @click="edit">
                <edit-outlined />
              </a-button>
              <a-button v-else type="primary" @click="finishEdit">
                <check-outlined />
              </a-button>
            </div>
          </a-tooltip>

          <a-tooltip v-if="showTagChooseButton" title="设置标签">
            <div>
              <a-button @click="setTags">
                <tags-outlined />
              </a-button>
            </div>
          </a-tooltip>
          <a-modal v-model:open="showTagChooseModal" title="设置标签" @ok="setTagsOk">
            <suspense>
              <div class="flex justify-center my-8">
                <choose-tag :post="curPost" ref="ct" />
              </div>
              <template #fallback>
                <a-skeleton active />
              </template>
            </suspense>
          </a-modal>

          <a-tooltip v-if="showViewHiddenButton" :title="showHidden ? '隐藏已删除的帖子' : '显示已删除的帖子'">
            <div>
              <a-button @click="toggleShowHidden">
                <eye-outlined />
              </a-button>
            </div>
          </a-tooltip>
          <a-tooltip v-if="showDeleteButton" title="删除">
            <div>
              <a-button danger @click="handleDelete">
                <delete-outlined />
              </a-button>
            </div>
          </a-tooltip>
        </post-toolbar>
      </a-spin>
    </a-card>

    <!--回复-->
    <div v-for="post in curPosts" :key="post.postId">
      <reply-component
        :post="post"
        :ref-post="
          post.postAnswerId === curPost.postId ? undefined : postsMap.get(post.postAnswerId) ?? '原帖子已被删除'
        "
      />
    </div>

    <!--发送回复-->
    <add-comment :parent-id="curPost.postId" />
  </div>
</template>

<style lang="scss" scoped>
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
