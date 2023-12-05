import { LRUCache } from "lru-cache"
import { doAxiosAsyncFull } from "@/tools/axios.ts"
import axios from "axios"
import { StudentShortInfo } from "@/model/QuickType/StudentShortInfo.ts"
import { ForumConfig } from "@/config.ts"
import App = ForumConfig.App

export function GetAvatarUrl(uid: string) {
  return `${App.ResourceUrl}/avatar/${uid}`
}

export function GetCardBackgroundUrl(uid: string) {
  return `${App.ResourceUrl}/card/${uid}`
}

let userShortInfoCache = new LRUCache<string, StudentShortInfo>({
  max: 100,
  async fetchMethod(key) {
    return <StudentShortInfo>(
      await doAxiosAsyncFull(axios.get("/api/user/shortInfo", { params: { id: key } }), "获取用户信息")
    )
  },
})

export async function GetStudentShortInfo(uid: string) {
  return userShortInfoCache.get(uid) ?? (await userShortInfoCache.fetch(uid))
}
