<script setup lang="ts">
import { CourseTree } from "@/model/QuickType/CourseTree.ts"
import { TreeProps } from "ant-design-vue"
import { onMounted, ref } from "vue"
import { doAxios } from "@/tools/axios.ts"
import axios from "axios"
import { DataNode } from "ant-design-vue/es/vc-tree/interface"
import { useRouter } from "vue-router"

const convertCourseTreeToAntTree = (tree: CourseTree): DataNode[] => {
  return tree.courses.map((course) => {
    let id1 = `${course.courseTerm}_${course.courseCode}`
    let tree1: DataNode = {
      title: `${course.courseTerm} - ${course.courseCode} - ${course.courseFname}`,
      key: `0-${id1}`,
      children: [{ title: `课程整体问题`, key: `0-${id1}-G` }],
    }
    tree1.children!.push(
      ...(course.weeks?.map((week) => {
        let tree2: DataNode = {
          title: `${week.content}`,
          key: `0-${id1}-${week.number}`,
          children: [
            {
              title: `作业下载`,
              key: `0-${id1}-${week.number}-G00`,
            },
            {
              title: `本周整体问题`,
              key: `0-${id1}-${week.number}-G01`,
            },
          ],
        }
        tree2.children!.push(
          ...week.homeworks.map((hw) => {
            return {
              title: `${hw.hwId.toString().padStart(4, "0")} - ${hw.hwDescription}`,
              key: `0-${id1}-${week.number}-${hw.hwId}`,
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
  let key = selectedKeys[0]
  let keys = key.split("-")

  // 为了避免学期字符串中的斜杠对路由造成干扰，我们先把它转换成-。
  keys[1] = keys[1].replace(/\//g, "-")

  console.log(keys)

  if (keys.length == 3 && keys[2] == "G") {
    // 这是课程的整体问题
    router.push(`/forum/${keys[1]}_general`)
  } else if (keys.length == 4 && keys[3].startsWith("G")) {
    if (keys[3] == "G00") {
      // 这是某周的作业下载
      router.push(`/downloads/${keys[1]}_w${keys[2]}`)
    } else {
      // 这是某周的整体问题
      router.push(`/forum/${keys[1]}_w${keys[2]}`)
    }
  } else if (keys.length == 4) {
    router.push(`/forum/${keys[1]}_w${keys[2]}_${keys[3]}`)
  }
}

const loading = ref(false)

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
      <a-tree show-line show-icon :tree-data="treeData" @select="handleSelect"> </a-tree>
    </div>
    <div v-else>
      <a-empty>
        <template #description> 当前没有您可以访问的板块 </template>
      </a-empty>
    </div>
  </a-spin>
</template>

<style scoped></style>
