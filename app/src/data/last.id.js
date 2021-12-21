import * as lastid from "../config/config"

const key = "last-id"

export const set = (val) => {
  if (val === null || val.trim().length === 0 || val == lastid.HOME_ID) {
    return
  }

  localStorage.setItem(key, val)
}

export const get = () => {
  return localStorage.getItem(key)
}

export const clear = () => {
  localStorage.removeItem(key)
}
