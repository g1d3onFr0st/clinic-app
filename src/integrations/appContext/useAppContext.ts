import { useContext } from "react"
import { myContext } from "./appContext"

export function useAppContext() {
  const ctx = useContext(myContext)

  if (!ctx) {
    throw new Error("useAppContext must be used within AppContextProvider")
  }

  return ctx
}
