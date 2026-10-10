import { createClient } from '../../../lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function CompanyDashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  // Get the user's organization
  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id, role')
    .eq('user_id', user.id)
    .single()

  if (!membership) redirect('/company/onboarding')

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', membership.organization_id)
    .single()

  // Get basic stats
  const { count: memberCount } = await supabase
    .from('organization_members')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', membership.organization_id)

  const { count: activePaths } = await supabase
    .from('learning_paths')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', membership.organization_id)

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-900">Organization Dashboard</h1>
              <span className="px-3 py-1 bg-violet-100 text-violet-600 text-xs font-bold rounded-full uppercase">
                {org?.verification_status === 'verified' ? 'Verified' : 'Under Review'}
              </span>
            </div>
            <p className="text-slate-600">Managing talent growth at <span className="font-bold text-slate-900">{org?.name}</span></p>
          </div>
          <button className="px-6 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200">
            Invite Team Member
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-1">Total Team Members</p>
            <p className="text-3xl font-bold text-slate-900">{memberCount || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-1">Active Learning Paths</p>
            <p className="text-3xl font-bold text-slate-900">{activePaths || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-1">Avg. Skill Proficiency</p>
            <p className="text-3xl font-bold text-slate-900">64%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company Actions */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-6 rounded-2xl border border-slate-100 hover:border-violet-300 hover:bg-violet-50 transition-all text-left group">
                  <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">Create Learning Path</h3>
                  <p className="text-sm text-slate-500">Define a structured growth journey for a specific role.</p>
                </button>

                <button className="p-6 rounded-2xl border border-slate-100 hover:border-violet-300 hover:bg-violet-50 transition-all text-left group">
                  <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">Review Assessments</h3>
                  <p className="text-sm text-slate-500">Verify team submissions and provide feedback.</p>
                </button>
              </div>
            </div>

            {/* Recent Team Activity */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Team Activity Feed</h2>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=user${i}`} alt="User" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">
                        <span className="font-bold">Alex Rivera</span> completed <span className="font-semibold text-violet-600">Advanced React Patterns</span>
                      </p>
                      <p className="text-xs text-slate-400">1 hour ago</p>
                    </div>
                    <button className="text-xs font-bold text-violet-600 hover:underline">Review</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Company Sidebar */}
          <div className="space-y-8">
            <div className="bg-violet-900 rounded-3xl p-8 text-white shadow-xl">
              <h2 className="text-lg font-bold mb-4">Admin Quick Links</h2>
              <div className="space-y-3">
                <button className="w-full p-3 bg-violet-800 rounded-xl text-sm font-medium hover:bg-violet-700 transition-all text-left flex items-center gap-3">
                  <span>👥</span> Team Management
                </button>
                <button className="w-full p-3 bg-violet-800 rounded-xl text-sm font-medium hover:bg-violet-700 transition-all text-left flex items-center gap-3">
                  <span>📊</span> Analytics Reports
                </button>
                <button className="w-full p-3 bg-violet-800 rounded-xl text-sm font-medium hover:bg-violet-700 transition-all text-left flex items-center gap-3">
                  <span>⚙️</span> Org Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
