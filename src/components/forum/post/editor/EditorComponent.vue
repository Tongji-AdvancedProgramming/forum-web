<script lang="ts" setup>
import { defineAsyncComponent, ref } from "vue"
import { message } from "ant-design-vue"
import { QuestionCircleOutlined } from "@ant-design/icons-vue"

const props = withDefaults(
  defineProps<{
    height?: number
    initContent?: string
    hideSubmit?: boolean
    showCancel?: boolean
  }>(),
  {
    height: 300,
    initContent: "",
    hideSubmit: false,
    showCancel: false,
  },
)

const emits = defineEmits<{
  (e: "submit", content: string): void
  (e: "cancel"): void
}>()

const tinyMceEditor = defineAsyncComponent(() => import("@/components/forum/post/editor/TinyMceEditor.vue"))

const content = ref(props.initContent)

const handleSubmit = () => {
  if (content.value.length == 0) {
    message.warn("内容不能为空！")
    return
  }
  emits("submit", content.value)
}
const handleCancel = () => {
  emits("cancel")
}

const getContent = () => {
  return content.value
}

defineExpose<{
  getContent: () => string
}>({
  getContent,
})
</script>

<template>
  <div>
    <suspense>
      <component :is="tinyMceEditor" v-model="content" :height="height" />
      <template #fallback>
        <a-spin spinning>
          <div class="w-full h-[160px]" />
        </a-spin>
      </template>
    </suspense>
    <div class="mt-3 flex gap-3">
      <div class="flex gap-3 flex-wrap">
        <a-popover>
          <a
            >代码块美化
            <question-circle-outlined />
          </a>
          <template #content> 编辑器中的代码在发送后会以美化效果显示</template>
        </a-popover>
        <a-popover>
          <a
            >自动保存和恢复
            <question-circle-outlined />
          </a>
          <template #content> 编辑器每30秒自动保存一次您的编辑，保存内容存放于LocalStorage中</template>
        </a-popover>
      </div>
      <div class="grow" />
      <a-button v-if="showCancel" @click="handleCancel">取消</a-button>
      <a-button v-if="!hideSubmit" type="primary" @click="handleSubmit">发送</a-button>
    </div>
  </div>
</template>

<style scoped></style>
