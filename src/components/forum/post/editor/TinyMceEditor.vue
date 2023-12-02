<script setup lang="ts">
import "tinymce"
import "tinymce/themes/silver"
import "tinymce/icons/default"
import "tinymce/plugins/emoticons"
import "tinymce/plugins/emoticons/js/emojis.js"
import "tinymce/plugins/table"
import "tinymce/plugins/codesample"
import "tinymce/plugins/wordcount"
import "tinymce/plugins/image"
import "tinymce/plugins/preview"
import "tinymce/plugins/quickbars"
import "tinymce/plugins/autosave"
import "tinymce/plugins/searchreplace"
import "tinymce-china-emoticons-plugin"
import "tinymce-i18n/langs/zh_CN.js"
import "tinymce/models/dom/model.js"
import "tinymce/skins/ui/oxide/content.min.css"
import "tinymce/skins/ui/oxide/skin.min.css"
import Editor from "@tinymce/tinymce-vue"
import { doAxios } from "@/tools/axios.ts"
import axios from "axios"
import { reactive, ref, toRefs, watch } from "vue"

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

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  plugins: {
    type: [String, Array],
    default: "table codesample wordcount image preview autosave searchreplace china-emoticons",
  },
  toolbar: {
    type: [String, Array],
    default:
      "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | china-emoticons link codesample image | preview",
  },
  height: {
    type: [Number],
    default: 800,
  },
})

const emit = defineEmits(["update:modelValue"])

const init = reactive({
  language: "zh_CN",
  plugins: props.plugins,
  toolbar: props.toolbar,
  height: props.height,
  promotion: false,
  images_upload_handler: imageUploadHandler,
  codesample_global_prismjs: true,
  autosave_ask_before_unload: false,
  autosave_restore_when_empty: true,
  autosave_prefix: "tinymce-autosave-{path}{query}-{id}-",
  china_emoticons_insert_size: 40,
})

const { modelValue } = toRefs(props)
const editorValue = ref(modelValue.value)

watch(modelValue, (newValue) => {
  editorValue.value = newValue
})

watch(editorValue, (newValue) => {
  emit("update:modelValue", newValue)
})
</script>

<template>
  <editor v-model="editorValue" :init="init" />
</template>

<style scoped></style>
