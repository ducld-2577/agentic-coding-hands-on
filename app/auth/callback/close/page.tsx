'use client'

import { useEffect } from 'react'

export default function AuthClosePage() {
  useEffect(() => {
    const channel = new BroadcastChannel('auth-login')
    channel.postMessage({ type: 'SIGNED_IN' })

    // Delay close so the BroadcastChannel message is delivered before the popup's
    // JS context is terminated. Calling channel.close() + window.close() synchronously
    // after postMessage() kills the context before the message dispatches to the main window.
    // If window.close() is blocked by the browser (cross-origin COOP policy), the user
    // sees the text below — do NOT navigate self to /home (that is the bug we are fixing).
    const closeTimer = setTimeout(() => {
      channel.close()
      window.close()
    }, 200)

    return () => clearTimeout(closeTimer)
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#00101A]">
      <p className="text-white font-montserrat">Đăng nhập thành công. Bạn có thể đóng cửa sổ này.</p>
    </div>
  )
}
