import type { Metadata } from 'next'
import Link from 'next/link'
import { getArticles } from '@/lib/mdx'

export const metadata: Metadata = {
  title: 'Articles & Notes',
}

export default function ArticlesPage() {
  const articles = getArticles()

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
      <p className="text-xs font-mono text-[#52525b] uppercase tracking-widest mb-2">
        Articles
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
        Notes & Réflexions
      </h1>
      <p className="text-[#71717a] text-sm mb-10">
        Synthèses de cours, réflexions personnelles et lectures.
      </p>

      {articles.length === 0 ? (
        <p className="text-[#52525b] text-sm">Les articles arrivent bientôt.</p>
      ) : (
        <div className="divide-y divide-[#262626]">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group flex items-start justify-between py-5 gap-4 hover:opacity-80 transition-opacity"
            >
              <div>
                <h2 className="text-white font-medium text-sm mb-1">
                  {article.title}
                </h2>
                <p className="text-[#71717a] text-xs line-clamp-2 mb-2">
                  {article.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs bg-[#141414] text-[#52525b] rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-[#52525b] text-xs font-mono flex-shrink-0 mt-0.5">
                {article.date}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
