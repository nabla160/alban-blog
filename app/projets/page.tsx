import type { Metadata } from 'next'
import Link from 'next/link'
import { getProjets } from '@/lib/mdx'

export const metadata: Metadata = {
  title: 'Projets académiques',
}

export default function ProjetsPage() {
  const projets = getProjets()

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
      <p className="text-xs font-mono text-[#52525b] uppercase tracking-widest mb-2">
        Projets
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
        Projets académiques
      </h1>
      <p className="text-[#71717a] text-sm mb-10">
        Travaux réalisés dans le cadre de ma formation à l&apos;ENSCP et ailleurs.
      </p>

      {projets.length === 0 ? (
        <p className="text-[#52525b] text-sm">
          Les projets arrivent bientôt.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projets.map((projet) => (
            <Link
              key={projet.slug}
              href={`/projets/${projet.slug}`}
              className="group block bg-[#141414] border border-[#262626] rounded-xl overflow-hidden hover:border-white/20 transition-all"
            >
              {projet.image && (
                <div className="h-40 bg-[#1a1a1a] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={projet.image}
                    alt={projet.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {projet.category && (
                    <span className="text-xs text-[#52525b] font-mono">
                      {projet.category}
                    </span>
                  )}
                  {projet.status === 'en-cours' && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      En cours
                    </span>
                  )}
                </div>
                <h2 className="text-white font-medium text-sm mb-1 group-hover:text-white">
                  {projet.title}
                </h2>
                <p className="text-[#71717a] text-xs line-clamp-2 mb-3">
                  {projet.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {projet.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs bg-[#1e1e1e] text-[#71717a] rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
