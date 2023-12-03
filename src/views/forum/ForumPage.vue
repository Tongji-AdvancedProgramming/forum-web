<script setup lang="ts">
import { useRoute } from "vue-router"
import { computed, defineAsyncComponent, h, onMounted, ref, watch } from "vue"
import { doAxios } from "@/tools/axios.ts"
import axios from "axios"
import { Board } from "@/model/QuickType/Board.ts"
import ForumTree from "@/components/forum/ForumTree.vue"
import { DownOutlined, UpOutlined } from "@ant-design/icons-vue"

const route = useRoute()

// 我们把 为了避免学期字符串对路由造成干扰转换的/ 转换回来。
const id = computed(() => (<string>route.params["id"]).replace(/-/g, "/"))
// 获取当前页面类型
const type = computed(() => <string | undefined>route.params["type"] ?? "list")
// 获取当前页面的Post Id
const postId = computed(() => <string | undefined>route.params["postId"] ?? "")

watch([id, postId, type], (value, oldValue) => {
  console.log("Route changed:", id.value.toString(), type.value.toString(), postId.value.toString())
  if (value[2] != oldValue[2]) {
    // 组件将会发生重挂载
    loading.value = true
  }
})

const board = ref<Board>({
  course: { courseCode: "", courseFname: "", courseNo: "", courseSname: "", courseTerm: "", courseType: "" },
  homework: undefined,
  id: "",
  location: "COURSE",
  week: 0,
})

const loading = ref(false)

const fetch = () => {
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
}

watch(id, fetch)

const hideNavigation = ref(false)

onMounted(() => {
  fetch()
  hideNavigation.value = window.innerWidth < 768
})

const title = computed(() => {
  if (board.value.location == "COURSE") return "课程整体问题"
  else if (board.value.location == "HOMEWORK") return board.value.homework?.hwDescription ?? "作业问题"
  else if (board.value.location == "WEEKLY") return `第${board.value.week}周整体问题`
  else if (board.value.location == "COURSE_SUMMARY") return `课程总览`
  else if (board.value.location == "WEEK_SUMMARY") return `第${board.value.week}周总览`
})

const NewPost = defineAsyncComponent(() => import("@/views/forum/post/NewPost.vue"))
const ViewPost = defineAsyncComponent(() => import("@/views/forum/post/ViewPost.vue"))
const ListPosts = defineAsyncComponent(() => import("@/views/forum/board/ListPosts.vue"))

const components = computed(() => {
  switch (type.value) {
    case "new":
      return NewPost
    case "post":
      return ViewPost
    default:
      return ListPosts
  }
})
</script>

<template>
  <a-spin :spinning="loading">
    <div class="container pt-3 mx-auto">
      <div class="mx-2 md:mx-3 flex flex-col md:flex-row gap-3">
        <div class="flex flex-col gap-3 md:w-[400px]">
          <a-card class="">
            <div class="text-2xl font-normal md:text-4xl">{{ title }}</div>
            <div class="text-sm text-gray-400 mt-2">
              <div class="md:grid md:grid-cols-2">
                <div><v-icon name="bi-book" /> {{ board.course.courseFname }}</div>
              </div>
            </div>
          </a-card>
          <a-card>
            <div class="flex items-center">
              <div class="text-sm font-bold">导航</div>
              <div class="grow" />
              <a-button
                v-if="hideNavigation"
                :icon="h(DownOutlined)"
                class="text-gray-400"
                type="text"
                @click="hideNavigation = false"
              />
              <a-button v-else :icon="h(UpOutlined)" class="text-gray-400" type="text" @click="hideNavigation = true" />
            </div>
            <transition>
              <forum-tree v-show="!hideNavigation" class="mt-2" />
            </transition>
          </a-card>
        </div>
        <div class="md:grow">
          <suspense @resolve="loading = false">
            <component :is="components" />
            <template #fallback>
              <div>
                <a-skeleton active />
                <a-skeleton active />
                <a-skeleton active />
              </div>
            </template>
          </suspense>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<style scoped></style>
