<script setup lang="ts">
import { Post } from "@/model/QuickType/Post.ts"
import { h, ref } from "vue"
import { GetTags, SolvePostTags } from "@/helpers/tags.ts"
import TagComponent from "@/components/forum/post/tag/TagComponent.vue"

const props = defineProps<{ post: Post }>()
const postTags = SolvePostTags(props.post)

const getSelected = () => {
  return targetSelected.value
}

defineExpose<{
  getSelected: () => string[]
}>({
  getSelected,
})

const tags = await GetTags()
const transferDataSource = tags.map(
  (v, i) =>
    new Object({
      key: `${i}`,
      tag: v,
    }),
)

const targetSelected = ref(postTags)
const selected = ref([])
</script>

<template>
  <a-transfer :data-source="transferDataSource" v-model:selected-keys="selected" v-model:target-keys="targetSelected">
    <template #render="item">
      <tag-component :tag="item.tag" />
    </template>
  </a-transfer>
</template>

<style scoped></style>
