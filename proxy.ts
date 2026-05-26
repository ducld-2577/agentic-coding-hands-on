import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export const PUBLIC_ROUTES: string[] = ['/login', '/auth/callback', '/auth/callback/close']
export const PROTECTED_ROUTES: string[] = [
  '/home',
  '/admin',
  '/profile',
  '/sun-kudos',
  '/awards-information',
]

export default async function proxy(req: NextRequest) {
  // supabaseResponse must be returned (not a plain NextResponse.next()) so that
  // any session-refresh Set-Cookie headers are propagated to the browser.
  let supabaseResponse = NextResponse.next({ request: req })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Update request cookies so downstream Route Handlers see refreshed tokens.
          // NextRequest.cookies.set() only accepts (name, value) — no options.
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request: req })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() validates the token against Supabase and refreshes if expired.
  // getSession() must NOT be used here — it accepts stale or forged local tokens.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = req.nextUrl.pathname

  // Redirect authenticated users away from login page.
  if (path === '/login' && user) {
    return NextResponse.redirect(new URL('/home', req.url))
  }

  // Redirect unauthenticated users away from protected routes.
  if (PROTECTED_ROUTES.some((r) => path.startsWith(r)) && !user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)'],
}
