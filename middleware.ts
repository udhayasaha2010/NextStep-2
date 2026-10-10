import { createClient } from './lib/supabase/server'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

export async function middleware(request: Request) {
  try {
    // 1. Critical Safety Check: Ensure environment variables exist
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      console.error('[Middleware] Missing Supabase Environment Variables. Please check Vercel settings.')
      return NextResponse.next()
    }

    // 2. Initialize Supabase Client
    const supabase = createClient()

    // Use getUser() instead of getSession() for security in Middleware
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      console.error('[Middleware] Auth Error:', authError.message)
      return NextResponse.next()
    }

    const urlObj = new URL(request.url)
    const isAuthPage = urlObj.pathname.startsWith('/auth')
    const isPrivatePage =
      urlObj.pathname.startsWith('/dashboard') ||
      urlObj.pathname.startsWith('/my-next-step') ||
      urlObj.pathname.startsWith('/skills') ||
      urlObj.pathname.startsWith('/progress') ||
      urlObj.pathname.startsWith('/profile') ||
      urlObj.pathname.startsWith('/settings') ||
      urlObj.pathname.startsWith('/company')

    // Redirect unauthenticated users to sign-in
    if (!user && isPrivatePage) {
      return redirect('/auth/sign-in')
    }

    // Redirect authenticated users away from auth pages
    if (user && isAuthPage) {
      return redirect('/select-role')
    }

    return NextResponse.next()
  } catch (e: any) {
    console.error('[Middleware] Unexpected Crash:', e.message)
    // Return next() so the app doesn't show a 500 error page
    return NextResponse.next()
  }
}
