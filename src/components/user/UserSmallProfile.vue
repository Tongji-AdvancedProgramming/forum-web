<script setup lang="ts">
import { StudentShortInfo } from "@/model/QuickType/StudentShortInfo"
import { computed } from "vue"
import { ref } from "vue"
import { GetStudentShortInfo } from "@/helpers/user.ts"

interface Props {
  uid: string
}
const props = defineProps<Props>()

const info = ref<StudentShortInfo>({
  nickName: "请稍等",
  realName: "",
  stuNo: "",
  major: "",
  role: 0,
  description: "",
})
const tripleStr = computed(() => `${info.value.stuNo}-${info.value.major}-${info.value.realName}`)
const briefStr = computed(() => `${info.value.nickName}(${tripleStr.value})`)

info.value = (await GetStudentShortInfo(props.uid)) ?? {
  nickName: "获取失败",
  realName: "",
  stuNo: "",
  major: "",
  role: 0,
  description: "",
}
</script>

<template>
  <div class="cursor-pointer hover:underline">
    <a-popover placement="bottom">
      <div>{{ briefStr }}</div>
      <template #content>
        <user-small-profile-content :info="info" />
      </template>
    </a-popover>
  </div>
  <div>
    <user-level-tag :level="info.role" />
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
