import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { validateRedirectPath } from '@/lib/utils/validate-redirect-path'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = validateRedirectPath(searchParams.get('next'))

  if (code) {
    const cookieStore = await cookies()

    // 1. Khởi tạo NextResponse object TRƯỚC để hứng cookie
    const response = NextResponse.redirect(new URL(next, origin))

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Set vào cookieStore để các logic phía sau trong cùng request có thể đọc
              cookieStore.set(name, value, options)
              // 2. Set TRỰC TIẾP vào object response để đảm bảo trình duyệt nhận được cookie
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // 3. Trả về response đã được nhồi đầy đủ cookie
      return response
    }

    console.error('[auth/callback] exchangeCodeForSession failed', {
      message: error.message,
      status: error.status,
      code: error.code,
    })
  }

  return NextResponse.redirect(`${origin}/login?error=auth-failed`)
}
