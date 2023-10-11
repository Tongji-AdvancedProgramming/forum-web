// To parse this data:
//
//   import { Convert, StudentRaw } from "./file";
//
//   const studentRaw = Convert.toStudentRaw(json);

export interface StudentRaw {
  stuNo: string
  stuTerm: string
  stuGrade: string
  stuName: string
  stuSex: string
  stuPassword: string
  stuClassFname: string
  stuClassSname: string
  stuUserlevel: string
  stuEnable: string
  stuAddDate: Date
  stuCno1: string
  stuCno1IsDel: string
  stuCno2: string
  stuCno2IsDel: string
  stuCno3: string
  stuCno3IsDel: string
  stuIsDel: string
  stuComment: string
}

// Converts JSON strings to/from your types
export class Convert {
  public static toStudentRaw(json: string): StudentRaw {
    return JSON.parse(json)
  }

  public static studentRawToJson(value: StudentRaw): string {
    return JSON.stringify(value)
  }
}
