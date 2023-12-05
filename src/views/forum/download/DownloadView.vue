<script setup lang="ts">
import {
  PlusOutlined,
  QuestionCircleOutlined,
  FieldNumberOutlined,
  FieldStringOutlined,
  FileProtectOutlined,
} from "@ant-design/icons-vue"
import { useRoute } from "vue-router"
import { computed, ref, watch } from "vue"
import { useStore } from "@/tools/store.ts"
import { ForumConfig } from "@/config.ts"
import Level = ForumConfig.Level
import { DefaultHomeworkUploaded, HomeworkUploaded } from "@/model/QuickType/HomeworkUploaded.ts"
import { doAxiosAsync, doAxiosAsyncFull } from "@/tools/axios.ts"
import axios from "axios"
import { GetMyCourseCodes } from "@/helpers/course.ts"
import { FormInstance, message } from "ant-design-vue"
import App = ForumConfig.App

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

const courseCodes = ref<string[][]>([])
const courseCodesOptions = computed(() => {
  return courseCodes.value.map(([term, ccode]) => ({
    label: `${term}-${ccode}`,
    value: `${term}_${ccode}`,
  }))
})

const updating = ref(false)
const updatingConfirming = ref(false)
const updatingHomework = ref<HomeworkUploaded>(DefaultHomeworkUploaded)
const updatingHomeworkIsDel = computed({
  get() {
    return updatingHomework.value.hwupIsDel === "1"
  },
  set(val: boolean) {
    updatingHomework.value.hwupIsDel = val ? "1" : "0"
  },
})
const updatingHomeworkCourse = computed({
  get() {
    let str = `${updatingHomework.value.hwupTerm}_${updatingHomework.value.hwupCcode}`
    return str == "_" ? "" : str
  },
  set(val: string) {
    let [term, ccode] = val.split("_")
    updatingHomework.value.hwupTerm = term
    updatingHomework.value.hwupCcode = ccode
  },
})

const formRef = ref<FormInstance | null>(null)
const handleEditFinish = async () => {
  updatingConfirming.value = true
  try {
    let values = await formRef.value?.validateFields()
    if (values == undefined) return

    let homework: HomeworkUploaded = values as HomeworkUploaded

    await doAxiosAsyncFull(axios.post("/api/homework/uploaded", homework), "上传作业")
    message.success("添加成功")
    updating.value = false
    await fetch()
  } finally {
    updatingConfirming.value = false
  }
}

/* 添加 */
const allowEdit = computed(() => store.state.userLevel >= Level.Admin)
const handleAdd = () => {
  updatingHomework.value = DefaultHomeworkUploaded
  updating.value = true
}

/* 编辑 */
const handleUpdate = (item: HomeworkUploaded) => {
  updatingHomework.value = item
  updating.value = true
}

await fetch()
courseCodes.value = await GetMyCourseCodes()

const handleDownload = (item: HomeworkUploaded) => {
  let url = `${App.ResourceUrl}/s3/${item.hwupFilename}`
  window.open(url, "_blank")
}
</script>

<template>
  <a-card>
    <div class="text-lg font-normal">下载作业</div>
    <div v-if="allowEdit" class="mt-6 flex gap-3 items-center flex-wrap">
      <a-button type="primary" @click="handleAdd"> <plus-outlined /> 添加作业 </a-button>
      <a-switch v-model:checked="withHidden" checked-children="显示已删除" un-checked-children="隐藏已删除" />
      <div class="text-sm text-gray-500">作业文件需要使用Minio上传，详见维护文档。</div>
    </div>

    <!-- 编辑和上传窗口 -->
    <a-modal v-model:open="updating" title="编辑/新增作业" @ok="handleEditFinish" :confirm-loading="updatingConfirming">
      <a-form
        ref="formRef"
        :model="updatingHomework"
        name="作业上传文件"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item
          label="学期和课程代码"
          name="hwupTerm"
          :rules="{ required: true, message: '请选择学期和课程代码' }"
        >
          <a-select v-model:value="updatingHomeworkCourse" :options="courseCodesOptions" />
        </a-form-item>
        <a-form-item name="hwupCcode" hidden> </a-form-item>
        <a-form-item label="作业编号" name="hwupId" :rules="{ required: true, message: '请输入作业编号' }">
          <a-input v-model:value="updatingHomework.hwupId" />
        </a-form-item>
        <a-form-item
          label="作业周次"
          name="hwupWeek"
          :rules="[
            { required: true, message: '请输入作业周次' },
            { pattern: /^\d+$/, message: '请输入数字' },
          ]"
        >
          <a-input v-model:value="updatingHomework.hwupWeek" />
        </a-form-item>
        <a-form-item
          label="作业章节"
          name="hwupChapter"
          :rules="[
            { required: true, message: '请输入作业章节' },
            { pattern: /^\d+$/, message: '请输入数字' },
          ]"
        >
          <a-input v-model:value="updatingHomework.hwupChapter" />
        </a-form-item>
        <a-form-item label="作业描述" name="hwupDescription" :rules="{ required: true, message: '请输入作业描述' }">
          <a-input v-model:value="updatingHomework.hwupDescription" />
        </a-form-item>
        <a-form-item name="hwupFilename" :rules="{ required: true, message: '请输入作业文件名' }">
          <a-input v-model:value="updatingHomework.hwupFilename" />
          <template #label>
            <a-tooltip title="请使用Minio管理面板上传文件到指定文件夹，然后将path粘贴于这里">
              作业文件名 <question-circle-outlined />
            </a-tooltip>
          </template>
        </a-form-item>
        <a-form-item label="添加日期" name="hwupDateAdd" :rules="{ required: true, message: '请输入添加日期' }">
          <a-date-picker show-time v-model:value="updatingHomework.hwupDateAdd" value-format="YYYY-MM-DDTHH:mm:ss" />
        </a-form-item>
        <a-form-item label="是否隐藏" name="hwupIsDel">
          <a-switch v-model:checked="updatingHomeworkIsDel" />
        </a-form-item>
        <a-form-item label="备注" name="hwupComment">
          <a-textarea v-model:value="updatingHomework.hwupComment" />
        </a-form-item>
      </a-form>
    </a-modal>

    <div class="flex flex-col gap-3">
      <a-list :data-source="homeworks" item-layout="horizontal">
        <template #renderItem="{ item }: { item: HomeworkUploaded }">
          <a-list-item>
            <a-list-item-meta :title="item.hwupDescription">
              <template #description>
                <div class="flex flex-col md:flex-row md:flex-wrap gap-3">
                  <div class="flex gap-1">
                    <field-number-outlined />
                    {{ item.hwupId }}
                  </div>
                  <div class="flex gap-1">
                    <field-string-outlined />
                    {{ item.hwupFilename.split("/").pop() ?? "" }}
                  </div>
                  <div class="flex gap-1">
                    <file-protect-outlined />
                    {{ item.hwupFilemd5 }}
                  </div>
                  <div v-if="item.hwupIsDel == '1'">
                    <a-tag color="red">隐藏中</a-tag>
                  </div>
                </div>
              </template>
            </a-list-item-meta>
            <template #actions>
              <div class="flex gap-3">
                <a-button v-if="allowEdit" @click="handleUpdate(item)">编辑</a-button>
                <a-button @click="handleDownload(item)">下载</a-button>
              </div>
            </template>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </a-card>
</template>

<style scoped></style>
