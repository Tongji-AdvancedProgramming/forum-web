<script setup lang="ts">
import { PlusOutlined } from "@ant-design/icons-vue"
import { useRoute } from "vue-router"
import { computed, ref, watch } from "vue"
import { useStore } from "@/tools/store.ts"
import { ForumConfig } from "@/config.ts"
import Level = ForumConfig.Level
import { DefaultHomeworkUploaded, HomeworkUploaded } from "@/model/QuickType/HomeworkUploaded.ts"
import { doAxios, doAxiosAsync } from "@/tools/axios.ts"
import axios from "axios"

const route = useRoute()
const boardId = computed(() => (<String>route.params["id"]).replace(/-/g, "/"))
const boardIdSafe = computed(() => <String>route.params["id"])

const store = useStore()

const withHidden = ref(false)
const homeworks = ref<HomeworkUploaded[]>([])

const fetch = async () => {
  let id = boardId.value
  if (id == undefined || id.length == 0) return

  await doAxiosAsync(
    axios.get("/api/homework/uploaded", {
      params: {
        boardId: id,
        withHidden: withHidden.value,
      },
    }),
    "获取已上传作业",
    async (res: HomeworkUploaded[]) => {
      homeworks.value = res
    },
  )
}

watch(withHidden, fetch)

const updating = ref(true)
const updatingHomework = ref<HomeworkUploaded>(DefaultHomeworkUploaded)
const updatingHomeworkIsDel = computed({
  get() {
    return updatingHomework.value.hwupIsDel === "1"
  },
  set(val: boolean) {
    updatingHomework.value.hwupIsDel = val ? "1" : "0"
  },
})

const update = async () => {}

/* 添加 */
const allowAdd = computed(() => store.state.userLevel >= Level.TA)
const handleAdd = () => {}

/* 编辑 */
const handleUpdate = () => {}

await fetch()
</script>

<template>
  <a-card>
    <div class="text-lg font-normal">下载作业</div>
    <div class="mt-6 flex gap-3 items-center flex-wrap">
      <a-button type="primary" @click="handleAdd"> <plus-outlined /> 添加作业 </a-button>
      <a-switch v-model:checked="withHidden" checked-children="显示已删除" un-checked-children="隐藏已删除" />
      <div class="text-sm text-gray-500">作业文件需要使用Minio上传，详见维护文档。</div>
    </div>

    <a-modal v-model:open="updating" title="编辑/新增作业">
      <a-form v-model:
    </a-modal>

    <div class="flex flex-col gap-3">
      <a-list />
    </div>
  </a-card>
</template>

<style scoped></style>
