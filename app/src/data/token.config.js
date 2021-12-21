// import * as sso from "../api/sso";
// import * as tokenStorage from "./token";

export const create = (config, needAuthorization = false) => {
  // console.log('token config create')
  // if (config.method == 'post') {
  //     config.data = JSON.stringify(config.data)
  // }

  if (needAuthorization && tokenStorage.isLogin()) {
    // console.log('request service headers setting: ', config, tokenStorage.isLogin())
    const token = tokenStorage.get()
    // console.log('token storage:', token)

    const t = new Date().getTime() - token.created < token.expires_in
    console.log("token expired:", new Date().getTime() - token.created)
    if (!t) {
      sso.refreshToken(token.refresh_token)
    }

    config.headers = {
      Authorization: "token.access_token",
    }
  }

  // console.log('request service headers：', config)
  // console.log('token config create complete')

  return config
}
