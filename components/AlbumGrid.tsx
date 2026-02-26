import Link from 'next/link'
import Image from 'next/image'
import type { Album } from '@/types/gallery'

interface Props {
  albums: Album[]
}

export default function AlbumGrid({ albums }: Props) {
  if (albums.length === 0) {
    return (
      <div className="border border-[#262626] rounded-xl p-8 text-center">
        <p className="text-[#52525b] text-sm">Aucun album pour l'instant.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {albums.map((album) => (
        <Link
          key={album.id}
          href={`/photographie/${album.slug}`}
          className="group block bg-[#141414] border border-[#262626] rounded-xl overflow-hidden hover:border-[#f59e0b]/30 transition-all"
        >
          {/* Cover image */}
          <div className="h-52 bg-[#1a1a1a] overflow-hidden">
            {album.cover_url ? (
              <Image
                src={album.cover_url}
                alt={album.title}
                width={600}
                height={400}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[#3f3f46] text-xs font-mono">Pas de couverture</span>
              </div>
            )}
          </div>

          {/* Infos */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-white text-sm font-medium leading-snug">{album.title}</h3>
              <span className="text-[#52525b] text-xs font-mono flex-shrink-0">
                {new Date(album.date).getFullYear()}
              </span>
            </div>
            {album.description && (
              <p className="text-[#71717a] text-xs leading-relaxed line-clamp-2">
                {album.description}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
