/**
 * boardId的设计就是彻头彻尾的失败，
 * 但是现在没精力改了，只好将就用下去了
 */

import { Post } from "@/model/QuickType/Post.ts"

export function BuildBoardId(post: Post) {
  if (post.postWeek == -1) {
    // 整体问题
    return `${post.postTerm}_${post.postCcode}`
  } else if (post.postHwId == -1) {
    // 周总体问题
    return `${post.postTerm}_${post.postCcode}_w${post.postWeek}`
  } else {
    // 作业问题
    return `${post.postTerm}_${post.postCcode}_w${post.postWeek}_${post.postHwId}`
  }
}
