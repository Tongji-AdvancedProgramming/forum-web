<script setup lang="ts">
import { useRoute } from "vue-router"
import { computed } from "vue"

const route = useRoute()
const boardId = computed(() => (<String>route.params["id"]).replace(/-/g, "/"))
const boardIdSafe = computed(() => <String>route.params["id"])
</script>

<template>
  <a-card>
    <div class="font-normal text-xl md:text-2xl">下载作业</div>
  </a-card>
</template>

<style scoped></style>
