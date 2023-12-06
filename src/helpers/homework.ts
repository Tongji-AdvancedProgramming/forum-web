import { LRUCache } from "lru-cache"
import { doAxiosAsyncFull } from "@/tools/axios.ts"
import axios from "axios"
import { Homework } from "@/model/QuickType/Board.ts"

let homeworkCache = new LRUCache<string, Homework>({
  max: 100,
  async fetchMethod(key) {
    let tokens = key.split("*")
    let term = tokens[0]
    let hwId = tokens[1]
    let cno = tokens[2]
    return <Homework>(
      await doAxiosAsyncFull(
        axios.get("/api/homework", { params: { term: term, hwId: hwId, courseNo: cno } }),
        "获取作业信息",
      )
    )
  },
})

export async function GetHomeworkInfo(term: string, hwId: number, courseNo: string) {
  let storeKey = `${term}*${hwId}*${courseNo}`
  return homeworkCache.get(storeKey) ?? (await homeworkCache.fetch(storeKey))
}
