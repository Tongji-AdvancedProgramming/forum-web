<script setup lang="ts">
import { onMounted, onUpdated, ref } from "vue"

defineProps<{ content: string }>()

// Content
const ctt = ref<HTMLDivElement | null>(null)

const formatCtt = () => {
  if (ctt.value != null) {
    import("@/tools/prism").then((Prism) => {
      Prism.default.highlightAllUnder(ctt.value!)
    })
  }
}

onUpdated(() => {
  formatCtt()
})

onMounted(() => {
  formatCtt()
})
</script>

<template>
  <div ref="ctt" class="post-content" v-html="content" />
</template>

<style lang="scss">
.post-content {
  @import "@/assets/post.scss";

  word-break: break-all;

  @media (min-width: 1280px) {
    max-width: 825px;
  }

  @media (min-width: 1536px) {
    max-width: 1024px;
  }
}
</style>
