<script setup lang="ts">
import { DefaultStudentShortInfo } from "@/model/QuickType/StudentShortInfo"
import { computed } from "vue"
import { GetStudentShortInfo } from "@/helpers/user.ts"
import { computedAsync } from "@vueuse/core"

interface Props {
  uid: string
}
const props = defineProps<Props>()

const info = computedAsync(async () => await GetStudentShortInfo(props.uid), DefaultStudentShortInfo)
const tripleStr = computed(() => `${info.value?.stuNo}-${info.value?.major}-${info.value?.realName}`)
const briefStr = computed(() => `${info.value?.nickName}(${tripleStr.value})`)
</script>

<template>
  <div class="cursor-pointer hover:underline">
    <a-popover placement="bottom">
      <div>{{ briefStr }}</div>
      <template #content>
        <user-small-profile-content :info="info ?? DefaultStudentShortInfo" />
      </template>
    </a-popover>
  </div>
  <div>
    <user-level-tag :level="info?.role" />
  </div>
</template>

<style scoped lang="scss">
.card {
  background-size: cover;
  background-position: center;
  margin: -12px;
  padding: 18px;
  border-radius: 8px;
}
</style>
