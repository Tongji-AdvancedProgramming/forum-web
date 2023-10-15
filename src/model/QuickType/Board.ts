// To parse this data:
//
//   import { Convert, Board } from "./file";
//
//   const board = Convert.toBoard(json);

export interface Board {
  id: string
  location: "COURSE" | "HOMEWORK" | "WEEKLY"
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

// Converts JSON strings to/from your types
export class Convert {
  public static toBoard(json: string): Board {
    return JSON.parse(json)
  }

  public static boardToJson(value: Board): string {
    return JSON.stringify(value)
  }
}
