import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; cost?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const { q, category, cost } = searchParams

  let query = supabase
    .from('opportunities')
    .select('*')
    .eq('status', 'published')

  if (q) {
    query = query.textSearch('fts', `title,eligibility: ${q}`)
  }
  if (category) {
    query = query.eq('category', category)
  }
  if (cost === 'free') {
    query = query.ilike('cost_info', '%free%')
  }

  const { data: opportunities } = await query.order('last_verified', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Opportunity Explorer</h1>
          <p className="text-slate-600">Discover verified scholarships, programs, and learning resources.</p>
        </header>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form className="flex-1 flex gap-2">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search opportunities..."
              className="flex-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            />
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
              Search
            </button>
          </form>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {['All', 'Scholarship', 'Course', 'Certification', 'Mentorship'].map(cat => (
              <a
                key={cat}
                href={`/opportunities?category=${cat === 'All' ? '' : cat}`}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  category === cat || (cat === 'All' && !category)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                }`}
              >
                {cat}
              </a>
            ))}
          </div>
        </div>

        {/* Opportunities Grid */}
        {opportunities && opportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map(op => (
              <div key={op.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col h-full hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md">
                    {op.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    Verified {new Date(op.last_verified).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {op.title}
                </h3>
                <p className="text-slate-600 text-sm mb-6 line-clamp-3">
                  {op.eligibility}
                </p>
                <div className="mt-auto space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-medium">Cost:</span> {op.cost_info}
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={op.source_url}
                      target="_blank"
                      className="flex-1 text-center py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all"
                    >
                      Official Source
                    </a>
                    <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-500">No opportunities found matching your criteria.</p>
            <a href="/opportunities" className="text-indigo-600 font-semibold hover:underline mt-2 inline-block">
              Clear all filters
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
