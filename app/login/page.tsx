import { LoginHeader } from '@/components/login/login-header'
import { LoginInteractive } from '@/components/login/login-interactive'
import { LoginFooter } from '@/components/login/login-footer'

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#00101A]">
      {/* Background layers in their own overflow-hidden container so they don't clip dropdowns */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* C: Background key visual */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/login/keyvisual-bg.png)',
            backgroundSize: '159.763% 133.371%',
            backgroundPosition: '-440px -217.975px',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Cover gradient overlay */}
        <div
          className="absolute w-full"
          style={{
            top: '138px',
            height: '1093px',
            background: 'linear-gradient(0deg, #00101A 22.48%, rgba(0, 19, 32, 0.00) 51.74%)',
          }}
        />
      </div>

      {/* A: Header — logo + language selector */}
      <LoginHeader />

      {/* B: Hero + auth button — locale-reactive Client Component */}
      <LoginInteractive />

      {/* D: Footer — fixed bottom */}
      <LoginFooter />
    </main>
  )
}
