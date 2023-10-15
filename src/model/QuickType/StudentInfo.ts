// To parse this data:
//
//   import { Convert, StudentInfo } from "./file";
//
//   const studentInfo = Convert.toStudentInfo(json);

export interface StudentInfo {
  stuNo: string
  avatar: string
  nickname: string
}

// Converts JSON strings to/from your types
export class Convert {
  public static toStudentInfo(json: string): StudentInfo {
    return JSON.parse(json)
  }

  public static studentInfoToJson(value: StudentInfo): string {
    return JSON.stringify(value)
  }
}
