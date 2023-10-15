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
  if (raw.stuCno1 && raw.stuCno1.length > 0 && raw.stuCno1IsDel !== "1") {
    student.stuCourse.push(raw.stuCno1)
  }
  if (raw.stuCno2 && raw.stuCno2.length > 0 && raw.stuCno2IsDel !== "1") {
    student.stuCourse.push(raw.stuCno2)
  }
  if (raw.stuCno3 && raw.stuCno3.length > 0 && raw.stuCno3IsDel !== "1") {
    student.stuCourse.push(raw.stuCno3)
  }
  return student
}

export function getStudentString(student: Student): String {
  return `${student.stuNo}-${student.stuClassShortName}-${student.stuNo}`
}
