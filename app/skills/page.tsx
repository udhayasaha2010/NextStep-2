import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SkillsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const { data: assessments } = await supabase
    .from('skill_assessments')
    .select('*, skills(name, category)')
    .eq('user_id', user.id)

  const { data: allSkills } = await supabase
    .from('skills')
    .select('*')

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Skill Profile</h1>
          <p className="text-slate-600">Track your growth and discover new capabilities through evidence-based assessment.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Current Skill Map */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Your Demonstrated Skills</h2>

              {assessments && assessments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assessments.map(item => (
                    <div key={item.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
                          {item.skills?.category}
                        </p>
                        <p className="text-lg font-bold text-slate-900">{item.skills?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-700">{item.demonstrated_level}</p>
                        <p className="text-[10px] text-slate-400 uppercase">Verified</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500 mb-4">No demonstrated skills yet.</p>
                  <p className="text-sm text-slate-400">Complete a project or quiz to verify your skills.</p>
                </div>
              )}
            </div>

            {/* Skill Development Area */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Expand Your Toolkit</h2>
                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View All Skills</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allSkills?.slice(0, 6).map(skill => (
                  <div key={skill.id} className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{skill.name}</p>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">{skill.category}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4">{skill.description}</p>
                    <button className="w-full py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all">
                      Start Assessment
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Insights Sidebar */}
          <div className="space-y-8">
            <div className="bg-indigo-900 rounded-3xl p-8 text-white">
              <h2 className="text-lg font-bold mb-4">Growth Insight</h2>
              <p className="text-indigo-100 text-sm leading-relaxed mb-6">
                Based on your goal of <span className="text-white font-bold">Career Change</span>, we recommend focusing on <span className="text-white font-bold">System Design</span> to bridge your current gap.
              </p>
              <div className="p-4 bg-indigo-800 rounded-2xl border border-indigo-700">
                <p className="text-xs font-semibold opacity-80 mb-2">Recommended Next Step</p>
                <p className="text-sm font-bold mb-3">Build a portfolio project using Next.js</p>
                <button className="w-full py-2 bg-white text-indigo-900 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-all">
                  View Requirements
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Proficiency Mix</h2>
              <div className="space-y-4">
                {[
                  { label: 'Technical', value: 65, color: 'bg-indigo-500' },
                  { label: 'Soft Skills', value: 40, color: 'bg-violet-500' },
                  { label: 'Industry Knowledge', value: 30, color: 'bg-sky-500' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">{stat.label}</span>
                      <span className="font-bold text-slate-900">{stat.value}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${stat.color}`} style={{ width: `${stat.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
