'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthClosePage() {
  const router = useRouter()

  useEffect(() => {
    if (window.opener) {
      // Redirect the main window to /home and close the popup
      window.opener.location.href = '/home'
      window.close()
    } else {
      // Fallback: if opened directly (not as popup), navigate self
      router.replace('/home')
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#00101A]">
      <p className="text-white font-montserrat">Đang đăng nhập...</p>
    </div>
  )
}
