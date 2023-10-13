import { createStore } from "vuex"
import { Student } from "@/model/Student.ts"

interface StoreData {
  user: Student
  userLevel: number
}

export const store = createStore<StoreData>({
  state: {
    loggedIn: false,
    user: {
      stuAddDate: undefined,
      stuClassFullName: "",
      stuClassShortName: "",
      stuCourse: [],
      stuEnable: "",
      stuGrade: "",
      stuName: "",
      stuNo: "",
      stuPassword: "",
      stuSex: "",
      stuTerm: "",
      stuUserLevel: "",
    },
    userLevel: 0,
  },
  mutations: {
    setUser(state, user: Student) {
      state.loggedIn = true
      state.user = user
      state.userLevel = Number(user.stuUserLevel)
    },
    logOut(state) {
      state.loggedIn = false
    },
  },
})
