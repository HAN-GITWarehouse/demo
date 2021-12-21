import * as token from "../data/token"
import * as config from "../config/config"

export const login = () => {
  window.location.href = config.SSO_URL
}

export const isLogin = () => {
  return token.isLogin()
}

export const check = () => {
  if (!isLogin()) login()
}
