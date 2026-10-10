import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'indigo-violet' | 'ocean-blue' | 'emerald-green' | 'rose-pink' | 'sunset-orange'
type Mode = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  mode: Mode
  setTheme: (theme: Theme) => void
  setMode: (mode: Mode) => void
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('indigo-violet')
  const [mode, setMode] = useState<Mode>('system')

  useEffect(() => {
    const root = window.document.documentElement
    root.setAttribute('data-theme', theme)

    const applyMode = (m: Mode) => {
      if (m === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.classList.toggle('dark', systemDark)
      } else {
        root.classList.toggle('dark', m === 'dark')
      }
    }

    applyMode(mode)
  }, [theme, mode])

  const toggleMode = () => {
    setMode(prev => prev === 'light' ? 'dark' : prev === 'dark' ? 'system' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
