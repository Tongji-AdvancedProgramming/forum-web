<script setup lang="ts">
import { UploadChangeParam, message } from "ant-design-vue"
import { ref } from "vue"

const uploadFileList = ref([])

const handleUploadStatusChange = (info: UploadChangeParam) => {
  if (info.file.status !== "uploading") {
    console.log(info.file, info.fileList)
  }
  if (info.file.status === "done") {
    message.success(`${info.file.name} file uploaded successfully`)
  } else if (info.file.status === "error") {
    message.error(`${info.file.name} file upload failed.`)
  }
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <form class="my-3 flex gap-3 items-center">
      <div class="font-bold">头像</div>
      <a-upload
        :multiple="false"
        accept="image/*"
        v-model:file-list="uploadFileList"
        action="/api/user/avatar"
        @change="handleUploadStatusChange"
        with-credentials
      >
        <a-button> <a-icon type="upload" /> 上传图片 </a-button>
      </a-upload>
    </form>
  </div>
</template>
