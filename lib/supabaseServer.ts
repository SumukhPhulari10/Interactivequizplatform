import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// use CookieOptions from @supabase/ssr and Next's synchronous cookies() API

type CookieStoreLike = {
  get(name: string): { name: string; value: string } | undefined
  set(name: string, value: string, options?: CookieOptions): void
  set(options: { name: string; value: string } & CookieOptions): void
}

export function supabaseServer() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const store = cookies() as unknown as CookieStoreLike
          return store.get(name)?.value
        },
        set(name: string, value: string, options?: CookieOptions) {
          const store = cookies() as unknown as CookieStoreLike
          try {
            store.set(name, value, options)
          } catch {
            store.set({ name, value, ...(options ?? {}) })
          }
        },
        remove(name: string, options?: CookieOptions) {
          const store = cookies() as unknown as CookieStoreLike
          try {
            store.set(name, '', { ...(options ?? {}), maxAge: 0 })
          } catch {
            store.set({ name, value: '', ...(options ?? {}), maxAge: 0 })
          }
        }
      }
    }
  )
}
