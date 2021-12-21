import axios from "axios"
import * as token from "../data/token"
import * as config from "../config/config"
import baseURL from "./base.url"
import * as coursewareStorage from "../data/courseware"

const env_path = {
  development: "dev",
  production: "pro",
  test: "test",
}

const service = new axios.create({
  baseURL: baseURL.api,
})

service.interceptors.request.use(
  (config) => {
    config.headers.Authorization = token.get()
    return config
  },
  (error) => Promise.reject(error)
)

service.interceptors.response.use(
  (res) => {
    if (res.data.code === 40001) {
      window.location.href = config.SSO_URL
    } else if (res.data.code === 50003) {
      window.location.href = config.SSO_URL
    }
    return res
  },
  (error) => Promise.reject(error)
)

export const loadJson = () => {
  console.log("api data, load json: e5cbac7b-56bb-4482-a6f4-6595ed160a7a")

  return service({
    method: "get",
    url: "assets/resources/courseware/e5cbac7b-56bb-4482-a6f4-6595ed160a7a.json",
  })
}

export const behaviorStart = (data) => {
  console.log("api data, statement: ", data)

  return service({
    method: "post",
    url: "/api/games/statement",
    data,
  })
}

export const lastPage = (id) => {
  console.log("api data, last page: e5cbac7b-56bb-4482-a6f4-6595ed160a7a")

  service({
    method: "post",
    url: "/api/games/courseware/last-page/e5cbac7b-56bb-4482-a6f4-6595ed160a7a",
    data: { last_page: id },
  })
}

// 获取页面内容
export const getContent = (id) => {
  console.log("api data, get content: ", id)

  return service({
    method: "get",
    url: `api/games/resources/${id}/p/${localStorage.getItem("lang")}.json`,
  })
}

// 获取章节答题详情
export const getReport = (id, lang) => {
  console.log("api data, get report: ", id)

  return service({
    method: "get",
    url: `api/games/user/chapter/score/${id}/${lang}`,
  })
}

export const getJson = (id) => {
  console.log("api data, get json: ", id)

  return service({
    method: "get",
    url: `${location.origin}/assets/pages/${id}/pc/${localStorage.getItem(
      "lang"
    )}/texture.json`,
  })
}
