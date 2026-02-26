import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scène',
}

const color = '#a855f7'

export default function ScenePage() {
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
        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">Scène</h1>
        <p className="text-[#a1a1aa] text-lg max-w-xl">
          Théâtre et comédie musicale.
        </p>
        <p className="text-[#71717a] text-sm mt-4 max-w-2xl leading-relaxed">
          La scène est un environnement à part, un moment rare où les émotions se décuplent et se partagent. Au fil de mon parcours, j'ai eu la chance de fouler ce plancher, en comédie musicale comme au théâtre, et d'y découvrir une aventure où l'exigence, l'écoute et la cohésion font naître une intensité collective qui n'existe nulle part ailleurs. J'y consigne aussi l'envers du décor, les répétitions, les doutes, les déclics, et la joie précise du moment où tout s'accorde.
        </p>
      </div>

      {/* Deux sous-sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Comédie musicale */}
        <div className="p-6 bg-[#141414] border border-[#262626] rounded-xl">
          <h2 className="text-white font-semibold text-sm mb-2">Comédie musicale</h2>
          <p className="text-[#71717a] text-xs leading-relaxed mb-4">
            C'est sans doute la discipline où tout se mélange le plus naturellement : chanter, jouer, danser, et apprendre à faire corps avec un collectif. Avec PSL Off Broadway, j'ai eu la chance de vivre cette aventure de l'intérieur, sur scène comme en coulisses, et aussi dans l'organisation, en tant que trésorier de la troupe.
          </p>
          <div className="border-t border-[#262626] pt-4 space-y-4">
            <div>
              <p className="text-white text-xs font-medium mb-0.5">Mamma Mia · ABBA · 2025</p>
              <p className="text-[#71717a] text-xs">
                J'ai participé à la production musicale et assuré l'organisation de la troupe en tant que trésorier.
              </p>
            </div>
            <div>
              <p className="text-white text-xs font-medium mb-0.5">Hadestown · Anaïs Mitchell · 2026</p>
              <p className="text-[#71717a] text-xs mb-2">
                Pour cette production, j'ai surtout été impliqué dans l'organisation, en tant que trésorier.
              </p>
              <a
                href="https://www.instagram.com/psl_offbroadway/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs transition-colors hover:text-white"
                style={{ color }}
              >
                PSL Off Broadway →
              </a>
            </div>
          </div>
        </div>

        {/* Théâtre */}
        <div className="p-6 bg-[#141414] border border-[#262626] rounded-xl">
          <h2 className="text-white font-semibold text-sm mb-2">Théâtre</h2>
          <p className="text-[#71717a] text-xs leading-relaxed mb-4">
            L'art du texte et de la présence. Le théâtre m'a appris à occuper l'espace,
            à écouter vraiment, et à habiter un personnage autrement que par l'instinct.
          </p>
          <div className="border-t border-[#262626] pt-4 space-y-4">
            <div>
              <p className="text-white text-xs font-medium mb-0.5">Soupirs · Raphaël Hauser</p>
              <p className="text-[#71717a] text-xs mb-0.5">
                J'ai eu l'honneur d'être convié par Raphaël Hauser à participer à la création de sa pièce originale <em>Soupirs</em>. Une pièce qui explore tous les arts de l'humanité, sous le regard de la Nature, des astres et l'ombre de la bombe atomique.
              </p>
              <p className="text-[#52525b] text-xs mb-2">
                Théâtre Nicole Loraux · Compagnie des As
              </p>
              <a
                href="https://compagniedesas.fr/project/soupirs/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs transition-colors hover:text-white"
                style={{ color }}
              >
                Plus d'info →
              </a>
            </div>
            <div>
              <p className="text-white text-xs font-medium mb-0.5">Club Théâtre · Chimie ParisTech – PSL</p>
              <p className="text-[#71717a] text-xs">
                Je m'y amuse à détourner les classiques, jouer des sketchs et des monologues — le plateau comme terrain de jeu avant tout.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
