<script setup lang="ts">
import { doAxios } from "@/tools/axios"
import { UploadOutlined } from "@ant-design/icons-vue"
import { Modal, UploadChangeParam, message } from "ant-design-vue"
import ImageCropper from "@/components/helper/ImageCropper.vue"
import axios from "axios"
import { ref, h } from "vue"

const uploadFileList = ref([])
const handleUploadStatusChange = (info: UploadChangeParam) => {
  if (info.file.status !== "uploading") {
    console.log(info.file, info.fileList)
  }
  if (info.file.status === "done") {
    message.success(`上传成功，清除浏览器缓存后即可立即看到`)
  } else if (info.file.status === "error") {
    message.error(`${info.file.name} file upload failed.`)
  }
}
const avatarFile = ref<File>()
const showAvatarCropper = ref(false)
const avatarCropper = ref<typeof ImageCropper>()
let avatarCroppingResult = ref<number | Blob>(0)
const handleBeforeUpload = (file: File) => {
  avatarFile.value = file
  avatarCroppingResult.value = 0
  return new Promise<Blob>((resolve, reject) => {
    showAvatarCropper.value = true
    let i = setInterval(() => {
      console.log(avatarCroppingResult.value, typeof avatarCroppingResult.value)
      if (avatarCroppingResult.value !== 0) {
        clearInterval(i)
        if (avatarCroppingResult.value === 1) reject()
        else if (avatarCroppingResult.value instanceof Blob) {
          resolve(avatarCroppingResult.value)
        }
      }
    }, 50)
  })
}
const handleAvatarCropperOk = () => {
  ; (<Promise<Blob>>avatarCropper.value!.resolveBlob()).then((blob) => {
    avatarCroppingResult.value = blob
    showAvatarCropper.value = false
  })
}
const handleAvatarCropperCancel = () => {
  avatarCroppingResult.value = 1
  showAvatarCropper.value = false
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

const uploadCardFileList = ref([])
const cardFile = ref<File>()
const showCardCropper = ref(false)
const cardCropper = ref<typeof ImageCropper>()
let cardCroppingResult = ref<number | Blob>(0)
const handleBeforeCardUpload = (file: File) => {
  cardFile.value = file
  cardCroppingResult.value = 0
  return new Promise<Blob>((resolve, reject) => {
    showCardCropper.value = true
    let i = setInterval(() => {
      if (cardCroppingResult.value !== 0) {
        clearInterval(i)
        if (cardCroppingResult.value === 1) reject()
        else if (cardCroppingResult.value instanceof Blob) {
          resolve(cardCroppingResult.value)
        }
      }
    }, 50)
  })
}
const handleCardCropperOk = () => {
  ; (<Promise<Blob>>cardCropper.value!.resolveBlob()).then((blob) => {
    cardCroppingResult.value = blob
    showCardCropper.value = false
  })
}
const handleCardCropperCancel = () => {
  cardCroppingResult.value = 1
  showCardCropper.value = false
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
        :before-upload="handleBeforeUpload"
        @change="handleUploadStatusChange"
        with-credentials
      >
        <a-button> <upload-outlined /> 上传图片 </a-button>
      </a-upload>
      <a-modal
        v-model:open="showAvatarCropper"
        title="裁剪图像"
        destroy-on-close
        @ok="handleAvatarCropperOk"
        @cancel="handleAvatarCropperCancel"
      >
        <image-cropper :aspect-ratio="1" :file="avatarFile" ref="avatarCropper" />
      </a-modal>
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
    
    <div class="my-3 flex gap-3 items-center">
      <div class="font-bold">名片背景</div>
      <a-upload
        :multiple="false"
        accept="image/*"
        v-model:file-list="uploadCardFileList"
        action="/api/user/cardBackground"
        :before-upload="handleBeforeCardUpload"
        @change="handleUploadStatusChange"
        with-credentials
      >
        <a-button> <upload-outlined /> 上传图片 </a-button>
      </a-upload>
      <a-modal
        v-model:open="showCardCropper"
        title="裁剪图像"
        destroy-on-close
        @ok="handleCardCropperOk"
        @cancel="handleCardCropperCancel"
      >
        <image-cropper :aspect-ratio="3.5" :file="cardFile" ref="cardCropper" />
      </a-modal>
    </div>
  </div>
</template>
