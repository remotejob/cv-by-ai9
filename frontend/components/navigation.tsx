'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import Image from 'next/image'

const navItems = [
  { href: '/', label: 'About' },
  { href: '/knowledge', label: 'Skills' },
  { href: '/projects', label: 'Projects' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <>
      {/* Skip navigation link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-accent text-black px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>

      <nav
        className="fixed top-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-sm border-b"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Image
              src="/me_alex.jpg"
              alt="Alex Mazurov"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div className="text-accent font-bold text-xl uppercase">
              Mazurov
            </div>
          </div>
          <div className="flex items-center space-x-8">
            <div className="flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`text-heading-sm hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1 ${
                    pathname === item.href ? 'text-accent' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </>
  )
}