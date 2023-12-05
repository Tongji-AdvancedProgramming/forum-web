<script lang="ts" setup>
import { doAxios } from "@/tools/axios.ts"
import axios from "axios"
import { onMounted, ref } from "vue"
import { Notification } from "@/model/QuickType/Notification.ts"

const notifications = ref<Notification[]>([])

const fetch = () => {
  doAxios(axios.get("/api/notification"), "获取通知列表", (data: Notification[]) => {
    notifications.value = data
  })
}

onMounted(() => fetch())
</script>

<template>
  <div class="max-h-[300px] overflow-scroll">
    <a-empty v-if="notifications.length == 0">
      <template #description>您当前没有收到通知</template>
    </a-empty>
    <a-list v-else :data-source="notifications" item-layout="horizontal" size="small">
      <template #renderItem="{ item }: { item: Notification }">
        <a-list-item>
          <a-list-item-meta>
            <!--            <template #avatar>-->
            <!--              <rollback-outlined v-if="item.type == `REPLY`" />-->
            <!--            </template>-->
            <template #title>
              {{ item.title }}
            </template>
            <template #description>
              {{ item.content }}
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<style scoped></style>
