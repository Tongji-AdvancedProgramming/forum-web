import { LRUCache } from "lru-cache"
import { doAxiosAsyncFull } from "@/tools/axios.ts"
import axios from "axios"
import { StudentShortInfo } from "@/model/QuickType/StudentShortInfo.ts"

const baseUrl = "http://10.80.43.196"

export function GetAvatarUrl(uid: string) {
  return `${baseUrl}/avatar/${uid}`
}

export function GetCardBackgroundUrl(uid: string) {
  return `${baseUrl}/card/${uid}`
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
