<script lang="ts" setup>
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons-vue"
import dayjs from "dayjs"
import { Post } from "@/model/QuickType/Post.ts"
import { computed, ref } from "vue"
import { useStore } from "@/tools/store.ts"
import { message } from "ant-design-vue"
import { doAxios } from "@/tools/axios.ts"
import axios from "axios"
import { ForumConfig } from "@/config.ts"

const Level = ForumConfig.Level

const props = defineProps<{
  post: Post
  refPost?: Post | string
}>()

const store = useStore()

const showEditButton = computed(
  () => store.state.user.stuNo === props.post.postSno || store.state.userLevel >= Level.TA,
)
const showDeleteButton = computed(
  () => store.state.user.stuNo === props.post.postSno || store.state.userLevel >= Level.TA,
)

const loading = ref(false)
const replying = ref(false)
const editing = ref(false)

const handleEdit = (newContent: string) => {
  if (newContent.length === 0) {
    message.warn("内容不可为空")
    return
  }
  if (newContent === props.post.postContent) {
    editing.value = false
    return
  }

  let form = new FormData()
  form.append("postId", props.post.postId.toString())
  form.append("content", newContent)

  loading.value = true
  doAxios(
    axios.put("/api/post", form),
    "编辑帖子",
    () => {
      message.success("编辑帖子成功")
      props.post.postContent = newContent
      editing.value = false
    },
    () => (loading.value = false),
  )
}

const handleReply = (content: string) => {
  if (content.length === 0) {
    message.warn("内容不可为空")
    return
  }

  let form = new FormData()
  form.append("postId", props.post.postId.toString())
  form.append("replyContent", content)

  loading.value = true
  doAxios(
    axios.post("/api/post/reply", form),
    "回复发送",
    () => {
      message.success("回复发送成功")
      replying.value = false
      location.reload()
    },
    () => (loading.value = false),
  )
}

const handleDelete = () => {
  Modal.confirm({
    title: "确定要删除吗",
    content: "回复删除后，将对其他学生不可见。",
    onOk() {
      loading.value = true
      doAxios(
        axios.delete("/api/post", { params: { postId: props.post.postId } }),
        "回复帖子",
        () => {
          location.reload()
        },
        () => (loading.value = false),
      )
    },
  })
}

const refHide = ref(true)
const refText = ref<HTMLDivElement | null>(null)
const toggleRefHide = () => {
  if (refHide.value) {
    refText.value?.classList.remove("reference-content-hide")
    refHide.value = false
  } else {
    refText.value?.classList.add("reference-content-hide")
    refHide.value = true
  }
}
</script>

<template>
  <a-card>
    <a-spin :spinning="loading">
      <!--锚点-->
      <div :id="`p${post.postId}`" class="h-0" />

      <!--引用的回复-->
      <div v-if="refPost != undefined" class="reference-box">
        <div v-if="typeof refPost == 'string'">
          <div class="h-[4em] flex flex-col justify-center">
            <i>{{ refPost }}</i>
          </div>
        </div>
        <div v-else>
          <div class="post-content reference-content-hide" v-html="refPost.postContent" ref="refText" />
          <div class="flex flex-col md:flex-row md:gap-5 my-3 text-gray-400">
            <div>
              <clock-circle-outlined />
              {{ dayjs(refPost.postDate).format("lll") }}
            </div>
            <div class="flex gap-1">
              <user-outlined />
              <user-small-profile :uid="refPost.postSno" />
            </div>
            <a @click="toggleRefHide">{{ refHide ? "展开" : "隐藏" }}</a>
          </div>
        </div>
      </div>

      <!--回复-->
      <div>
        <post-content v-if="!editing" :content="post.postContent" />
        <editor-component
          v-else
          :init-content="post.postContent"
          show-cancel
          @cancel="editing = false"
          @submit="handleEdit"
        />
      </div>

      <!--底部信息栏-->
      <div class="flex flex-col md:flex-row md:gap-5 mt-5 text-gray-400">
        <div>
          <clock-circle-outlined />
          {{ dayjs(post.postDate).format("lll") }}
        </div>
        <div class="flex gap-1">
          <user-outlined />
          <user-small-profile :uid="post.postSno" />
        </div>
        <div class="flex gap-3">
          <a class="text-green-700" @click="replying = true">回复</a>
          <a class="text-green-700" v-if="showEditButton" @click="editing = true">编辑</a>
          <div>
            <div v-if="post.postIsDel == '1'" class="text-red-600">
              <i>此回复已被删除</i>
            </div>
            <a class="text-green-700" v-else-if="showDeleteButton" @click="handleDelete">删除</a>
          </div>
        </div>
      </div>

      <!--回复栏-->
      <div v-if="replying">
        <a-divider />
        <editor-component show-cancel @cancel="replying = false" @submit="handleReply" />
      </div>
    </a-spin>
  </a-card>
</template>

<style>
.reference-box {
  @apply bg-green-50 px-5 border border-solid border-green-400 rounded-xl;
}

/*.reference-content-hide {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  max-height: 15em;
  overflow: hidden;
}*/

.reference-content-hide {
  position: relative;
  max-height: 15em;
  overflow: clip;
  z-index: 0;
}

.reference-content-hide::before {
  position: absolute;
  top: calc(15em - 50px);
  left: 0;
  right: 0;
  height: 50px;

  background: linear-gradient(to top, rgb(240 253 244), transparent);
  content: "";
  z-index: 10;
}
</style>
