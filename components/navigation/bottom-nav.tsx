'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideIcon } from 'lucide-react'

interface NavItem {
  icon: LucideIcon
  label: string
  href: string
}

interface BottomNavProps {
  items: NavItem[]
}

export function BottomNav({ items }: BottomNavProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-gray-100 md:hidden pb-safe">
      <nav className="flex justify-around items-center h-16 px-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all active-tap ${
              isActive(item.href)
                ? 'text-[#A50034]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <item.icon
              className={`h-5 w-5 ${
                isActive(item.href) ? 'stroke-[2.5px] scale-110' : 'stroke-2'
              }`}
            />
            <span className={`text-[10px] font-semibold tracking-tight ${
                 isActive(item.href) ? 'opacity-100' : 'opacity-80'
            }`}>
                {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
