'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '../../../lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SharingSettingsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [consents, setConsents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConsents()
  }, [])

  async function fetchConsents() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('sharing_consents')
      .select('*, organizations(name)')
      .eq('user_id', user.id)

    setConsents(data || [])
    setLoading(false)
  }

  async function toggleConsent(consentId: string, field: 'shared_skills' | 'shared_progress', currentValue: boolean) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('sharing_consents')
      .update({ [field]: !currentValue })
      .eq('id', consentId)

    if (!error) {
      fetchConsents()
    }
  }

  async function revokeConsent(consentId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('sharing_consents')
      .update({ revoked_at: new Date() })
      .eq('id', consentId)

    if (!error) {
      fetchConsents()
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Data Sharing & Privacy</h1>
          <p className="text-slate-600">You own your learning data. Choose which organizations can view your progress.</p>
        </header>

        <div className="space-y-6">
          {consents.length > 0 ? (
            consents.map(consent => (
              <div key={consent.id} className={`bg-white rounded-3xl shadow-sm border p-6 transition-all ${consent.revoked_at ? 'border-slate-200 opacity-60' : 'border-indigo-100'}`}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl">🏢</div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{consent.organizations?.name}</h3>
                      <p className="text-xs text-slate-500">Access granted on {new Date(consent.granted_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {consent.revoked_at && (
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase">Revoked</span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🎯</span>
                      <span className="text-sm font-medium text-slate-700">Skill Profile</span>
                    </div>
                    <button
                      onClick={() => toggleConsent(consent.id, 'shared_skills', consent.shared_skills)}
                      disabled={!!consent.revoked_at}
                      className={`w-10 h-5 rounded-full relative transition-all ${consent.shared_skills ? 'bg-indigo-600' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${consent.shared_skills ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📈</span>
                      <span className="text-sm font-medium text-slate-700">Learning Progress</span>
                    </div>
                    <button
                      onClick={() => toggleConsent(consent.id, 'shared_progress', consent.shared_progress)}
                      disabled={!!consent.revoked_at}
                      className={`w-10 h-5 rounded-full relative transition-all ${consent.shared_progress ? 'bg-indigo-600' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${consent.shared_progress ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>

                {!consent.revoked_at && (
                  <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => revokeConsent(consent.id)}
                      className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                    >
                      Revoke All Access
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Sharing</h3>
              <p className="text-slate-500 max-w-sm mx-auto">Your data is private by default. You can grant access to organizations via learning invitations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
