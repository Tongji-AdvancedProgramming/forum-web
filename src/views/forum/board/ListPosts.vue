<script lang="ts" setup>
import { doAxios } from "@/tools/axios.ts"
import axios from "axios"
import { computed, onMounted, ref, watch } from "vue"
import { Post } from "@/model/QuickType/Post.ts"
import { useRoute } from "vue-router"
import { DownOutlined, PlusOutlined } from "@ant-design/icons-vue"
import router from "@/tools/router"
import { GetTagsWithoutReversed } from "@/helpers/tags.ts"
import { useStore } from "@/tools/store.ts"
import { ForumConfig } from "@/config.ts"
import PostMetaData from "@/components/forum/post/PostMetaData.vue"
import Level = ForumConfig.Level

const store = useStore()
const showHiddenButton = computed(() => store.state.userLevel >= Level.TA)

const route = useRoute()
const boardId = computed(() => (<String>route.params["id"]).replace(/-/g, "/"))
const boardIdSafe = computed(() => <String>route.params["id"])

const loading = ref(false)
const posts = ref<Post[]>()

const selectedTags = ref<string[]>([])
const showHidden = ref(false)

const fetch = () => {
  let id = boardId.value
  if (id == undefined || id.length == 0) return

  let tagsForSend = selectedTags.value.map((v) => Number(v))
  loading.value = true
  doAxios(
    axios.get("/api/post/list", {
      params: { boardId: id, tags: encodeURIComponent(JSON.stringify(tagsForSend)), showHidden: showHidden.value },
    }),
    "获取帖子",
    (_posts: Post[]) => {
      posts.value = _posts
    },
    () => (loading.value = false),
  )
}
watch(boardId, fetch)
watch(selectedTags, fetch)
watch(showHidden, fetch)
onMounted(() => {
  fetch()
})

const postNew = () => {
  router.push(`/forum/${boardId.value.replace(/\//g, "-")}/new`)
}

/* 按照标签筛选 */

const tags = await GetTagsWithoutReversed()
const selectTagOverlayOpen = ref(false)
</script>

<template>
  <a-spin :spinning="loading">
    <a-card>
      <!-- 标题和工具栏 -->
      <div class="text-lg font-normal">所有帖子</div>
      <div class="mt-6 flex gap-3 items-center flex-wrap">
        <a-button type="primary" @click="postNew">
          <PlusOutlined />
          发布新帖子
        </a-button>

        <a-dropdown v-model:open="selectTagOverlayOpen">
          <a-button> 按标签筛选 <down-outlined /> </a-button>
          <template #overlay>
            <div class="p-4 shadow rounded-lg bg-white">
              <a-checkbox-group v-model:value="selectedTags" style="width: 100%">
                <div class="flex flex-col gap-3">
                  <a-checkbox v-for="(tag, i) in tags" :key="i" :value="`${i}`">
                    <tag-component :tag="tag" />
                  </a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
          </template>
        </a-dropdown>

        <div v-if="showHiddenButton">
          <a-switch v-model:checked="showHidden" checked-children="显示已删除" un-checked-children="隐藏已删除" />
        </div>
      </div>

      <!-- 帖子列表 -->
      <div class="flex flex-col gap-3">
        <a-list :data-source="posts" item-layout="horizontal">
          <template #renderItem="{ item }: { item: Post }">
            <a-list-item>
              <a-list-item-meta>
                <!-- 帖子标题 -->
                <template #title>
                  <a @click="router.push(`/forum/${boardIdSafe}/post/${item.postId}`)">{{ item.postTitle }}</a>
                  <post-tags :post="item" class="ml-3" />
                </template>

                <!-- 帖子信息 -->
                <template #description>
                  <post-meta-data :post="item" />
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </a-card>
  </a-spin>
</template>
