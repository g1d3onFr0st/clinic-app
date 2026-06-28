import { type AppContextType } from "./useAppContextValues"
import { createContext } from "react"

export const myContext = createContext<AppContextType | null>(null)
