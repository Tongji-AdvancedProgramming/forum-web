// To parse this data:
//
//   import { Convert, CourseTree } from "./file";
//
//   const courseTree = Convert.toCourseTree(json);

export interface CourseTree {
  courses: Course[]
}

export interface Course {
  courseTerm: string
  courseNo: string
  courseCode: string
  courseFname: string
  courseSname: string
  courseType: string
  weeks?: Week[]
}

export interface Week {
  number: number
  content: string
  homeworks: Homework[]
}

export interface Homework {
  hwTerm: string
  hwCcode: string
  hwId: string
  hwWeek: number
  hwChapter: number
  hwFilename: string
  hwDescription: string
  hwBdate: Date
  hwEdate: Date
  hwScore: number
  hwDateAdd: Date
}

// Converts JSON strings to/from your types
export class Convert {
  public static toCourseTree(json: string): CourseTree {
    return JSON.parse(json)
  }

  public static courseTreeToJson(value: CourseTree): string {
    return JSON.stringify(value)
  }
}
