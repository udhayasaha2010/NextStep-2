import { createClient } from '../../../lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to NextStep</h1>
          <p className="text-slate-600">Your journey to professional growth starts here.</p>
        </div>

        <form action="/auth/sign-in" method="POST">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 px-4 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
