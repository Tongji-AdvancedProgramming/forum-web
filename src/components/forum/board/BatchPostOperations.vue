<script setup lang="ts">
import { useStore } from "@/tools/store.ts"
import { computed, ref } from "vue"
import { ForumConfig } from "@/config.ts"
import Level = ForumConfig.Level
import { DeleteOutlined, TagsOutlined, VerticalAlignTopOutlined } from "@ant-design/icons-vue"
import SelectPriority from "@/components/forum/post/priority/SelectPriority.vue"
import { doAxios } from "@/tools/axios.ts"
import axios from "axios"
import { message } from "ant-design-vue"
import ChooseTag from "@/components/forum/post/tag/ChooseTag.vue"
import { Modal } from "ant-design-vue/lib"

const props = defineProps<{
  posts: Set<number>
}>()
const emits = defineEmits<{
  (e: "loading", loading: boolean): void
}>()

const store = useStore()

const hasPermission = computed(() => store.state.userLevel >= Level.TA)
const buttonDisabled = computed(() => props.posts.size == 0)

/* 标签 */
const showTagChooseButton = computed(() => store.state.userLevel >= Level.TA)
const showTagChooseModal = ref(false)
const ct = ref<InstanceType<typeof ChooseTag> | null>(null)
const setTags = () => {
  showTagChooseModal.value = true
}
const setTagsOk = () => {
  let tags = ct.value?.getSelected()
  if (tags) {
    let params = new URLSearchParams()
    props.posts.forEach((v) => params.append("postId", v.toString()))
    tags.forEach((v) => params.append("tag", v))

    emits("loading", true)
    doAxios(
      axios.put("/api/post/tag", undefined, { params: params }),
      "批量设置标签",
      () => {
        message.success("批量设置标签成功，刷新页面即可看到")
        location.reload()
      },
      () => emits("loading", false),
    )
  }
}

/* 置顶 */
const showPrioritySelectButton = computed(() => store.state.userLevel >= Level.TA)
const sp = ref<InstanceType<typeof SelectPriority> | null>(null)
const showPrioritySelectModal = ref(false)
const setPriority = () => {
  showPrioritySelectModal.value = true
}
const setPriorityOk = () => {
  let p = sp.value?.getPriority()
  if (p == null) return

  let params = new URLSearchParams()
  params.append("priority", p.toString())
  props.posts.forEach((v) => params.append("postId", v.toString()))

  emits("loading", true)
  doAxios(
    axios.put("/api/post/priority", undefined, { params: params }),
    "批量设置置顶",
    () => {
      message.success("批量设置置顶成功，刷新页面即可看到")
      showPrioritySelectModal.value = false
    },
    () => emits("loading", false),
  )
}

/* 删除 */
const showDeleteButton = computed(() => store.state.userLevel >= Level.TA)
const handleDelete = () => {
  Modal.confirm({
    title: "确定要删除吗",
    content: "帖子删除后，将对其他学生不可见，但助教和教师仍可看到帖子。",
    onOk() {
      let params = new URLSearchParams()
      props.posts.forEach((v) => params.append("postId", v.toString()))

      emits("loading", true)
      doAxios(
        axios.delete("/api/post", { params: params }),
        "批量删除帖子",
        () => {
          message.success("批量删除帖子成功，刷新页面即可看到")
        },
        () => emits("loading", false),
      )
    },
  })
}
</script>

<template>
  <div v-if="hasPermission" class="flex gap-3">
    <a-tooltip v-if="showTagChooseButton" title="设置标签">
      <div>
        <a-button @click="setTags" :disabled="buttonDisabled">
          <tags-outlined />
        </a-button>
      </div>
    </a-tooltip>
    <a-modal v-model:open="showTagChooseModal" title="设置标签" @ok="setTagsOk">
      <suspense>
        <div class="flex justify-center my-8">
          <choose-tag ref="ct" />
        </div>
        <template #fallback>
          <a-skeleton active />
        </template>
      </suspense>
    </a-modal>

    <a-tooltip v-if="showPrioritySelectButton" title="设置置顶">
      <div>
        <a-button @click="setPriority" :disabled="buttonDisabled">
          <vertical-align-top-outlined />
        </a-button>
      </div>
    </a-tooltip>
    <a-modal v-model:open="showPrioritySelectModal" title="设置置顶" @ok="setPriorityOk">
      <select-priority ref="sp" :cur-priority="0" />
    </a-modal>

    <a-tooltip v-if="showDeleteButton" title="删除">
      <div>
        <a-button danger @click="handleDelete" :disabled="buttonDisabled">
          <delete-outlined />
        </a-button>
      </div>
    </a-tooltip>
  </div>
</template>

<style scoped></style>
