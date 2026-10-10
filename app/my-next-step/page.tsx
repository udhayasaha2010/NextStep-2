import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function MyNextStepPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const { data: plan } = await supabase
    .from('action_plans')
    .select('*, tasks(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Action Plan</h1>
            <p className="text-slate-600">A personalized roadmap to achieve your goals.</p>
          </div>
          {plan && (
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Progress</p>
              <p className="text-2xl font-black text-indigo-600">{plan.progress_percent}%</p>
            </div>
          )}
        </header>

        {!plan ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🎯</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">No Active Plan Found</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Your personalized roadmap is generated based on your onboarding and skill assessments.
            </p>
            <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
              Generate My Plan
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-indigo-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-indigo-300 text-sm font-semibold uppercase tracking-widest mb-2">Current Objective</p>
                <h2 className="text-3xl font-bold mb-4">{plan.goal}</h2>
                <div className="flex gap-4">
                  <div className="px-3 py-1 bg-indigo-800 rounded-lg text-xs font-medium border border-indigo-700">
                    ⏱️ Estimated: 3 Months
                  </div>
                  <div className="px-3 py-1 bg-indigo-800 rounded-lg text-xs font-medium border border-indigo-700">
                    🛠️ Level: Intermediate
                  </div>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-800 rounded-full opacity-50" />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 ml-2">Roadmap Steps</h3>
              <div className="grid gap-4">
                {plan.tasks?.sort((a, b) => a.order_index - b.order_index).map((task, index) => (
                  <div
                    key={task.id}
                    className={`group p-6 rounded-3xl border transition-all cursor-pointer ${
                      task.is_completed
                        ? 'bg-slate-50 border-slate-200 opacity-75'
                        : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex gap-6">
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                          task.is_completed
                            ? 'bg-green-100 text-green-600'
                            : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                        }`}>
                          {task.is_completed ? '✓' : index + 1}
                        </div>
                        {index < (plan.tasks?.length || 0) - 1 && (
                          <div className="absolute top-10 left-5 w-0.5 h-8 bg-slate-200" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`font-bold text-lg ${task.is_completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                            {task.title}
                          </h4>
                          {task.is_completed && (
                            <span className="text-[10px] font-bold text-green-600 uppercase tracking-tighter bg-green-50 px-2 py-0.5 rounded">
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 text-sm mb-4">{task.description}</p>

                        <div className="flex flex-wrap gap-3">
                          {task.resources && (
                            <div className="flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                              <span>📚</span> Resources Available
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                            <span>⏱️</span> {task.estimated_duration}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
