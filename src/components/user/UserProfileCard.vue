<script setup lang="ts">
import { doAxios } from "@/tools/axios"
import { UploadOutlined } from "@ant-design/icons-vue"
import { UploadChangeParam, message } from "ant-design-vue"
import axios from "axios"
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

const nickName = ref("")
const settingNickName = ref(false)
const setNickName = () => {
  if (nickName.value.length == 0) {
    message.warning("昵称不能为空")
    return
  }
  let form = new FormData()
  form.append("nickName", nickName.value)
  settingNickName.value = true
  doAxios(
    axios.post("/api/user/nickName", form),
    "更改昵称",
    () => {
      message.success("设置成功")
      location.reload()
    },
    () => (settingNickName.value = false),
  )
}

const signature = ref("")
const settingSignature = ref(false)
const setSignature = () => {
  if (signature.value.length == 0) {
    message.warning("签名档不能为空")
    return
  }
  let form = new FormData()
  form.append("signature", signature.value)
  settingSignature.value = true
  doAxios(
    axios.post("/api/user/signature", form),
    "更改签名档",
    () => {
      message.success("设置成功")
      location.reload()
    },
    () => (settingSignature.value = false),
  )
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="my-3 flex gap-3 items-center">
      <div class="font-bold">头像</div>
      <a-upload
        :multiple="false"
        accept="image/*"
        v-model:file-list="uploadFileList"
        action="/api/user/avatar"
        @change="handleUploadStatusChange"
        with-credentials
      >
        <a-button> <UploadOutlined /> 上传图片 </a-button>
      </a-upload>
    </div>

    <div class="my-3 flex gap-3">
      <div class="font-bold">昵称</div>
      <div class="flex flex-col md:flex-row gap-3">
        <a-input placeholder="请输入新昵称" v-model:value="nickName" />
        <a-spin :spinning="settingNickName">
          <a-button @click="setNickName">设置</a-button>
        </a-spin>
      </div>
    </div>

    <div class="my-3 flex gap-3">
      <div class="font-bold">签名档</div>
      <div class="flex flex-col gap-3">
        <a-textarea
          placeholder="设置新签名档"
          v-model:value="signature"
          show-count
          :maxlength="36"
          class="md:w-[380px]"
        />
        <a-spin :spinning="settingSignature">
          <a-button @click="setSignature">设置</a-button>
        </a-spin>
      </div>
    </div>
  </div>
</template>
