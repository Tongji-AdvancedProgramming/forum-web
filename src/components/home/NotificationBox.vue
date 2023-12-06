<script lang="ts" setup>
import { RollbackOutlined, CheckOutlined } from "@ant-design/icons-vue"
import { doAxios } from "@/tools/axios.ts"
import axios from "axios"
import { computed, h, onMounted, ref } from "vue"
import { Notification } from "@/model/QuickType/Notification.ts"
import { message } from "ant-design-vue"
import { Modal } from "ant-design-vue/lib"

const notifications = ref<Notification[]>([])
const loading = ref(false)

const fetch = () => {
  doAxios(axios.get("/api/notification"), "获取通知列表", (data: Notification[]) => {
    notifications.value = data
  })
}

const handleRead = (item: Notification) => {
  loading.value = true
  doAxios(
    axios.post("/api/notification/read", undefined, { params: { notificationId: item.id } }),
    "标记通知已读",
    () => {
      item.read = true
    },
    () => (loading.value = false),
  )
}

const handleReadAll = () => {
  loading.value = true
  doAxios(
    axios.post("/api/notification/readAll"),
    "标记通知已读",
    () => {
      notifications.value.forEach((v) => (v.read = true))
    },
    () => (loading.value = false),
  )
}

const handleClearAll = () => {
  const clear = () => {
    loading.value = true
    doAxios(
      axios.delete("/api/notification/all"),
      "清空通知",
      () => {
        notifications.value = []
      },
      () => (loading.value = false),
    )
  }

  if (notifications.value.find((v) => (v.read = false)) != undefined) {
    Modal.confirm({
      title: "提示",
      content: "您当前有未读通知，是否继续？",
      onOk: clear,
    })
  } else {
    clear()
  }
}

onMounted(() => fetch())
</script>

<template>
  <a-spin :spinning="loading">
    <div class="max-h-[300px] overflow-scroll">
      <a-empty v-if="notifications.length == 0">
        <template #description>您当前没有收到通知</template>
      </a-empty>
      <a-list v-else :data-source="notifications" item-layout="horizontal" size="small">
        <template #header>
          <div class="flex items-center">
            <div>共{{ notifications.length }}条</div>
            <div class="grow" />
            <a-button type="text" @click="handleReadAll">全部已读</a-button>
            <a-button type="text" @click="handleClearAll">清空通知</a-button>
          </div>
        </template>
        <template #renderItem="{ item, index }: { item: Notification; index: number }">
          <a-list-item>
            <div class="flex gap-2 items-center w-full">
              <div
                class="w-[30px] h-[30px] rounded-full border border-solid border-gray-500 text-gray-500 flex justify-center"
              >
                <rollback-outlined />
              </div>
              <div class="flex flex-col">
                <div class="font-bold flex gap-1 items-center">
                  {{ item.title }}
                  <div v-if="!item.read" class="w-[8px] h-[8px] rounded-full bg-blue-400" />
                </div>
                <a-tooltip :title="item.content">
                  <div class="text-gray-500 line-clamp-1">{{ item.content }}</div>
                </a-tooltip>
              </div>
              <div class="grow" />
              <div class="flex gap-1">
                <a-button v-if="!item.read" :icon="h(CheckOutlined)" @click="handleRead(item)" />
              </div>
            </div>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </a-spin>
</template>

<style scoped></style>
