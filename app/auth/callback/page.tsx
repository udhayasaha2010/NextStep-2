import { createClient } from '../../../lib/supabase/server'
import { redirect } from 'next/navigation'

export const instant = false

export default async function AuthCallbackPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    return redirect('/auth/sign-in?error=auth_failed')
  }

  if (!user) {
    return redirect('/auth/sign-in')
  }

  // Create a basic profile if it doesn't exist
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!profile) {
    await supabase.from('profiles').insert({
      id: user.id,
      full_name: user.user_metadata.full_name,
      avatar_url: user.user_metadata.avatar_url,
    })
  }

  return redirect('/select-role')
}
