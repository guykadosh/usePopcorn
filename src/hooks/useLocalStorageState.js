import { useEffect, useState } from 'react'

export function useLocalStorageState(initalState, key) {
  const [value, setValue] = useState(function () {
    const storeValue = localStorage.getItem(key) || initalState
    return JSON.parse(storeValue)
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])

  return [value, setValue]
}
