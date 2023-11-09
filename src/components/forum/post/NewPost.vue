<script setup lang="ts">
import Editor from "@tinymce/tinymce-vue"
import { doAxios } from "@/tools/axios.ts"
import axios from "axios"
import { ref } from "vue"

const imageUploadHandler = (blobInfo) =>
  new Promise((resolve, reject) => {
    let blob = <Blob>blobInfo.blob()

    let form = new FormData()
    form.append("file", blob)

    doAxios(
      axios.post("/api/upload/images", form),
      "上传图片",
      (url: string) => {
        resolve(url)
      },
      () => {
        reject("处理失败，请重试")
      },
    )
  })

const mceEditor = ref<typeof Editor | null>()

const send = () => {
  if (mceEditor.value) {
    let editor = mceEditor.value.getEditor()
    let content = <String>editor.getContent()

    if (content.length == 0) {
    }
  }
}
</script>

<template>
  <a-card>
    <div>
      <div class="flex gap-3 text-sm font-bold mb-3">
        <div class="">标题</div>
        <a>标题指南</a>
        <a>提问的艺术</a>
      </div>
      <a-input class="h-[50px]" />
    </div>
    <a-divider />
    <div>
      <div class="text-sm font-bold mb-3">编辑内容</div>
      <editor
        api-key="r0a9o4d2ckpm87aby574xok1xtx0xvixwmvjj4euigwyw63w"
        ref="mceEditor"
        :init="{
          language: 'zh_CN',
          plugins: 'table codesample wordcount image preview',
          toolbar:
            'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | link codesample image | preview',
          images_upload_url: 'https://forum-upload.accr.cc/upload',
          images_upload_handler: imageUploadHandler,
        }"
      />
      <div class="flex mt-4">
        <div class="grow" />
        <a-button type="primary" @click="send">发送</a-button>
      </div>
    </div>
  </a-card>
</template>

<style scoped></style>
