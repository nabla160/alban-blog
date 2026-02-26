import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getDb } from '@/lib/db'
import AlbumPhotoView from '@/components/AlbumPhotoView'
import type { Album, Photo } from '@/types/gallery'

export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
}

export function generateMetadata({ params }: Props): Metadata {
  const db = getDb()
  const album = db
    .prepare('SELECT title, description FROM albums WHERE slug = ?')
    .get(params.slug) as Pick<Album, 'title' | 'description'> | undefined

  if (!album) return { title: 'Album' }

  return {
    title: album.title,
    description: album.description ?? undefined,
  }
}

export default function AlbumPage({ params }: Props) {
  const db = getDb()

  const album = db
    .prepare('SELECT * FROM albums WHERE slug = ?')
    .get(params.slug) as Album | undefined

  if (!album) notFound()

  const photos = db
    .prepare('SELECT * FROM photos WHERE album_id = ? ORDER BY is_favorite DESC, display_order ASC')
    .all(album.id) as Photo[]

  const formattedDate = new Date(album.date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Fil d'ariane */}
      <div className="mb-8">
        <Link
          href="/photographie"
          className="text-[#52525b] text-xs font-mono hover:text-[#f59e0b] transition-colors"
        >
          ← Photographie
        </Link>
      </div>

      {/* Header album */}
      <div className="mb-10">
        <span
          className="inline-block text-xs font-mono uppercase tracking-widest mb-3 px-2 py-1 rounded"
          style={{ color: '#f59e0b', backgroundColor: '#f59e0b15' }}
        >
          {formattedDate}
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">{album.title}</h1>
        {album.description && (
          <p className="text-[#a1a1aa] text-lg max-w-2xl">{album.description}</p>
        )}
        <p className="text-[#52525b] text-xs font-mono mt-3">
          {photos.length} photo{photos.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Galerie */}
      <AlbumPhotoView photos={photos} />
    </div>
  )
}
