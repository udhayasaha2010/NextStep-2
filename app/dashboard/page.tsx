import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'

export const instant = false

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/sign-in')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: plan } = await supabase
    .from('action_plans')
    .select('*, tasks(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back, {profile?.full_name || 'Learner'}! 👋</h1>
            <p className="text-slate-600">Here is your progress for today.</p>
          </div>
          <div className="flex gap-3">
            <button className="p-2 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Next Step Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Your Next Step</h2>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full">Active Plan</span>
              </div>

              {plan ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-sm text-slate-500 mb-1">Current Goal</p>
                    <p className="text-lg font-semibold text-slate-900">{plan.goal}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-indigo-600 rounded-2xl text-white">
                    <div>
                      <p className="text-sm opacity-80">Recommended Task</p>
                      <p className="text-lg font-bold">
                        {plan.tasks?.[0]?.title || 'No tasks available'}
                      </p>
                    </div>
                    <button className="px-6 py-2 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all">
                      Start
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-slate-500 mb-4">You haven't started a plan yet.</p>
                  <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
                    Create My First Plan
                  </button>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-slate-100">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Completed: Introduction to TypeScript</p>
                      <p className="text-xs text-slate-500">2 days ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Progress Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Your Progress</h2>
              <div className="relative h-32 w-32 mx-auto mb-6">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100" strokeWidth="3" />
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-indigo-600" strokeWidth="3"
                    strokeDasharray="60, 100" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-slate-900">60%</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Plan Completion</span>
                  <span className="font-semibold text-slate-900">12/20 Tasks</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Skills Mastered</span>
                  <span className="font-semibold text-slate-900">4</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-indigo-900 rounded-3xl shadow-lg p-6 text-white">
              <h2 className="text-lg font-bold mb-4">Quick Resources</h2>
              <div className="space-y-3">
                <button className="w-full p-3 bg-indigo-800 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all text-left flex items-center gap-3">
                  <span>🚀</span> Opportunity Explorer
                </button>
                <button className="w-full p-3 bg-indigo-800 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all text-left flex items-center gap-3">
                  <span>📚</span> Skill Profile
                </button>
                <button className="w-full p-3 bg-indigo-800 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all text-left flex items-center gap-3">
                  <span>⚙️</span> Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
