'use client'

import { useTheme } from '../../../components/ThemeContext'
import { createClient } from '../../../lib/supabase/client'
import { useState, useEffect } from 'react'

const THEMES = [
  { id: 'indigo-violet', name: 'Indigo Violet', color: 'bg-indigo-600' },
  { id: 'ocean-blue', name: 'Ocean Blue', color: 'bg-sky-500' },
  { id: 'emerald-green', name: 'Emerald Green', color: 'bg-emerald-500' },
  { id: 'rose-pink', name: 'Rose Pink', color: 'bg-rose-500' },
  { id: 'sunset-orange', name: 'Sunset Orange', color: 'bg-orange-500' },
]

const MODES = [
  { id: 'light', name: 'Light Mode' },
  { id: 'dark', name: 'Dark Mode' },
  { id: 'system', name: 'System Default' },
]

export default function AppearanceSettingsPage() {
  const { theme, mode, setTheme, setMode } = useTheme()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  async function savePreference(key: string, value: any) {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('user_preferences')
        .upsert({ user_id: user.id, [key]: value, updated_at: new Date() })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Appearance</h1>
          <p className="text-slate-600">Personalize your experience with custom themes and accessibility options.</p>
        </header>

        <div className="space-y-8">
          {/* Theme Selection */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Select Theme</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id as any)
                    savePreference('theme', t.id)
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-3 ${
                    theme === t.id ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full ${t.color}`} />
                  <span className="text-sm font-medium text-slate-700">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mode Selection */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Color Mode</h2>
            <div className="flex flex-col gap-3">
              {MODES.map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    setMode(m.id as any)
                    savePreference('mode', m.id)
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all text-left flex justify-between items-center ${
                    mode === m.id ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <span className="text-sm font-medium text-slate-700">{m.name}</span>
                  {mode === m.id && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Accessibility</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="font-bold text-slate-900">Reduced Motion</p>
                  <p className="text-xs text-slate-500">Disable smooth transitions and animations</p>
                </div>
                <button className="w-12 h-6 bg-slate-300 rounded-full relative transition-all">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
