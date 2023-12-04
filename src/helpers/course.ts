import { doAxiosAsyncFull } from "@/tools/axios.ts"
import dayjs from "dayjs"
import axios from "axios"

let myCourseCodes: string[][] = []
let myCourseCodesValidBefore = new Date(2020, 8, 10)

export async function GetMyCourseCodes() {
  if (dayjs(myCourseCodesValidBefore).isBefore(dayjs())) {
    myCourseCodes = <string[][]>await doAxiosAsyncFull(axios.get("/api/course/my-course-code"), "获取可用课程")
    myCourseCodesValidBefore = dayjs().add(8, "hour").toDate()
  }
  return myCourseCodes
}
