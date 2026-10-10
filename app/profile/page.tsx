import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600">Manage your personal information and account settings.</p>
        </header>

        <div className="space-y-8">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-indigo-100 border-4 border-white shadow-md overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-indigo-600 text-3xl font-bold">
                    {profile?.full_name?.[0] || 'U'}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{profile?.full_name || 'User'}</h2>
                <p className="text-slate-500">{profile?.role === 'individual' ? 'Individual Learner' : 'Company Member'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <input
                  type="text"
                  defaultValue={profile?.full_name}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Account Role</label>
                <div className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium">
                  {profile?.role}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 flex justify-end">
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
                Save Changes
              </button>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Account Management</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all text-left group">
                <div className="flex items-center gap-3">
                  <span className="text-xl">💾</span>
                  <div>
                    <p className="font-bold text-slate-900">Export My Data</p>
                    <p className="text-xs text-slate-500">Download all your learning records</p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-red-50 transition-all text-left group">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🗑️</span>
                  <div>
                    <p className="font-bold text-red-600">Delete Account</p>
                    <p className="text-xs text-red-400">Permanently remove all your data</p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400 group-hover:text-red-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
