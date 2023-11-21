import { createStore, useStore as baseUseStore, Store } from "vuex"
import { Student } from "@/model/Student.ts"
import { StudentInfo } from "@/model/QuickType/StudentInfo.ts"
import { InjectionKey } from "vue"

export interface StoreData {
  loggedIn: boolean
  user: Student
  userLevel: number
  userInfo: StudentInfo
}

export const key: InjectionKey<Store<StoreData>> = Symbol()

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
    userInfo: { avatar: "", nickname: "", stuNo: "" },
  },
  mutations: {
    setUser(state: StoreData, user: Student) {
      state.loggedIn = true
      state.user = user
      state.userLevel = Number(user.stuUserLevel)
    },
    setUserInfo(state: StoreData, userInfo: StudentInfo) {
      state.userInfo = userInfo
    },
    logOut(state: StoreData) {
      state.loggedIn = false
    },
  },
})

export function useStore() {
  return baseUseStore(key)
}