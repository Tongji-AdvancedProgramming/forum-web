<script setup lang="ts">
import { VerticalAlignTopOutlined } from "@ant-design/icons-vue"

defineProps<{ priority: string }>()
</script>

<template>
  <a-tooltip v-if="priority != '0'" title="置顶等级" placement="bottom">
    <a>
      <vertical-align-top-outlined />
      {{ priority }}
    </a>
  </a-tooltip>
</template>

<style scoped></style>
