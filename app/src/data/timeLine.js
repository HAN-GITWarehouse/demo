const key = 'timeLine'

export const get = () => {
  return localStorage.getItem(key)
}

export const set = (id) => {
  let arr = get() ? get() : []
  arr.push(id)
  localStorage.setItem(key, JSON.stringify(arr))
}

export const clear = () => {
  localStorage.removeItem(key)
}