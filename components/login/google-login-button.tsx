'use client'

interface GoogleLoginButtonProps {
  label: string
  isLoading: boolean
  onClick: () => void
}

// mm:I662:14426;186:1766
function GoogleIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20.8245 12.2073C20.8245 11.5955 20.7748 10.9804 20.669 10.3785H12.1799V13.8443H17.0412C16.8395 14.962 16.1913 15.9508 15.2422 16.5792V18.8279H18.1425C19.8456 17.2604 20.8245 14.9455 20.8245 12.2073Z"
        fill="#4285F4"
      />
      <path
        d="M12.1799 21.0006C14.6073 21.0006 16.6543 20.2036 18.1458 18.8279L15.2455 16.5792C14.4386 17.1281 13.3969 17.439 12.1832 17.439C9.83527 17.439 7.84445 15.8549 7.13014 13.7252H4.1373V16.0434C5.66514 19.0826 8.77703 21.0006 12.1799 21.0006Z"
        fill="#34A853"
      />
      <path
        d="M7.12684 13.7252C6.74984 12.6074 6.74984 11.3971 7.12684 10.2793V7.96112H4.13731C2.86081 10.5042 2.8608 13.5003 4.1373 16.0434L7.12684 13.7252Z"
        fill="#FBBC04"
      />
      <path
        d="M12.1799 6.56224C13.463 6.5424 14.7032 7.02523 15.6324 7.9115L18.202 5.34196C16.5749 3.81413 14.4155 2.97415 12.1799 3.00061C8.77702 3.00061 5.66515 4.91868 4.13731 7.96112L7.12684 10.2793C7.83785 8.14631 9.83196 6.56224 12.1799 6.56224Z"
        fill="#EA4335"
      />
    </svg>
  )
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

export function GoogleLoginButton({ label, isLoading, onClick }: GoogleLoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      aria-label={label}
      className={[
        'flex items-center gap-2 px-6 py-4 rounded-lg',
        'bg-[#FFEA9E] text-[#00101A]',
        'font-montserrat font-bold text-[22px] leading-[28px]',
        'transition-shadow duration-200 ease-in-out',
        'hover:shadow-[0_8px_24px_rgba(255,234,158,0.45)]',
        'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFEA9E]',
        'w-auto min-w-[200px] h-[60px] whitespace-nowrap',
      ].join(' ')}
    >
      <span>{label}</span>
      <span className="flex-shrink-0">
        {isLoading ? <LoadingSpinner /> : <GoogleIcon />}
      </span>
    </button>
  )
}
