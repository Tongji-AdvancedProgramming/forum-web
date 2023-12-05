// To parse this data:
//
//   import { Convert, HomeworkUploaded } from "./file";
//
//   const homeworkUploaded = Convert.toHomeworkUploaded(json);

import dayjs from "dayjs"

export interface HomeworkUploaded {
  hwupTerm: string
  hwupCcode: string
  hwupId: string
  hwupWeek: number
  hwupChapter: number
  hwupFilename: string
  hwupFilemd5: string
  hwupDescription: string
  hwupDateAdd: string
  hwupIsDel: HwupIsDel
  hwupComment: string
}

export type HwupIsDel = "0" | "1"

export const DefaultHomeworkUploaded: HomeworkUploaded = {
  hwupCcode: "",
  hwupChapter: 0,
  hwupComment: "",
  hwupDateAdd: "",
  hwupDescription: "",
  hwupFilemd5: "",
  hwupFilename: "",
  hwupId: "",
  hwupIsDel: "0",
  hwupTerm: "",
  hwupWeek: 0,
}

// Converts JSON strings to/from your types
export class Convert {
  public static toHomeworkUploaded(json: string): HomeworkUploaded {
    return JSON.parse(json)
  }

  public static homeworkUploadedToJson(value: HomeworkUploaded): string {
    return JSON.stringify(value)
  }
}
