// Shared countdown primitives used by HomeCountdown and CountdownPrelaunch.

// Frosted-glass digit box: 51×82px, gradient + gold border + blur — matches Figma design.
export function DigitBox({ digit }: { digit: string }) {
  return (
    <div
      className="flex items-center justify-center rounded-lg shrink-0"
      style={{
        width: '51px',
        height: '82px',
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0.05) 100%)',
        border: '0.5px solid #FFEA9E',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <span
        className="font-mono font-bold text-white select-none leading-none"
        style={{ fontSize: '49px' }}
      >
        {digit}
      </span>
    </div>
  )
}

// One countdown unit: two digit boxes + uppercase label below.
export function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-start" style={{ gap: '14px' }}>
      <div className="flex items-center" style={{ gap: '14px' }}>
        {value.split('').map((digit, i) => (
          <DigitBox key={i} digit={digit} />
        ))}
      </div>
      <span
        className="font-montserrat font-bold text-white"
        style={{ fontSize: '24px', lineHeight: '32px' }}
      >
        {label}
      </span>
    </div>
  )
}
