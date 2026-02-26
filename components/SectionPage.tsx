interface Projet {
  title: string
  description: string
  year?: string
  image?: string
  link?: string
}

interface SectionPageProps {
  color: string
  tag: string
  title: string
  description: string
  longDescription?: string
  projets?: Projet[]
  images?: string[]
}

export default function SectionPage({
  color,
  tag,
  title,
  description,
  longDescription,
  projets = [],
  images = [],
}: SectionPageProps) {
  return (
    <div
      className="pt-28 pb-16 px-4 sm:px-6 max-w-6xl mx-auto"
      style={{ '--section-color': color } as React.CSSProperties}
    >
      {/* Hero */}
      <div className="mb-12">
        <span
          className="inline-block text-xs font-mono uppercase tracking-widest mb-3 px-2 py-1 rounded"
          style={{ color, backgroundColor: `${color}15` }}
        >
          {tag}
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">{title}</h1>
        <p className="text-[#a1a1aa] text-lg max-w-xl">{description}</p>
        {longDescription && (
          <p className="text-[#71717a] text-sm mt-4 max-w-2xl leading-relaxed">
            {longDescription}
          </p>
        )}
      </div>

      {/* Projets */}
      {projets.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs font-mono text-[#52525b] uppercase tracking-widest mb-6">
            Projets & réalisations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projets.map((projet, i) => (
              <div
                key={i}
                className="group p-4 bg-[#141414] border border-[#262626] rounded-xl hover:border-[var(--section-color)]/30 transition-all"
              >
                {projet.image && (
                  <div className="h-36 rounded-lg overflow-hidden mb-3 bg-[#1a1a1a]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={projet.image}
                      alt={projet.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-white text-sm font-medium">{projet.title}</h3>
                  {projet.year && (
                    <span className="text-[#52525b] text-xs font-mono flex-shrink-0">
                      {projet.year}
                    </span>
                  )}
                </div>
                <p className="text-[#71717a] text-xs mt-1 leading-relaxed">
                  {projet.description}
                </p>
                {projet.link && (
                  <a
                    href={projet.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-xs transition-colors"
                    style={{ color }}
                  >
                    Voir →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Galerie photos */}
      {images.length > 0 && (
        <section>
          <h2 className="text-xs font-mono text-[#52525b] uppercase tracking-widest mb-6">
            Galerie
          </h2>
          <div className="columns-2 sm:columns-3 gap-3 space-y-3">
            {images.map((src, i) => (
              <div
                key={i}
                className="break-inside-avoid rounded-lg overflow-hidden bg-[#141414]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-auto block"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* État vide */}
      {projets.length === 0 && images.length === 0 && (
        <div className="border border-[#262626] rounded-xl p-8 text-center">
          <p className="text-[#52525b] text-sm">
            Du contenu arrive bientôt dans cette section.
          </p>
        </div>
      )}
    </div>
  )
}
