import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function middleware(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const url = new URL(request.url)
  const isAuthPage = url.pathname.startsWith('/auth')
  const isPrivatePage =
    url.pathname.startsWith('/dashboard') ||
    url.pathname.startsWith('/my-next-step') ||
    url.pathname.startsWith('/skills') ||
    url.pathname.startsWith('/progress') ||
    url.pathname.startsWith('/profile') ||
    url.pathname.startsWith('/settings') ||
    url.pathname.startsWith('/company')

  if (!user && isPrivatePage) {
    return redirect('/auth/sign-in')
  }

  if (user && isAuthPage) {
    return redirect('/select-role')
  }

  return
}
