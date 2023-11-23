<script setup lang="ts">
import { getAvatarUrl, getCardBackgroundUrl } from "@/helpers/user.js"
import { StudentShortInfo } from "@/model/QuickType/StudentShortInfo"
import { computed } from "vue"

interface Props {
  info: StudentShortInfo
}
const props = defineProps<Props>()

const info = computed(() => props.info)
const tripleStr = computed(() => `${info.value.stuNo}-${info.value.major}-${info.value.realName}`)
const userCardUrl = computed(() => getCardBackgroundUrl(info.value.stuNo))
// const userCardUrl = ref("http://10.80.43.196/card/2159999")

const cardBackground = computed(
  () => `linear-gradient(to left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 80%), url(${userCardUrl.value})`,
)
</script>

<template>
  <div class="flex gap-3 w-[350px] h-[100px] py-3 card" ref="card">
    <a-avatar :size="64" :src="getAvatarUrl(info.stuNo)"></a-avatar>
    <div>
      <div class="font-bold text-lg">{{ info.nickName }}</div>
      <div class="text-gray-500">{{ tripleStr }}</div>
      <div class="text-gray-500 italic mt-3">{{ info.description }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  background: v-bind(cardBackground);
  background-size: cover;
  background-position: center;
  margin: -12px;
  padding: 18px;
  border-radius: 8px;
}
</style>
