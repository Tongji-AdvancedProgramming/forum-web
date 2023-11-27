<script setup lang="ts">
import { ForumConfig } from "@/config.ts"
import Level = ForumConfig.Level
import LevelName = ForumConfig.LevelName
import { computed } from "vue"

const props = defineProps<{ level: number }>()

// 必须要从高到低排序
const userLevels: [{ level: number; name: string; color: string }] = [
  { level: Level.Super, name: LevelName.Super, color: "gold" },
  { level: Level.Admin, name: LevelName.Admin, color: "gold" },
  { level: Level.TA, name: LevelName.TA, color: "blue" },
]

const userLevel = computed(() => {
  for (let i in userLevels) {
    if (userLevels[i].level <= props.level) return userLevels[i]
  }
  return null
})
</script>

<template>
  <div v-if="userLevel != null">
    <a-tag :bordered="false" :color="userLevel.color">{{ userLevel.name }}</a-tag>
  </div>
</template>

<style scoped></style>
