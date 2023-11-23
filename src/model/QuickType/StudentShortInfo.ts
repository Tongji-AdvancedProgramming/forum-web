// To parse this data:
//
//   import { Convert, StudentShortInfo } from "./file";
//
//   const studentShortInfo = Convert.toStudentShortInfo(json);

export interface StudentShortInfo {
  nickName: string
  realName: string
  description: string
  stuNo: string
  major: string
  role: number
}

// Converts JSON strings to/from your types
export class Convert {
  public static toStudentShortInfo(json: string): StudentShortInfo {
    return JSON.parse(json)
  }

  public static studentShortInfoToJson(value: StudentShortInfo): string {
    return JSON.stringify(value)
  }
}
