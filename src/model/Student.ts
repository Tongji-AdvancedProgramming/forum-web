import { StudentRaw } from "@/model/QuickType/StudentRaw.ts"

export interface Student {
  stuNo: string
  stuTerm: string
  stuGrade: string
  stuName: string
  stuSex: string
  stuPassword: string
  stuClassFullName: string
  stuClassShortName: string
  stuUserLevel: string
  stuEnable: string
  stuAddDate: Date
  stuCourse: string[]
}

/**
 * 原始的数据Cno没有做成联接，这里手动改一下
 * @param raw
 */
export function convertToStudent(raw: StudentRaw): Student {
  let student: Student = {
    stuAddDate: raw.stuAddDate,
    stuClassFullName: raw.stuClassFname,
    stuClassShortName: raw.stuClassSname,
    stuCourse: [],
    stuEnable: raw.stuEnable,
    stuGrade: raw.stuGrade,
    stuName: raw.stuName,
    stuNo: raw.stuNo,
    stuPassword: raw.stuPassword,
    stuSex: raw.stuSex,
    stuTerm: raw.stuTerm,
    stuUserLevel: raw.stuUserlevel,
  }
}
