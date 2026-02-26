import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Musique',
}

const color = '#3b82f6'

const ensemblesActuels = [
  {
    nom: 'Harmonie Ossia',
    desc: 'Orchestre d\'harmonie interuniversitaire, réunissant des musiciens de PSL et des grandes écoles parisiennes.',
    href: 'https://www.harmonie-ossia.fr/',
  },
  {
    nom: 'Orchestre du Nouveau Monde',
    desc: 'Orchestre symphonique amateur parisien engagé pour la justice sociale et climatique.',
    href: 'https://orchestredunouveaumonde.fr/',
  },
  {
    nom: 'Ernestophone',
    desc: 'Fanfare étudiante de l\'École Normale Supérieure – PSL.',
    href: 'https://ernestophone.ens.fr/',
  },
  {
    nom: 'Club de Musique Classique · Chimie ParisTech',
    desc: 'Ensemble de musique classique de Chimie ParisTech – PSL.',
    href: 'https://www.instagram.com/musique_classique.chimieparis/',
  },
]

const ensemblesPassés = [
  {
    nom: 'Ensemble Symphonique Monceau',
    desc: 'Orchestre symphonique amateur parisien.',
    href: null,
  },
  {
    nom: 'Académie Musicale de Royan',
    desc: 'Stage orchestral d\'été.',
    href: 'https://academie-musicale-royan.fr/',
  },
  {
    nom: 'Union Musicale des Landes',
    desc: 'Harmonie départementale des Landes.',
    href: 'https://umlandes.fr/',
  },
  {
    nom: 'Harmonie de la Néhé · Dax',
    desc: 'Orchestre d\'harmonie dacquois.',
    href: 'https://www.lanehe.fr/',
  },
]

export default function MusiquePage() {
  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Hero */}
      <div className="mb-12">
        <span
          className="inline-block text-xs font-mono uppercase tracking-widest mb-3 px-2 py-1 rounded"
          style={{ color, backgroundColor: `${color}15` }}
        >
          Passion
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">Musique</h1>
        <p className="text-[#a1a1aa] text-lg max-w-xl">
          Hautboïste de formation, saxophoniste par passion.
        </p>
        <p className="text-[#71717a] text-sm mt-4 max-w-2xl leading-relaxed">
          Je joue du hautbois depuis l’enfance, au conservatoire. Le saxophone est ensuite venu ouvrir d’autres paysages, en orchestre d’harmonie comme en fanfare. Mais ce qui me tient le plus, c’est la musique d’ensemble. C’est un lieu où l’exigence personnelle cesse d’être solitaire et devient un geste partagé. C’est une cohésion qui se construit à force d’écoute, une émotion commune qui circule, presque un sport d’équipe. Chacun est responsable de sa ligne, et pourtant porté par le souffle des autres. Et je m’accroche à ce repère, quelle que soit la période.
        </p>
      </div>

      {/* Ensembles actuels */}
      <section className="mb-10">
        <h2 className="text-xs font-mono text-[#52525b] uppercase tracking-widest mb-4">
          Ensembles actuels
        </h2>
        <div className="space-y-3">
          {ensemblesActuels.map((e) => (
            <div
              key={e.nom}
              className="flex items-start justify-between gap-4 p-4 bg-[#141414] border border-[#262626] rounded-lg"
            >
              <div>
                <p className="text-white font-medium text-sm">{e.nom}</p>
                <p className="text-[#71717a] text-xs mt-0.5">{e.desc}</p>
              </div>
              {e.href && (
                <a
                  href={e.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs flex-shrink-0 mt-0.5 transition-colors hover:text-white"
                  style={{ color }}
                >
                  Site →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Ensembles passés */}
      <section>
        <h2 className="text-xs font-mono text-[#52525b] uppercase tracking-widest mb-4">
          Ensembles passés
        </h2>
        <div className="space-y-3">
          {ensemblesPassés.map((e) => (
            <div
              key={e.nom}
              className="flex items-start justify-between gap-4 p-4 bg-[#141414] border border-[#262626] rounded-lg"
            >
              <div>
                <p className="text-white font-medium text-sm">{e.nom}</p>
                <p className="text-[#71717a] text-xs mt-0.5">{e.desc}</p>
              </div>
              {e.href && (
                <a
                  href={e.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs flex-shrink-0 mt-0.5 transition-colors hover:text-white"
                  style={{ color: '#52525b' }}
                >
                  Site →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
