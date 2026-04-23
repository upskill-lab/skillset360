'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Dimensiones', href: '/admin/framework/dimensions' },
  { label: 'Skills', href: '/admin/framework/skills' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r bg-gray-50 p-4">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Skillset360</p>
        <p className="text-sm font-medium text-gray-900">Admin</p>
      </div>
      <nav className="space-y-1">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Framework
        </p>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-md px-3 py-2 text-sm transition-colors ${
              pathname.startsWith(item.href)
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto border-t pt-4">
        <a
          href="/admin/framework.json"
          className="block rounded-md px-3 py-2 text-xs text-gray-500 hover:bg-gray-200"
          download
        >
          ↓ Exportar framework JSON
        </a>
      </div>
    </aside>
  )
}
