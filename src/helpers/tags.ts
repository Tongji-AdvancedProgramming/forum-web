import { Tag } from "@/model/QuickType/Tag.ts"
import dayjs from "dayjs"
import { doAxiosAsyncFull } from "@/tools/axios.ts"
import axios from "axios"
import { Post } from "@/model/QuickType/Post.ts"

let tags: Tag[] = []
let tagsCacheValidBefore = new Date(2020, 8, 10)

const fetchTags = async () => {
  tags = <Tag[]>await doAxiosAsyncFull(axios.get("/api/meta/tags"), "获取标签信息")
  tags.forEach((v) => {
    v.tagBgcolor = "#" + v.tagBgcolor
    v.tagFgcolor = "#" + v.tagFgcolor
  })
}

export async function GetTag(index: number) {
  if (dayjs(tagsCacheValidBefore).isBefore(dayjs())) {
    await fetchTags()
  }
  if (index < 0 || index >= tags.length) {
    throw new Error("非法的Index")
  } else {
    return tags[index]
  }
}

export async function GetTags() {
  if (dayjs(tagsCacheValidBefore).isBefore(dayjs())) {
    await fetchTags()
  }
  return tags
}

export function SolvePostTags(post: Post) {
  let tags: string[] = []
  if (post.postTag01 == "1") tags.push("0")
  if (post.postTag02 == "1") tags.push("1")
  if (post.postTag03 == "1") tags.push("2")
  if (post.postTag04 == "1") tags.push("3")
  if (post.postTag05 == "1") tags.push("4")
  if (post.postTag06 == "1") tags.push("5")
  if (post.postTag07 == "1") tags.push("6")
  if (post.postTag08 == "1") tags.push("7")
  if (post.postTag09 == "1") tags.push("8")
  if (post.postTag10 == "1") tags.push("9")
  return tags
}

export function SetPostTags(post: Post, tags: number[]) {
  post.postTag01 = tags.includes(0) ? "1" : "0"
  post.postTag02 = tags.includes(1) ? "1" : "0"
  post.postTag03 = tags.includes(2) ? "1" : "0"
  post.postTag04 = tags.includes(3) ? "1" : "0"
  post.postTag05 = tags.includes(4) ? "1" : "0"
  post.postTag06 = tags.includes(5) ? "1" : "0"
  post.postTag07 = tags.includes(6) ? "1" : "0"
  post.postTag08 = tags.includes(7) ? "1" : "0"
  post.postTag09 = tags.includes(8) ? "1" : "0"
  post.postTag10 = tags.includes(9) ? "1" : "0"
}
