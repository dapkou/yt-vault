'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { name: '首頁', href: '/' },
  { name: 'YouTube 分析', href: '/analysis' },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="w-full sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-white/10 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="text-xl font-extrabold bg-gradient-to-r from-pink-500 via-yellow-400 to-lime-400 text-transparent bg-clip-text">
          YT Vault
        </div>

        {/* Navigation */}
        <div className="flex space-x-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
              >
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}