<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>

<template>
  <div class="mx-auto mt-[70px] px-4 container">
    <div class="text-3xl md:text-4xl">常见问题</div>
    <div class="mt-5 text-xl md:text-2xl">~{{ title }}~</div>
    <div class="mt-5">
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
