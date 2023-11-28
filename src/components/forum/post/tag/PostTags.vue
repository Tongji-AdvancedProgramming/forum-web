<script setup lang="ts">
import TagComponent from "@/components/forum/post/tag/TagComponent.vue"
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
    <tag-component v-for="tag in postTagsInfo" :key="tag.tagName" :tag="tag" />
  </div>
</template>

<style scoped></style>
