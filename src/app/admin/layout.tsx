'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, MessageSquare, LogOut } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
}

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Clients', href: '/admin/clients', icon: Users },
  { label: 'Tickets', href: '/admin/tickets', icon: MessageSquare },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user)
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#0F172A' }}>
      {/* Sidebar */}
      <aside
        className="w-64 flex flex-col border-r border-slate-700"
        style={{ backgroundColor: '#1E293B' }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold text-white">Local Connect</h1>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded mt-1 inline-block"
            style={{ backgroundColor: '#3B82F6', color: '#fff' }}
          >
            Admin
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
                style={active ? { backgroundColor: '#3B82F6' } : {}}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User info + Logout */}
        <div className="p-4 border-t border-slate-700">
          {user && (
            <div className="mb-3 px-3">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors w-full"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header
          className="h-16 flex items-center justify-between px-8 border-b border-slate-700"
          style={{ backgroundColor: '#1E293B' }}
        >
          <h2 className="text-lg font-semibold text-white">Admin Panel</h2>
          {user && (
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: '#3B82F6' }}
              >
                {user.name.charAt(0)}
              </div>
              <span className="text-sm text-slate-300">{user.name}</span>
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  )
}
