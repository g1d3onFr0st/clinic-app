import { changeDBThemeServerFn } from "#/lib/serverFns"
import { useServerFn } from "@tanstack/react-start"
import { useEffect, useMemo, useState } from "react"

export function useAppContextValues(initialTheme: "light" | "dark") {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [theme, setTheme] = useState(initialTheme)
  const changeTheme = useServerFn(changeDBThemeServerFn)

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark")

    const timeout = setTimeout(async () => {
      await changeTheme({ data: { theme } })
    }, 300)

    return () => clearTimeout(timeout)
  }, [theme, changeTheme])

  const memoValues = useMemo(
    () => ({
      isLoggedIn,
      setIsLoggedIn,
      theme,
      setTheme,
    }),
    [isLoggedIn, theme],
  )
  return memoValues
}

export type AppContextType = ReturnType<typeof useAppContextValues>
