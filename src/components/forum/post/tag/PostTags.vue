<script setup lang="ts">
import { Post } from "@/model/QuickType/Post.ts"
import { computed } from "vue"
import { GetTags, SolvePostTags } from "@/helpers/tags.ts"

const props = defineProps<{
  post: Post
}>()

const tags = await GetTags()
const postTags = computed(() => SolvePostTags(props.post))
const postTagsInfo = computed(() => postTags.value.map((v) => tags[Number(v)]))
</script>

<template>
  <div class="inline gap-3 font-bold">
    <a-tag v-for="tag in postTagsInfo" :key="tag.tagName" :color="tag.tagBgcolor" :style="`color: ${tag.tagFgcolor}`">
      {{ tag.tagName }}
    </a-tag>
  </div>
</template>

<style scoped></style>
