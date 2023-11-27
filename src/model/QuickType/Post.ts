// To parse this data:
//
//   import { Convert, Post } from "./file";
//
//   const post = Convert.toPost(json);

export interface Post {
  postId: number
  postTerm: string
  postCcode: string
  postHwupOrHwId: string
  postWeek: number
  postChapter: number
  postAnswerId: number
  postType: string
  postSno: string
  postPriority: string
  postTag01: "0" | "1"
  postTag02: "0" | "1"
  postTag03: "0" | "1"
  postTag04: "0" | "1"
  postTag05: "0" | "1"
  postTag06: "0" | "1"
  postTag07: "0" | "1"
  postTag08: "0" | "1"
  postTag09: "0" | "1"
  postTag10: "0" | "1"
  postTitle: string
  postContent: string
  postDate: Date
  postIsDel: "0" | "1"
  postComment: string
}

// Converts JSON strings to/from your types
export class Convert {
  public static toPost(json: string): Post {
    return JSON.parse(json)
  }

  public static postToJson(value: Post): string {
    return JSON.stringify(value)
  }
}

export const DefaultPost: Post = {
  postId: 0,
  postTerm: "",
  postCcode: "",
  postHwupOrHwId: "",
  postWeek: 0,
  postChapter: 0,
  postAnswerId: 0,
  postType: "",
  postSno: "",
  postPriority: "",
  postTag01: "0",
  postTag02: "0",
  postTag03: "0",
  postTag04: "0",
  postTag05: "0",
  postTag06: "0",
  postTag07: "0",
  postTag08: "0",
  postTag09: "0",
  postTag10: "0",
  postTitle: "",
  postContent: "",
  postDate: new Date(),
  postIsDel: "0",
  postComment: "",
}
