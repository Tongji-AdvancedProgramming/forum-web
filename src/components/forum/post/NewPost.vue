<script setup lang="ts">
import Editor from "@tinymce/tinymce-vue"
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
        :init="{
          language: 'zh_CN',
          plugins: 'table codesample wordcount image preview',
          toolbar:
            'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | link codesample image | preview',
          images_upload_url: 'https://forum-upload.accr.cc/upload',
        }"
      />
    </div>
  </a-card>
</template>

<style scoped></style>
