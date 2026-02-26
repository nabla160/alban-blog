import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { getPost, getArticles } from '@/lib/mdx'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost('articles', params.slug)
  if (!post) return {}
  return { title: post.title, description: post.description }
}

export default function ArticlePage({ params }: Props) {
  const post = getPost('articles', params.slug)
  if (!post) notFound()

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
      <Link
        href="/articles"
        className="text-xs text-[#52525b] hover:text-white transition-colors mb-8 inline-flex items-center gap-1"
      >
        ← Articles
      </Link>

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

      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
        {post.title}
      </h1>
      {post.date && (
        <p className="text-[#52525b] text-xs font-mono mb-8">{post.date}</p>
      )}

      <article className="prose">
        <MDXRemote source={post.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm, remarkMath], rehypePlugins: [rehypeKatex] } }} />
      </article>
    </div>
  )
}
