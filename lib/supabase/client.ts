import { createBrowserClient } from '@supabase/ssr'

type BrowserClient = ReturnType<typeof createBrowserClient>

// The real client is created on first use (in effects/handlers), not during
// render, so prerendering client pages doesn't require Supabase credentials.
export const createClient = (): BrowserClient => {
  let client: BrowserClient | undefined
  const getClient = () =>
    (client ??= createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ))

  return new Proxy({} as BrowserClient, {
    get(_, prop) {
      const value = Reflect.get(getClient(), prop)
      return typeof value === 'function' ? value.bind(getClient()) : value
    },
  })
}
