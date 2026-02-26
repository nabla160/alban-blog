import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { getPost, getProjets } from '@/lib/mdx'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getProjets().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost('projets', params.slug)
  if (!post) return {}
  return { title: post.title, description: post.description }
}

export default function ProjetPage({ params }: Props) {
  const post = getPost('projets', params.slug)
  if (!post) notFound()

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
      <Link
        href="/projets"
        className="text-xs text-[#52525b] hover:text-white transition-colors mb-8 inline-flex items-center gap-1"
      >
        ← Projets
      </Link>

      {post.image && (
        <div className="rounded-xl overflow-hidden mb-8 h-56 sm:h-72 bg-[#141414]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-xs bg-[#141414] border border-[#262626] text-[#71717a] rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          {post.title}
        </h1>
        <div className="flex flex-wrap gap-2">
          {post.pdf && (
            <a
              href={post.pdf}
              download
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#333] text-white text-sm rounded-lg hover:border-white/40 transition-colors"
            >
              ↓ Télécharger le PDF
            </a>
          )}
          {post.github && (
            <a
              href={post.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#333] text-white text-sm rounded-lg hover:border-white/40 transition-colors"
            >
              ↗ Code source
            </a>
          )}
        </div>
      </div>
      {post.date && (
        <p className="text-[#52525b] text-xs font-mono mb-8">{post.date}</p>
      )}

      <article className="prose">
        <MDXRemote source={post.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm, remarkMath], rehypePlugins: [rehypeKatex] } }} />
      </article>
    </div>
  )
}
