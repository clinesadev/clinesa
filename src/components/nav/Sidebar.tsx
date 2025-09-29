'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/patients', label: 'Pacientes' },
  { href: '/billing', label: 'Suscripción' },
  { href: '/settings', label: 'Ajustes' },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="border-r p-4 space-y-4">
      <div className="text-xl font-semibold">clinesa</div>
      <nav className="grid gap-2">
        {links.map((l) => {
          const active =
            pathname === l.href || pathname?.startsWith(l.href + '/')
          return (
            <Link
              key={l.href}
              href={l.href}
              className={
                'rounded px-2 py-1 transition-colors ' +
                (active
                  ? 'bg-neutral-200 dark:bg-neutral-800 font-medium'
                  : 'hover:underline')
              }
            >
              {l.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
