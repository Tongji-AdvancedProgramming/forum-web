import { message } from "ant-design-vue"
import { AxiosError, AxiosResponse } from "axios"
import router from "@/tools/router.ts"

interface Return {
  code: number
  msg: string
  data?: any
}

/**
 * Axios的错误处理可以提取出来公共的方法。
 * @param result 在这里调用axios的函数
 * @param operation 操作名称
 * @param callback 成功的回调
 * @param allFinishCallback 所有操作结束后的回掉
 */
export function doAxios(
  result: Promise<AxiosResponse<Return>>,
  operation: string,
  callback: (data: any | null) => void,
  allFinishCallback?: () => void,
) {
  result
    .then((res: AxiosResponse) => {
      if (res.data.code && res.data.code === 10000) {
        callback(res.data.data)
      } else {
        if (res.data.code) {
          message.warn(`${operation}失败：${res.data.msg}`).then(() => {})
        } else {
          message.warn(`${operation}失败：服务器内部错误`).then(() => {})
        }
      }
    })
    .catch((err: AxiosError) => {
      if (err.response) {
        if (err.response.status == 401) {
          message.warn(`您未登录或登录失效，带您去登录。`).then(() => {
            router.push("/login").then(() => {})
          })
        } else if (err.response.status == 403) {
          message.warn(`接口拒绝访问`).then(() => {})
        } else {
          message.warn(`${operation}失败：服务器内部错误`).then(() => {})
        }
      } else if (err.request) {
        message.warn(`${operation}失败：网络错误`).then(() => {})
      } else {
        message.warn(`${operation}失败：浏览器错误`).then(() => {})
      }
    })
    .finally(() => {
      if (allFinishCallback) {
        allFinishCallback()
      }
    })
}
