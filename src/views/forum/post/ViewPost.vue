<script lang="ts" setup>
import { DefaultPost, Post } from "@/model/QuickType/Post"
import { doAxios, doAxiosAsync } from "@/tools/axios"
import axios from "axios"
import { computed, onMounted, ref, watch } from "vue"
import { useRoute } from "vue-router"
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  TagsOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons-vue"
import AddComment from "@/components/forum/post/comment/AddComment.vue"
import { useStore } from "@/tools/store.ts"
import EditorComponent from "@/components/forum/post/editor/EditorComponent.vue"
import SelectPriority from "@/components/forum/post/priority/SelectPriority.vue"
import { message } from "ant-design-vue"
import { Modal } from "ant-design-vue/lib"
import { ForumConfig } from "@/config.ts"
import ChooseTag from "@/components/forum/post/tag/ChooseTag.vue"
import PostMetaData from "@/components/forum/post/PostMetaData.vue"

const Level = ForumConfig.Level

const route = useRoute()
const store = useStore()

// 我们把 为了避免学期字符串对路由造成干扰转换的/ 转换回来。
// const id = computed(() => (<String>route.params["id"]).replace(/-/g, "/"))
// 获取当前页面类型
// const type = computed(() => <String | undefined>route.params["type"] ?? "list")
// 获取当前页面的Post Id
const postId = computed(() => <String | undefined>route.params["postId"] ?? "")

watch(postId, () => {
  console.log("Post Id Changed!", postId.value)
  fetch()
})

const notNull = ref(false)
const loading = ref(false)
const curPost = ref<Post>(DefaultPost)
const curPosts = ref<Post[]>([])
let postsMap = new Map<number, Post>()
const showHidden = ref(false)

const fetch = async () => {
  if (postId.value.length == 0) {
    return
  }

  loading.value = true
  await doAxiosAsync(
    axios.get("/api/post", { params: { postId: postId.value, showHidden: showHidden.value } }),
    "获取帖子",
    async (res: { posts: Post[] }) => {
      if (res.posts.length > 0) {
        notNull.value = true
        curPost.value = res.posts[0]
        curPosts.value = res.posts.slice(1)

        postsMap.clear()
        curPosts.value.forEach((v) => {
          postsMap.set(v.postId, v)
        })
      }
    },
    async () => {
      loading.value = false
    },
  )
}
await fetch()

if (!notNull.value) {
  if (store.state.userLevel >= Level.TA) {
    // 疑似已被删除的帖子，重试一次
    showHidden.value = true
    await fetch()
  }
  if (!notNull.value) {
    message.error("帖子不存在")
    history.back()
  }
}

const showEditButton = computed(
  () => store.state.user.stuNo === curPost.value.postSno || store.state.userLevel >= Level.TA,
)
const showDeleteButton = computed(
  () => store.state.user.stuNo === curPost.value.postSno || store.state.userLevel >= Level.TA,
)
const showViewHiddenButton = computed(() => store.state.userLevel >= Level.TA)
const showTagChooseButton = computed(() => store.state.userLevel >= Level.TA)
const showPrioritySelectButton = computed(() => store.state.userLevel >= Level.TA)
const showAnyButton = computed(
  () =>
    showEditButton.value ||
    showDeleteButton.value ||
    showTagChooseButton.value ||
    showViewHiddenButton.value ||
    showPrioritySelectButton.value,
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

// 设置置顶

const sp = ref<InstanceType<SelectPriority> | null>(null)
const showPrioritySelectModal = ref(false)
const setPriority = () => {
  showPrioritySelectModal.value = true
}
const setPriorityOk = () => {
  let p = sp.value?.getPriority()
  if (p == null) return

  loading.value = true
  doAxios(
    axios.put("/api/post/priority", undefined, {
      params: {
        postId: curPost.value.postId,
        priority: p.toString(),
      },
    }),
    "设置置顶",
    () => {
      message.success("设置置顶成功")
      showPrioritySelectModal.value = false
    },
    () => (loading.value = false),
  )
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
        <post-meta-data :post="curPost" class="mt-2" />

        <!--帖子内容-->
        <div class="mt-5">
          <post-content v-if="!editing" :content="curPost.postContent" />
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
                <choose-tag ref="ct" :post="curPost" />
              </div>
              <template #fallback>
                <a-skeleton active />
              </template>
            </suspense>
          </a-modal>

          <a-tooltip v-if="showPrioritySelectButton" title="设置置顶">
            <div>
              <a-button @click="setPriority">
                <vertical-align-top-outlined />
              </a-button>
            </div>
          </a-tooltip>
          <a-modal v-model:open="showPrioritySelectModal" title="设置置顶" @ok="setPriorityOk">
            <select-priority ref="sp" :cur-priority="Number(curPost.postPriority)" />
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
    <add-comment v-if="curPost.postIsDel == '0'" :parent-id="curPost.postId" />
  </div>
</template>

<style lang="scss" scoped>
.title {
  @apply font-normal text-3xl;
}
</style>
