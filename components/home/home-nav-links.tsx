'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  label: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'About SAA 2025', href: '/home' },
  { label: 'Awards Information', href: '/awards-information' },
  { label: 'Sun* Kudos', href: '/sun-kudos' },
]

export function HomeNavLinks() {
  const pathname = usePathname()

  function handleClick(href: string) {
    if (pathname === href) {
      window.scrollTo(0, 0)
    }
  }

  return (
    <nav aria-label="Main navigation">
      <ul className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => handleClick(item.href)}
                className={[
                  'px-4 py-2 rounded text-sm font-semibold font-montserrat transition-colors duration-150',
                  isActive
                    ? 'text-yellow-400 underline underline-offset-4'
                    : 'text-white hover:bg-white/10',
                ].join(' ')}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
