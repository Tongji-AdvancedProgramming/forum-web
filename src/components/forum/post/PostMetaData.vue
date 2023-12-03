<script setup lang="ts">
import { ClockCircleOutlined, UserOutlined, BookOutlined } from "@ant-design/icons-vue"
import { Post } from "@/model/QuickType/Post.ts"
import dayjs from "dayjs"
import HomeworkSmall from "@/components/forum/post/homework/HomeworkSmall.vue"

withDefaults(defineProps<{ post: Post; showHwName?: boolean }>(), { showHwName: false })
</script>

<template>
  <div class="flex flex-col lg:flex-row lg:gap-3 text-gray-400">
    <div>
      <clock-circle-outlined />
      {{ dayjs(post.postDate).format("lll") }}
    </div>
    <div class="flex gap-1">
      <user-outlined />
      <user-small-profile :uid="post.postSno" />
    </div>
    <div v-if="showHwName && post.postHwId !== -1" class="flex gap-1 items-baseline">
      <book-outlined />
      <homework-small :term="post.postTerm" :hw-id="post.postHwId" :ccode="post.postCcode" :week="post.postWeek" />
    </div>
    <div class="flex gap-2">
      <priority-component :priority="post.postPriority" />
      <div v-if="post.postIsDel == '1'" class="text-red-400">
        <i>帖子已被删除</i>
      </div>
    </div>
  </div>
</template>
