import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SelectRolePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">

        {/* Individual Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-transparent hover:border-indigo-500 transition-all group text-center cursor-pointer"
             onClick={() => window.location.href = '/onboarding'}>
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Individual</h2>
          <p className="text-slate-600 mb-8">For students, job seekers, and people developing their personal skills.</p>
          <button className="w-full py-3 px-6 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
            Continue as Individual
          </button>
        </div>

        {/* Company Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-transparent hover:border-violet-500 transition-all group text-center cursor-pointer"
             onClick={() => window.location.href = '/company/onboarding'}>
          <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Company / HR</h2>
          <p className="text-slate-600 mb-8">For HR representatives, managers, and trainers helping others grow.</p>
          <button className="w-full py-3 px-6 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-colors">
            Continue as Company
          </button>
        </div>

      </div>
    </div>
  )
}
