<script setup lang="ts">
defineProps<{ open: boolean }>()
const emits = defineEmits<{
  (e: "update:open", open: boolean): void
}>()
</script>

<template>
  <a-modal :open="open" @update:open="(v: boolean) => emits('update:open', v)" title="用户信息完善" @ok="handleOk">
    <p>您的账号似乎需要先完善信息。</p>
  </a-modal>
</template>

<style scoped></style>
