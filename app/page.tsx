import Link from 'next/link'

const passions = [
  { href: '/photographie', label: 'Photographie', color: '#f59e0b' },
  { href: '/scene', label: 'Scène', color: '#a855f7' },
  { href: '/musique', label: 'Musique', color: '#3b82f6' },
  { href: '/assos', label: 'Associations', color: '#10b981' },
]

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col pt-14">
      <div className="flex-1 flex items-center px-4 sm:px-6 max-w-6xl mx-auto w-full py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full">

          {/* Colonne gauche : intro */}
          <div className="flex flex-col justify-center">
            <p className="text-xs font-mono text-[#52525b] uppercase tracking-widest mb-3">
              Étudiant · ENSCP-PSL
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              Alban<br />
              <span className="text-[#52525b]">Laborde-Laulhé</span>
            </h1>
            <p className="text-[#a1a1aa] text-base max-w-sm leading-relaxed mb-6">
              Actuellement élève-ingénieur à l’École Nationale Supérieure de Chimie de Paris, je prends pleinement part à la vie scientifique et étudiante de l’Université PSL. Cet écosystèpe, véritable magma de curiosités et de projets, me fait naviguer entre recherche, partage et création. Passionné de photographie, de scène et de musique, j'essaye de partager ici mes travaux. Bienvenue, sur mon blog !
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/etudiant"
                className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-white/90 transition-colors"
              >
                À propos
              </Link>
              <Link
                href="/cv"
                className="px-4 py-2 border border-[#333] text-white text-sm rounded-lg hover:border-white/40 transition-colors"
              >
                CV
              </Link>
              <a
                href="mailto:alban@laulhe.io"
                className="px-4 py-2 border border-[#333] text-[#71717a] text-sm rounded-lg hover:border-white/40 hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Colonne droite : navigation */}
          <div className="flex flex-col gap-3">
            {/* Bloc étudiant */}
            <Link
              href="/etudiant"
              className="group block p-5 bg-[#141414] border border-[#262626] rounded-xl hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-[#52525b] uppercase tracking-widest">
                  Étudiant
                </span>
                <span className="text-[#333] group-hover:text-white transition-colors text-sm">→</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { href: '/cv', label: 'CV' },
                  { href: '/projets', label: 'Projets' },
                  { href: '/articles', label: 'Articles' },
                ].map((item) => (
                  <span
                    key={item.label}
                    className="px-2.5 py-1 text-xs bg-[#1e1e1e] text-[#a1a1aa] rounded-md"
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </Link>

            {/* Bloc passions */}
            <div className="p-5 bg-[#141414] border border-[#262626] rounded-xl">
              <p className="text-xs font-mono text-[#52525b] uppercase tracking-widest mb-3">
                Passions
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {passions.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="text-sm text-[#a1a1aa] group-hover:text-white transition-colors">
                      {p.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
