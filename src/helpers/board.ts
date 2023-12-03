/**
 * boardId的设计就是彻头彻尾的失败，
 * 但是现在没精力改了，只好将就用下去了
 */

import { Post } from "@/model/QuickType/Post.ts"
import { Board, Course, Homework, PostLocation } from "@/model/QuickType/Board.ts"

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

function isNumeric(str: string) {
  return /^\d+$/.test(str)
}

/**
 * 后端代码“org.tongji.programming.service.impl.BoardServiceImpl”的TS实现
 */
export function SolveBoardId(boardId: string, isSafe: boolean): Board {
  if (isSafe) {
    boardId = boardId.replace(/-/g, "/")
  }

  // 切分ID
  let tokens = boardId.split("_")
  if (tokens.length < 2 || tokens.length > 4) {
    throw new Error("传入的ID格式不正确：组成部分不为2、3或4.")
  }

  // 识别学期和课程
  let term = tokens[0]
  let courseCode = tokens[1]
  if (!isNumeric(courseCode)) {
    throw new Error("传入的ID格式不正确：课程代码不是纯数字")
  }

  // 识别板块位置
  let location: PostLocation = "HOMEWORK"
  if (tokens.length == 2) {
    location = "COURSE_SUMMARY"
  } else if (tokens.length == 3) {
    if ("general" === tokens[2]) {
      location = "COURSE"
    } else {
      location = "WEEKLY"
    }
  } else if ("p" === tokens[3]) {
    location = "WEEK_SUMMARY"
  }

  // 识别周次
  let week = 0
  if (location != "COURSE" && location != "COURSE_SUMMARY") {
    let weekStr = tokens[2].substring(1)
    if (!tokens[2].startsWith("w") || !isNumeric(weekStr)) {
      throw new Error("传入的ID格式不正确：周次格式不正确")
    }
    week = Number(weekStr)
  }

  // 识别所属作业
  let hwId: string | null = null
  if (location == "HOMEWORK") {
    hwId = tokens[3]
  }

  // 制作成Board结构
  let board: Board
  board = {
    course: <Course>{
      courseTerm: term,
      courseCode: courseCode,
    },
    homework: undefined,
    id: boardId,
    location: location,
    week: week,
  }
  if (hwId != null) {
    board.homework = <Homework>{
      hwTerm: term,
      hwCcode: courseCode,
      hwId: Number(hwId!),
    }
  }

  return board
}
