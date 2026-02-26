import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'À propos',
  description: 'Étudiant ingénieur à l\'ENSCP, passionné de chimie et des arts.',
}

export default function EtudiantPage() {
  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="max-w-2xl">
        <p className="text-xs font-mono text-[#52525b] uppercase tracking-widest mb-4">
          À propos
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          Bonjour, je m&apos;appelle Alban.
        </h1>

        <div className="space-y-4 text-[#a1a1aa] leading-relaxed">


          <p>
          Je m’appelle Alban Laborde-Laulhé. Élève-ingénieur à l’École Nationale Supérieure de Chimie de Paris, au sein de l’Université PSL, ce blog sert de point d’ancrage pour rassembler un parcours et des explorations.
          </p>
          <p>
           Cette page réunit l'essentiel de mon parcours, j'y réunit au fil de l'eau, mes expériences en laboratoires ou en entreprises, mes projets, mes rapports... tout ce qui m'a apporté selon moi une expérience enrichissante dans mon parcours académique.
    
          </p>
          <p>
            L’intention est de donner une continuité à ce qui, autrement, resterait dispersé. Un endroit pour garder trace, relier les fils, et partager des contenus travaillés, à hauteur d’expérience.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/cv', label: 'CV & Compétences', desc: 'Mon parcours technique' },
            { href: '/projets', label: 'Projets', desc: 'Ce que j\'ai réalisé' },
            { href: '/articles', label: 'Articles', desc: 'Mes notes et réflexions' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block p-4 bg-[#141414] border border-[#262626] rounded-lg hover:border-white/20 transition-all group"
            >
              <p className="text-white text-sm font-medium mb-1 group-hover:text-white">
                {item.label} →
              </p>
              <p className="text-[#71717a] text-xs">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
