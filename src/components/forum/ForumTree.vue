<script setup lang="ts">
import { CourseTree } from "@/model/QuickType/CourseTree.ts"
import { TreeProps } from "ant-design-vue"
import { computed, onMounted, ref } from "vue"
import { doAxios } from "@/tools/axios.ts"
import axios from "axios"
import { DataNode } from "ant-design-vue/es/vc-tree/interface"
import { useRoute, useRouter } from "vue-router"

const convertCourseTreeToAntTree = (tree: CourseTree): DataNode[] => {
  return tree.courses.map((course) => {
    let id1 = `${course.courseTerm}_${course.courseCode}`
    let tree1: DataNode = {
      title: `${course.courseTerm} - ${course.courseCode} - ${course.courseFname}`,
      key: `${id1}`,
      children: [{ title: `课程整体问题`, key: `${id1}_general` }],
    }
    tree1.children!.push(
      ...(course.weeks?.map((week) => {
        let tree2: DataNode = {
          title: `${week.content}`,
          key: `${id1}_w${week.number}_p`,
          children: [
            {
              title: `作业下载`,
              key: `${id1}_w${week.number}_down`,
            },
            {
              title: `本周整体问题`,
              key: `${id1}_w${week.number}`,
            },
          ],
        }
        tree2.children!.push(
          ...week.homeworks.map((hw) => {
            return {
              title: `${hw.hwId.toString().padStart(4, "0")} - ${hw.hwDescription}`,
              key: `${id1}_w${week.number}_${hw.hwId}`,
            }
          }),
        )
        return tree2
      }) ?? []),
    )
    return tree1
  })
}

const treeData = ref<DataNode[]>([])

const router = useRouter()

const handleSelect = (selectedKeys: string[]) => {
  console.log(selectedKeys)

  let key = selectedKeys[0]

  // 为了避免学期字符串中的斜杠对路由造成干扰，我们先把它转换成-。
  key = key.replace(/\//g, "-")

  if (key.endsWith("_down")) {
    router.push(`/download/${key.replace(/_down/, "")}`)
  } else {
    router.push(`/forum/${key}`)
  }
}

const loading = ref(false)

const route = useRoute()

const expId = ref([(<String>route.params["id"]).replace(/-/g, "/")])
const selId = ref([(<String>route.params["id"]).replace(/-/g, "/")])

onMounted(() => {
  loading.value = true
  doAxios(
    axios.get("/api/course/tree"),
    "获取课程列表",
    (courseTree: CourseTree) => {
      treeData.value = convertCourseTreeToAntTree(courseTree)
    },
    () => {
      loading.value = false
    },
  )
})
</script>

<template>
  <a-spin :spinning="loading">
    <div v-if="treeData.length > 0">
      <a-tree
        show-line
        show-icon
        :tree-data="treeData"
        v-model:expanded-keys="expId"
        v-model:selected-keys="selId"
        @select="handleSelect"
      >
      </a-tree>
    </div>
    <div v-else>
      <a-empty>
        <template #description> 当前没有您可以访问的板块 </template>
      </a-empty>
    </div>
  </a-spin>
</template>

<style scoped></style>
