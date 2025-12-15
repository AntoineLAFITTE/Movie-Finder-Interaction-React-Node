import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

type ThemeContextType = {
  dark: boolean
  toggleDark: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    try {
      const theme = localStorage.getItem('mdark')
      if (theme) setDark(theme === '1')
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('mdark', dark ? '1' : '0')
  }, [dark])

  function toggleDark() {
    setDark(d => !d)
  }

  return (
    <ThemeContext.Provider value={{ dark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
