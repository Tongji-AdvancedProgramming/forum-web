<script setup lang="ts">
defineProps<{ open: boolean }>()
const emits = defineEmits<{
  (e: "update:open", open: boolean): void
}>()

const handleOk = () => {}
</script>

<template>
  <a-modal
    :open="open"
    @update:open="(v: boolean) => emits('update:open', v)"
    title="完善论坛信息"
    cancel-text="使用默认"
    ok-text="前往自定义"
    @ok="handleOk"
  >
    <p>您似乎还没有设置昵称<sup>*</sup>和头像。您可以直接使用默认的昵称头像，也可以前往自定义设置。</p>
    <br />
    <p class="text-sm">(*)注：昵称仅做个性化使用，您的真实信息仍然会在昵称旁显示。</p>
  </a-modal>
</template>

<style scoped></style>
