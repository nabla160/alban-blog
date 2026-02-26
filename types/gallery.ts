export interface Album {
  id: string
  slug: string
  title: string
  description: string | null
  date: string
  cover_url: string | null
  created_at: string
}

export interface ExifData {
  taken_at?: string      // ISO date string
  make?: string          // Fabricant (ex: "Sony")
  model?: string         // Modèle (ex: "ILCE-7M4")
  lens?: string          // Objectif (ex: "FE 35mm F1.8")
  aperture?: number      // Ouverture f/ (ex: 2.8)
  shutter?: number       // Vitesse en secondes (ex: 0.002 = 1/500s)
  iso?: number           // Sensibilité ISO
  focal_length?: number  // Focale en mm
  gps_lat?: number
  gps_lon?: number
}

export interface Photo {
  id: string
  album_id: string
  storage_path: string
  url: string
  thumb_url: string | null
  caption: string | null
  location: string | null
  exif_data: string | null  // JSON stringifié de ExifData
  thumb_width: number | null
  thumb_height: number | null
  display_order: number
  is_favorite: number       // 0 ou 1 (SQLite n'a pas de booléen natif)
  created_at: string
}
