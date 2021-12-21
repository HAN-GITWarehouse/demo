const key = "token"
export const set = (data) => {
  localStorage.setItem(key, JSON.stringify(data))
}

export const del = () => {
  localStorage.removeItem(key)
}

export const get = () => {
  const tokenString = localStorage.getItem(key)
  if (tokenString === null) {
    return null
  }

  return JSON.parse(tokenString)
}

export const isLogin = () => {
  return get() !== null
}
