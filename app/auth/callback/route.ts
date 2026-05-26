import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { validateRedirectPath } from '@/lib/utils/validate-redirect-path'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = validateRedirectPath(searchParams.get('next'))

  if (code) {
    const postAuthRedirectHtml = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Signing in...</title>
  </head>
  <body>
    <script>
      window.location.replace(${JSON.stringify(`${origin}${next}`)})
    </script>
  </body>
</html>`

    const successResponse = new NextResponse(postAuthRedirectHtml, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store',
      },
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              successResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return successResponse

    console.error('[auth/callback] exchangeCodeForSession failed', {
      message: error.message,
      status: error.status,
      code: error.code,
    })
  }

  return NextResponse.redirect(`${origin}/login?error=auth-failed`)
}
