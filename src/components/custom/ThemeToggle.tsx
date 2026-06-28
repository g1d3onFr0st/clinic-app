// import { useEffect, useState } from 'react'

import { Moon, Sun } from "lucide-react"
import { Button } from "../ui/button"
import { useAppContext } from "#/integrations/appContext/useAppContext"
import { toast } from "sonner"

// type ThemeMode = 'light' | 'dark' | 'auto'

// function getInitialMode(): ThemeMode {
//   if (typeof window === 'undefined') {
//     return 'auto'
//   }

//   const stored = window.localStorage.getItem('theme')
//   if (stored === 'light' || stored === 'dark' || stored === 'auto') {
//     return stored
//   }

//   return 'auto'
// }

// function applyThemeMode(mode: ThemeMode) {
//   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
//   const resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode

//   document.documentElement.classList.remove('light', 'dark')
//   document.documentElement.classList.add(resolved)

//   if (mode === 'auto') {
//     document.documentElement.removeAttribute('data-theme')
//   } else {
//     document.documentElement.setAttribute('data-theme', mode)
//   }

//   document.documentElement.style.colorScheme = resolved
// }

// export default function ThemeToggle() {
//   const [mode, setMode] = useState<ThemeMode>('auto')

//   useEffect(() => {
//     const initialMode = getInitialMode()
//     setMode(initialMode)
//     applyThemeMode(initialMode)
//   }, [])

//   useEffect(() => {
//     if (mode !== 'auto') {
//       return
//     }

//     const media = window.matchMedia('(prefers-color-scheme: dark)')
//     const onChange = () => applyThemeMode('auto')

//     media.addEventListener('change', onChange)
//     return () => {
//       media.removeEventListener('change', onChange)
//     }
//   }, [mode])

//   function toggleMode() {
//     const nextMode: ThemeMode =
//       mode === 'light' ? 'dark' : mode === 'dark' ? 'auto' : 'light'
//     setMode(nextMode)
//     applyThemeMode(nextMode)
//     window.localStorage.setItem('theme', nextMode)
//   }

//   const label =
//     mode === 'auto'
//       ? 'Theme mode: auto (system). Click to switch to light mode.'
//       : `Theme mode: ${mode}. Click to switch mode.`

//   return (
//     <button
//       type="button"
//       onClick={toggleMode}
//       aria-label={label}
//       title={label}
//       className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--sea-ink)] shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5"
//     >
//       {mode === 'auto' ? 'Auto' : mode === 'dark' ? 'Dark' : 'Light'}
//     </button>
//   )
// }

export function ThemeToggle() {
  const { theme, setTheme } = useAppContext()
  const newTheme = theme === "dark" ? "light" : "dark"

  return (
    <Button
      type="button"
      onClick={() => {
        setTheme(newTheme)
        toast.success(`Theme Changed To ${theme === "dark" ? "light" : "dark"}`)
      }}
      className="rounded-full border bg-background/50 hover:bg-background/50 text-foreground px-3 py-1.5 text-sm font-semibold shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5"
    >
      Switch to {newTheme} {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  )
}
