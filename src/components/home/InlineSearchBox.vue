<script setup lang="ts">
import { ref } from "vue"
import { SearchOutlined } from "@ant-design/icons-vue"
import { Post } from "@/model/QuickType/Post.ts"
import { useMeili } from "@/tools/meilisearch.ts"
import { ForumConfig } from "@/config.ts"
import SearchingIndex = ForumConfig.SearchingIndex
import { useRouter } from "vue-router"
import { BuildBoardId } from "@/helpers/board.ts"

const emits = defineEmits<{
  (e: "focusout"): void
}>()

const router = useRouter()

const options = ref<{ value: string }[]>([])
const lastSearchWord = ref("")
const searchResults = new Map<string, Post>()

const meiliClient = useMeili()
const handleSearch = (val: string) => {
  meiliClient
    .index(SearchingIndex.Post)
    .search(val, {
      attributesToCrop: ["postTitle", "postContent"],
      attributesToHighlight: ["postTitle", "postContent"],
      cropLength: 20,
      limit: 6,
    })
    .then((res) => {
      lastSearchWord.value = val
      options.value = []
      res.hits.forEach((hit) => {
        const postId = (<Post>hit).postId.toString()
        searchResults.set(postId, <Post>hit._formatted)
        options.value.push({ value: postId })
      })
      options.value.push({ value: "Finish" + res.estimatedTotalHits.toString() })
    })
}

const handleSelect = (val: string) => {
  if (val.startsWith("Finish")) {
    router.push(`/search?q=${lastSearchWord.value}`)
    return
  }

  let post = searchResults.get(val)
  if (post != undefined) {
    let boardIdRaw = BuildBoardId(post)
    let boardId = boardIdRaw.replace(/\//g, "-")
    router.push(`/forum/${boardId}/post/${post.postId}`)
    return
  }
}
</script>

<template>
  <a-auto-complete :options="options" @search="handleSearch" @select="handleSelect">
    <a-input placeholder="搜索论坛内容" :bordered="false" @focusout="emits('focusout')" style="width: 400px">
      <template #prefix>
        <div class="text-gray-400">
          <search-outlined />
        </div>
      </template>
    </a-input>

    <template #option="{ value: val }">
      <div v-if="(<string>val).startsWith('Finish')">
        <search-outlined /> 查看所有结果 ({{ (val as string).substring(6) }})
      </div>
      <div v-else class="p-1 flex flex-col">
        <div
          v-if="(searchResults.get(val)?.postTitle?.length ?? 0) > 0"
          class="font-bold searching-result"
          v-html="searchResults.get(val)?.postTitle ?? ''"
        ></div>
        <div v-html="searchResults.get(val)?.postContent ?? ''" class="searching-result" />
      </div>
    </template>
  </a-auto-complete>
</template>

<style>
.searching-result em {
  font-style: normal;
  text-shadow: 0 0 10px gold;
  color: green;
}
</style>
