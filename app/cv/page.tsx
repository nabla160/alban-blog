import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CV & Compétences',
}

const formations = [
  {
    period: '2023 — 2026',
    school: 'Chimie ParisTech · PSL',
    degree: 'Diplôme d\'ingénieur',
    detail: 'Chimie, physique, science des matériaux, informatique scientifique. Cours : Propriétés quantiques des matériaux, Chimie du solide, Science des surfaces, Analyse de données.',
  },
  {
    period: '2021 — 2023',
    school: 'Lycée Gustave Eiffel · Bordeaux',
    degree: 'Classes préparatoires PSI*/PCSI',
    detail: 'Mathématiques, physique, sciences de l\'ingénieur. Préparation aux concours nationaux.',
  },
  {
    period: '2021',
    school: 'Lycée de Borda · Dax',
    degree: 'Baccalauréat (Mention Bien)',
    detail: 'Section européenne (Espagnol).',
  },
]

const experiences = [
  {
    period: 'Avr — Août 2026',
    role: 'Stage de recherche',
    lieu: 'Université de Glasgow · Royaume-Uni',
    desc: 'Groupe Optique du Pr. Sonja Franke-Arnold. Effets magnéto-optiques dans la vapeur de rubidium avec lumière structurée.',
    upcoming: true,
  },
  {
    period: 'Sept — Déc 2023',
    role: 'Stage de recherche',
    lieu: 'IRCP – MPOE · PSL · Paris',
    desc: 'Croissance cristalline et caractérisation de grenats d\'Yttrium Gallium (YGG). Étude de la composition de flux (BaO–B₂O₃–BaF₂), contrôle morphologique et qualité optique.',
    upcoming: false,
  },
  {
    period: 'Août 2023',
    role: 'Stage ouvrier',
    lieu: 'Rewake · Montreuil',
    desc: 'Startup d\'économie circulaire d\'équipements de laboratoire. Réception, test, nettoyage et calibration d\'appareils reconditionnés.',
    upcoming: false,
  },
]

const projets = [
  {
    period: '2024 — 2026',
    title: 'Projet Industriel de Groupe (PIG)',
    lieu: 'Chimie ParisTech · PSL / IMAP–ENS',
    desc: 'Composites MOF hydrophobes pour la capture de CO₂ en conditions humides (G. Mouchaham). Étude de la rétention de porosité et de l\'absorption d\'eau par isothermes comparatives.',
  },
  {
    period: '2023 — 2024',
    title: 'Projet Transdisciplinaire (PTD)',
    lieu: 'Chimie ParisTech · PSL / Procter & Gamble',
    desc: 'Innovation par Design Thinking. Pilotage du workflow d\'équipe et de la recherche utilisateur. Production d\'un concept brief final.',
  },
]

const leadership = [
  {
    period: '2024 — 2026',
    role: 'Président',
    org: 'Union PSL (PSL Student Union)',
    desc: 'Représentation étudiante à l\'échelle PSL, coordination inter-écoles, gestion d\'équipe et des finances, liaison avec l\'administration.',
  },
  {
    period: '2023 — 2026',
    role: 'Trésorier',
    org: 'PSL Broadway',
    desc: 'Gestion du budget annuel, des sponsorings et de la logistique pour les productions musicales étudiantes.',
  },
]

const competences = [
  {
    categorie: 'Expérimental',
    items: ['Chimie en solution', 'Croissance cristalline', 'Préparation d\'échantillons', 'DRX poudre', 'Microscopie optique'],
  },
  {
    categorie: 'Informatique',
    items: ['Python (NumPy, Pandas, Matplotlib)', 'Analyse d\'images', 'C/C++', 'Git', 'LaTeX'],
  },
  {
    categorie: 'Langues',
    items: ['Français (natif)', 'Anglais (courant)', 'Espagnol (courant)'],
  },
  {
    categorie: 'Soft skills',
    items: ['Rédaction scientifique', 'Gestion de projet', 'Prise de parole publique'],
  },
]

export default function CVPage() {
  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="text-xs font-mono text-[#52525b] uppercase tracking-widest mb-2">
            Curriculum Vitæ
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            CV & Compétences
          </h1>
        </div>
        <a
          href="/cv.pdf"
          download="Alban_Laborde-Laulhé_CV.pdf"
          className="px-4 py-2 border border-[#333] text-white text-sm rounded-lg hover:border-white/40 transition-colors"
        >
          Télécharger le PDF →
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne gauche */}
        <div className="lg:col-span-2 space-y-10">

          {/* Formation */}
          <section>
            <h2 className="text-xs font-mono text-[#52525b] uppercase tracking-widest mb-4">
              Formation
            </h2>
            <div className="space-y-4">
              {formations.map((f, i) => (
                <div key={i} className="p-4 bg-[#141414] border border-[#262626] rounded-lg">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-white font-medium text-sm">{f.school}</p>
                      <p className="text-[#a1a1aa] text-sm">{f.degree}</p>
                      <p className="text-[#71717a] text-xs mt-1">{f.detail}</p>
                    </div>
                    <span className="text-[#52525b] text-xs font-mono flex-shrink-0">{f.period}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Expériences */}
          <section>
            <h2 className="text-xs font-mono text-[#52525b] uppercase tracking-widest mb-4">
              Expériences
            </h2>
            <div className="space-y-4">
              {experiences.map((e, i) => (
                <div key={i} className="p-4 bg-[#141414] border border-[#262626] rounded-lg">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-medium text-sm">{e.role}</p>
                        {e.upcoming && (
                          <span className="px-1.5 py-0.5 text-[10px] font-mono bg-[#1a1a1a] border border-[#333] text-[#71717a] rounded">
                            À venir
                          </span>
                        )}
                      </div>
                      <p className="text-[#a1a1aa] text-xs">{e.lieu}</p>
                      <p className="text-[#71717a] text-sm mt-1">{e.desc}</p>
                    </div>
                    <span className="text-[#52525b] text-xs font-mono flex-shrink-0">{e.period}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Projets */}
          <section>
            <h2 className="text-xs font-mono text-[#52525b] uppercase tracking-widest mb-4">
              Projets académiques
            </h2>
            <div className="space-y-4">
              {projets.map((p, i) => (
                <div key={i} className="p-4 bg-[#141414] border border-[#262626] rounded-lg">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-white font-medium text-sm">{p.title}</p>
                      <p className="text-[#a1a1aa] text-xs">{p.lieu}</p>
                      <p className="text-[#71717a] text-sm mt-1">{p.desc}</p>
                    </div>
                    <span className="text-[#52525b] text-xs font-mono flex-shrink-0">{p.period}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Leadership */}
          <section>
            <h2 className="text-xs font-mono text-[#52525b] uppercase tracking-widest mb-4">
              Leadership & Associations
            </h2>
            <div className="space-y-4">
              {leadership.map((l, i) => (
                <div key={i} className="p-4 bg-[#141414] border border-[#262626] rounded-lg">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-white font-medium text-sm">{l.role} · {l.org}</p>
                      <p className="text-[#71717a] text-sm mt-1">{l.desc}</p>
                    </div>
                    <span className="text-[#52525b] text-xs font-mono flex-shrink-0">{l.period}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Colonne droite : compétences */}
        <div className="space-y-6">
          {competences.map((bloc, i) => (
            <section key={i}>
              <h2 className="text-xs font-mono text-[#52525b] uppercase tracking-widest mb-3">
                {bloc.categorie}
              </h2>
              <div className="flex flex-wrap gap-2">
                {bloc.items.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 text-xs bg-[#141414] border border-[#262626] text-[#a1a1aa] rounded-md"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
