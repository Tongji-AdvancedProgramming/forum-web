<script setup lang="ts">
import { getAvatarUrl } from "@/helpers/avatar"
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
    (ssi: StudentShortInfo) => (info.value = ssi),
  )
})
</script>

<template>
  <div class="cursor-pointer hover:underline">
    <a-popover placement="bottom">
      <div>{{ breifStr }}</div>
      <template #content>
        <div class="flex gap-3 w-[350px] h-[100px] py-3 card">
          <a-avatar :size="64" :src="getAvatarUrl(uid)"></a-avatar>
          <div>
            <div class="font-bold text-lg">{{ info.nickName }}</div>
            <div class="text-gray-500">{{ tripleStr }}</div>
            <div class="text-gray-500 italic mt-3">{{ info.description }}</div>
          </div>
        </div>
      </template>
    </a-popover>
  </div>
</template>

<style scoped>
.card {
  background: linear-gradient(to left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 80%),
    url(https://s.c.accr.cc/picgo/34eb077fd67a9e569959bf71f81a44a5-37cbe2.jpg);
  background-size: cover;
  background-position: center;
}
</style>
