export function LoginFooter() {
  return (
    <footer
      className={[
        'fixed bottom-0 left-0 right-0 z-10',
        'flex items-center justify-center',
        'w-full',
        'px-4 sm:px-8 md:px-[90px]',
        'py-4 md:py-[40px]',
        'border-t border-[#2E3940]',
        'bg-[#00101A]',
        // Prevent pointer events — footer is non-interactive
        'pointer-events-none',
      ].join(' ')}
    >
      <p
        className={[
          'font-montserrat-alternates font-bold text-sm md:text-base leading-6',
          'text-white text-center',
        ].join(' ')}
      >
        Bản quyền thuộc về Sun* © 2025
      </p>
    </footer>
  )
}
