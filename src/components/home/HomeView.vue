<script setup lang="ts">
import { useStore } from "vuex"
import NotificationBox from "@/components/home/NotificationBox.vue"
import ForumTree from "@/components/forum/ForumTree.vue"

const store = useStore()
</script>

<template>
  <div class="container pt-3 px-5 mx-auto">
    <div class="mt-10">
      <span class="text-4xl lg:text-6xl">欢迎回来, </span>
      <span class="text-3xl">{{ store.state.user.stuName }}</span>
    </div>
    <div class="lg:flex lg:gap-3 mt-10">
      <div class="grow" />
      <div class="mt-10">
        <div class="text-2xl">收到的通知</div>
        <notification-box class="mt-5" />
      </div>
      <div class="lg:grow" />
      <div class="mt-10 lg:w-[450px]">
        <div class="text-2xl">前往论坛板块</div>
        <div class="mt-5 drop-shadow">
          <a-card>
            <forum-tree />
          </a-card>
        </div>
      </div>
      <div class="grow" />
    </div>
  </div>
</template>

<style scoped></style>
