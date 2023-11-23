<script setup lang="ts">
import { StudentShortInfo } from "@/model/QuickType/StudentShortInfo"
import { doAxios } from "@/tools/axios"
import axios from "axios"
import { onMounted } from "vue"
import { computed } from "vue"
import { ref } from "vue"

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
const breifStr = computed(() => `${info.value.nickName}(${tripleStr.value})`)

onMounted(() => {
  doAxios(
    axios.get("/api/user/shortInfo", { params: { id: props.uid } }),
    "获取用户信息",
    (ssi: StudentShortInfo) => info.value = ssi,
  )
})
</script>

<template>
  <div class="cursor-pointer hover:underline">
    <a-popover placement="bottom">
      <div>{{ breifStr }}</div>
      <template #content>
        <user-small-profile-content :info="info"/>
      </template>
    </a-popover>
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
