<script setup lang="ts">
import { useStore } from "@/tools/store"
import NotificationBox from "@/components/home/NotificationBox.vue"
import ForumTree from "@/components/forum/ForumTree.vue"
import { h, onMounted, ref } from "vue"
import { DownOutlined, UpOutlined } from "@ant-design/icons-vue"

const store = useStore()

const hideNavigation = ref(false)
</script>

<template>
  <div class="container pt-3 mx-auto">
    <div class="mx-2 md:mx-3 flex flex-col md:flex-row gap-3">
      <div class="flex flex-col gap-3 md:w-[400px]">
        <a-card>
          <div class="text-xl md:text-2xl">欢迎回来，{{ store.state.user.stuName }}</div>
        </a-card>
        <a-card>
          <div class="font-bold">最近的通知</div>
          <notification-box class="py-3" />
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
      <div class="flex flex-col gap-3 md:grow">
        <a-card>
          <div class="font-bold">搜索</div>
          <div class="pt-5">
            <inline-search-box width="100%" />
          </div>
        </a-card>
        <a-card class="flex items-center justify-center md:min-h-[400px] text-gray-500">
          <a-empty description=""> 点击一个课程以进入论坛 </a-empty>
        </a-card>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
