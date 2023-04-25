export const getStorage = (key) => {
  const value = localStorage.getItem(key)
  if (value) {
    return null
  }
  return JSON.parse(value)
}

export const setStorage = (key, value) => {
  localStorage.setItem(key, value)
}

export const removeStorage = (key) => {
  localStorage.removeItem(key)
}

export const clearStorage = (key) => {
  localStorage.clear()
}

export const clearSessionStorage = (key) => {
  sessionStorage.clear()
}
