<script setup lang="ts">
import { useRoute } from "vue-router"
import { computed, onMounted, ref } from "vue"
import { doAxios } from "@/tools/axios.ts"
import axios from "axios"
import { Board } from "@/model/QuickType/Board.ts"

const route = useRoute()

// 我们把 为了避免学期字符串对路由造成干扰转换的/ 转换回来。
const id = ref<String>((<String>route.params["id"]).replace(/-/g, "/"))

const board = ref<Board>({
  course: { courseCode: "", courseFname: "", courseNo: "", courseSname: "", courseTerm: "", courseType: "" },
  homework: undefined,
  id: "",
  location: "COURSE",
  week: 0,
})

const loading = ref(false)

onMounted(() => {
  loading.value = true
  doAxios(
    axios.get("/api/board", { params: { id: id.value } }),
    "获取板块数据",
    (data: Board) => {
      board.value = data
    },
    () => {
      loading.value = false
    },
  )
})

const title = computed(() => {
  if (board.value.location == "COURSE") return "课程整体问题"
  else if (board.value.location == "HOMEWORK") return board.value.homework?.hwDescription ?? "作业问题"
  else return `第${board.value.week}周整体问题`
})
</script>

<template>
  <a-spin :spinning="loading">
    <div class="container pt-3 mx-auto">
      <a-card class="mx-2 md:mx-3">
        <div class="text-2xl font-normal md:text-4xl">{{ title }}</div>
        <div class="text-sm text-gray-400 mt-2">
          <div class="md:grid md:grid-cols-4">
            <div><v-icon name="bi-book" /> {{ board.course.courseFname }}</div>
          </div>
        </div>
        <a-divider class="mt-2" />
      </a-card>
    </div>
  </a-spin>
</template>

<style scoped></style>
