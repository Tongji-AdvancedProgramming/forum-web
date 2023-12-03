import { LRUCache } from "lru-cache"
import { doAxiosAsyncFull } from "@/tools/axios.ts"
import axios from "axios"
import { Homework } from "@/model/QuickType/Board.ts"

let homeworkCache = new LRUCache<string, Homework>({
  max: 100,
  async fetchMethod(key) {
    let term = key.substring(0, key.indexOf("*"))
    let hwId = key.substring(term.length + 1)
    return <Homework>(
      await doAxiosAsyncFull(axios.get("/api/homework", { params: { term: term, hwId: hwId } }), "获取作业信息")
    )
  },
})

export async function GetHomeworkInfo(term: string, hwId: number) {
  let storeKey = `${term}*${hwId}`
  return homeworkCache.get(storeKey) ?? (await homeworkCache.fetch(storeKey))
}
