import type { Metadata } from 'next'
import Link from 'next/link'
import { getDb } from '@/lib/db'
import AlbumGrid from '@/components/AlbumGrid'
import type { Album, Photo } from '@/types/gallery'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Photographie',
  description: 'Capturer des instants, jouer avec la lumière.',
}

interface FavoritePhoto extends Photo {
  album_slug: string
  album_title: string
}

export default function PhotographiePage() {
  const db = getDb()
  const albums = db.prepare('SELECT * FROM albums ORDER BY date DESC').all() as Album[]

  const favorites = db.prepare(`
    SELECT p.*, a.slug AS album_slug, a.title AS album_title
    FROM photos p
    JOIN albums a ON a.id = p.album_id
    WHERE p.is_favorite = 1
    ORDER BY p.created_at DESC
  `).all() as FavoritePhoto[]

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Hero */}
      <div className="mb-12">
        <span
          className="inline-block text-xs font-mono uppercase tracking-widest mb-3 px-2 py-1 rounded"
          style={{ color: '#f59e0b', backgroundColor: '#f59e0b15' }}
        >
          Passion
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">Photographie</h1>
        <p className="text-[#a1a1aa] text-lg max-w-xl">
          Capturer des instants, jouer avec la lumière.
        </p>
      </div>

      {/* À la une */}
      {favorites.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xs font-mono text-[#52525b] uppercase tracking-widest mb-6">
            À la une
          </h2>
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {favorites.map((photo) => (
              <Link
                key={photo.id}
                href={`/photographie/${photo.album_slug}`}
                className="break-inside-avoid block rounded-lg overflow-hidden bg-[#141414] group relative"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.thumb_url ?? photo.url}
                  alt={photo.caption ?? photo.album_title}
                  width={photo.thumb_width ?? undefined}
                  height={photo.thumb_height ?? undefined}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block group-hover:opacity-90 transition-opacity duration-200"
                />
                <div className="absolute bottom-0 inset-x-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-medium truncate">{photo.album_title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Grille d'albums */}
      <section>
        <h2 className="text-xs font-mono text-[#52525b] uppercase tracking-widest mb-6">
          Albums
        </h2>
        <AlbumGrid albums={albums} />
      </section>
    </div>
  )
}
