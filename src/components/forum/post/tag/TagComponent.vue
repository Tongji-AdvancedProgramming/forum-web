<script setup lang="ts">
import { Tag } from "@/model/QuickType/Tag.ts"

defineProps<{
  tag: Tag
}>()
</script>

<template>
  <a-tag :color="tag.tagBgcolor" :style="`color: ${tag.tagFgcolor}`">
    {{ tag.tagName }}
  </a-tag>
</template>

<style scoped></style>
