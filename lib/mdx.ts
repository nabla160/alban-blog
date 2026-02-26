import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDir = path.join(process.cwd(), 'content')

export interface PostMeta {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  image?: string
  category?: string
  pdf?: string
  github?: string
  status?: string
}

export interface Post extends PostMeta {
  content: string
}

function getPostsFromDir(dir: string): PostMeta[] {
  const fullDir = path.join(contentDir, dir)
  if (!fs.existsSync(fullDir)) return []

  const files = fs.readdirSync(fullDir).filter((f) => f.endsWith('.mdx'))

  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '')
      const filePath = path.join(fullDir, filename)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data } = matter(raw)

      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? '',
        description: data.description ?? '',
        tags: data.tags ?? [],
        image: data.image,
        category: data.category,
        pdf: data.pdf,
        github: data.github,
        status: data.status,
      } satisfies PostMeta
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getProjets(): PostMeta[] {
  return getPostsFromDir('projets')
}

export function getArticles(): PostMeta[] {
  return getPostsFromDir('articles')
}

export function getPost(dir: string, slug: string): Post | null {
  const filePath = path.join(contentDir, dir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? '',
    description: data.description ?? '',
    tags: data.tags ?? [],
    image: data.image,
    category: data.category,
    pdf: data.pdf,
    github: data.github,
    status: data.status,
    content,
  }
}
