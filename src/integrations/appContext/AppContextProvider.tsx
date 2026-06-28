import { type ReactNode } from "react"
import { myContext } from "./appContext"
import { useAppContextValues } from "./useAppContextValues"

export function AppContextProvider({
  children,
  initialTheme,
}: {
  children: ReactNode
  initialTheme: "light" | "dark"
}) {
  const value = useAppContextValues(initialTheme)
  return <myContext.Provider value={value}>{children}</myContext.Provider>
}
