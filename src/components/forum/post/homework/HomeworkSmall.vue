<script setup lang="ts">
import { computedAsync } from "@vueuse/core"
import { GetHomeworkInfo } from "@/helpers/homework.ts"
import { DefaultHomework, Homework } from "@/model/QuickType/Board.ts"
import router from "@/tools/router.ts"

const props = defineProps<{ term: string; hwId: number; ccode: string; week: number }>()

const hwInfo = computedAsync<Homework>(
  async () => (await GetHomeworkInfo(props.term, props.hwId, props.ccode)) ?? DefaultHomework,
  DefaultHomework,
)

const handleClick = () => {
  router.push(`${props.term.replace(/\//g, "-")}_${props.ccode}_w${props.week}_${props.hwId}`)
}
</script>

<template>
  <div class="hover:underline hover:cursor-pointer" @click="handleClick">
    {{ hwInfo.hwDescription }}
  </div>
</template>

<style scoped></style>
