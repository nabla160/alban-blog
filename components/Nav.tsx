'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const buildNavItems = (hasArticles: boolean) => ({
  etudiant: {
    label: 'Parcours Académique',
    links: [
      { href: '/etudiant', label: 'À propos' },
      { href: '/cv', label: 'CV & Compétences' },
      { href: '/projets', label: 'Projets académiques' },
      ...(hasArticles ? [{ href: '/articles', label: 'Articles & Notes' }] : []),
    ],
  },
  passions: {
    label: 'Hors-Cadre',
    links: [
      { href: '/photographie', label: 'Photographie', color: '#f59e0b' },
      { href: '/scene', label: 'Scène', color: '#a855f7' },
      { href: '/musique', label: 'Musique', color: '#3b82f6' },
      { href: '/assos', label: 'Associations', color: '#10b981' },
    ],
  },
})

export default function Nav({ hasArticles = false }: { hasArticles?: boolean }) {
  const navItems = buildNavItems(hasArticles)
  const [open, setOpen] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#090909]/80 backdrop-blur-md border-b border-[#262626]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <Link
          href="/"
          className="text-white font-semibold tracking-tight text-sm hover:opacity-70 transition-opacity"
        >
          Alban Laborde-Laulhé
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {Object.entries(navItems).map(([key, group]) => (
            <div
              key={key}
              className="relative"
              onMouseEnter={() => setOpen(key)}
              onMouseLeave={() => setOpen(null)}
            >
              <button className="px-3 py-1.5 text-sm text-[#a1a1aa] hover:text-white transition-colors rounded-md hover:bg-white/5">
                {group.label}
              </button>
              {open === key && (
                <div className="absolute top-full left-0 pt-1 w-52">
                  <div className="bg-[#141414] border border-[#262626] rounded-lg shadow-xl py-1 animate-fade-in">
                    {group.links.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-[#a1a1aa] hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {'color' in item && (
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                        )}
                        <span className={isActive(item.href) ? 'text-white' : ''}>
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-[#a1a1aa] hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <div className="flex flex-col gap-1.5">
            <span className={`block w-5 h-0.5 bg-current transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#262626] bg-[#090909]">
          {Object.entries(navItems).map(([key, group]) => (
            <div key={key} className="py-2">
              <p className="px-4 py-1 text-xs font-medium text-[#52525b] uppercase tracking-widest">
                {group.label}
              </p>
              {group.links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#a1a1aa] hover:text-white"
                >
                  {'color' in item && (
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  )}
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </nav>
  )
}
