import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/auth/callback']
const PROTECTED_ROUTES = ['/home']

export default async function proxy(req: NextRequest) {
  // Skip auth check if Supabase env vars are not configured (e.g. during initial setup)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next()
  }

  const response = NextResponse.next({ request: req })
  const path = req.nextUrl.pathname

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isAuthenticated = !!user

  // Redirect authenticated user away from public routes (except callback)
  if (PUBLIC_ROUTES.includes(path) && isAuthenticated && path !== '/auth/callback') {
    return NextResponse.redirect(new URL('/home', req.url))
  }

  // Redirect unauthenticated user away from protected routes
  if (PROTECTED_ROUTES.some((r) => path.startsWith(r)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)'],
}
