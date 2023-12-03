// To parse this data:
//
//   import { Convert, Board } from "./file";
//
//   const board = Convert.toBoard(json);

export type PostLocation = "COURSE" | "HOMEWORK" | "WEEKLY" | "WEEK_SUMMARY" | "COURSE_SUMMARY"

export interface Board {
  id: string
  location: PostLocation
  course: Course
  week: number
  homework?: Homework
}

export interface Course {
  courseTerm: string
  courseNo: string
  courseCode: string
  courseFname: string
  courseSname: string
  courseType: string
}

export interface Homework {
  hwTerm: string
  hwCcode: string
  hwId: number
  hwWeek: number
  hwChapter: number
  hwFilename: string
  hwDescription: string
  hwBdate: Date
  hwEdate: Date
  hwAddDate: Date
}

export const DefaultHomework: Homework = {
  hwAddDate: new Date(),
  hwBdate: new Date(),
  hwCcode: "",
  hwChapter: 0,
  hwDescription: "",
  hwEdate: new Date(),
  hwFilename: "",
  hwId: 0,
  hwTerm: "",
  hwWeek: 0,
}

// Converts JSON strings to/from your types
export class Convert {
  public static toBoard(json: string): Board {
    return JSON.parse(json)
  }

  public static boardToJson(value: Board): string {
    return JSON.stringify(value)
  }
}
