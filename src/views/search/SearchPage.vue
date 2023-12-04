<script lang="ts" setup>
import { h, onMounted, ref } from "vue"
import { SearchOutlined } from "@ant-design/icons-vue"
import { GetMyCourseCodes } from "@/helpers/course.ts"
import { Post } from "@/model/QuickType/Post.ts"
import { useMeili } from "@/tools/meilisearch.ts"
import { ForumConfig } from "@/config.ts"
import SearchingIndex = ForumConfig.SearchingIndex
import { useRoute } from "vue-router"
import { BuildBoardId } from "@/helpers/board.ts"
import router from "@/tools/router.ts"

const route = useRoute()
const q = route.query["q"]?.toString() ?? ""

const meiliClient = useMeili()

const searchWord = ref(q)
const searchResult = ref<Post[]>([])

const pageIndex = ref(1)
const pageSize = ref(20)
const total = ref(0)

const handleSearch = async () => {
  let filterList: string[][] = []
  ;(await GetMyCourseCodes()).map((code: string[]) => {
    filterList.push([`postTerm = "${code[0]}"`, `postCcode = ${code[1]}`])
  })

  meiliClient
    .index(SearchingIndex.Post)
    .search(searchWord.value, {
      attributesToCrop: ["postTitle", "postContent"],
      attributesToHighlight: ["postTitle", "postContent"],
      cropLength: 40,
      filter: filterList,
      limit: pageSize.value,
      offset: (pageIndex.value - 1) * pageSize.value,
    })
    .then((res) => {
      total.value = res.estimatedTotalHits
      searchResult.value = <Post[]>res.hits.map((v) => v._formatted)
    })
}

const handleClick = (post: Post | undefined) => {
  if (post != undefined) {
    let boardIdRaw = BuildBoardId(post)
    let boardId = boardIdRaw.replace(/\//g, "-")
    router.push(`/forum/${boardId}/post/${post.postId}`)
    return
  }
}

onMounted(() => {
  GetMyCourseCodes().then()
  if (q != "") {
    handleSearch()
  }
})
</script>

<template>
  <div class="flex flex-col gap-3 items-center px-3">
    <a-card class="mt-10 w-full mx-3 md:max-w-[600px] lg:max-w-[800px]">
      <a-input
        v-model:value="searchWord"
        :bordered="false"
        :prefix="h(SearchOutlined)"
        class="w-full"
        placeholder="搜索论坛内容"
        size="large"
        @input="handleSearch"
      />
    </a-card>
    <a-card class="mt-4 w-full mx-3 md:max-w-[600px] lg:max-w-[800px]">
      <div class="font-bold">搜索结果</div>
      <div v-if="searchResult.length == 0" class="my-5"><a-empty /></div>
      <div v-else>
        <a-list
          :data-source="searchResult"
          :pagination="{
            pageSize: pageSize,
            current: pageIndex,
            total: total,
            showSizeChanger: true,
            onChange: handleSearch,
            'onUpdate:current': (val: number) => (pageIndex = val),
            'onUpdate:pageSize': (val: number) => (pageSize = val),
          }"
        >
          <template #renderItem="{ item }: { item: Post }">
            <a-list-item
              class="hover:bg-gray-50 rounded-xl hover:cursor-pointer transition duration-100"
              @click="handleClick(item)"
            >
              <a-list-item-meta>
                <template #title>
                  <div v-html="item.postTitle" class="searching-result" />
                </template>
                <template #description>
                  <div v-html="item.postContent" class="searching-result font-normal" />
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </a-card>
  </div>
</template>

<style>
.searching-result em {
  font-style: normal;
  text-shadow: 0 0 10px gold;
  color: green;
}
</style>
