import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import path from 'path'
import fs from 'fs'
import type { Photo, ExifData } from '@/types/gallery'

function isAuthorized(req: NextRequest): boolean {
  return req.cookies.get('admin_token')?.value === process.env.ADMIN_SECRET
}

function formatShutter(seconds: number): string {
  if (seconds >= 1) return `${seconds}s`
  return `1/${Math.round(1 / seconds)}s`
}

async function extractExif(buffer: Buffer): Promise<{ exif: ExifData; location: string | null }> {
  try {
    const exifr = await import('exifr')
    const raw = await exifr.default.parse(buffer, {
      pick: [
        'DateTimeOriginal', 'Make', 'Model', 'LensModel', 'Lens',
        'FNumber', 'ExposureTime', 'ISO', 'FocalLength',
        'GPSLatitude', 'GPSLongitude',
      ],
    })

    if (!raw) return { exif: {}, location: null }

    const exif: ExifData = {}

    if (raw.DateTimeOriginal instanceof Date) {
      exif.taken_at = raw.DateTimeOriginal.toISOString()
    }
    if (raw.Make) exif.make = String(raw.Make).trim()
    if (raw.Model) exif.model = String(raw.Model).trim()
    if (raw.LensModel) exif.lens = String(raw.LensModel).trim()
    else if (raw.Lens) exif.lens = String(raw.Lens).trim()
    if (raw.FNumber) exif.aperture = Number(raw.FNumber)
    if (raw.ExposureTime) exif.shutter = Number(raw.ExposureTime)
    if (raw.ISO) exif.iso = Number(raw.ISO)
    if (raw.FocalLength) exif.focal_length = Number(raw.FocalLength)

    let location: string | null = null
    if (raw.GPSLatitude != null && raw.GPSLongitude != null) {
      exif.gps_lat = raw.GPSLatitude
      exif.gps_lon = raw.GPSLongitude
      const latDir = raw.GPSLatitude >= 0 ? 'N' : 'S'
      const lonDir = raw.GPSLongitude >= 0 ? 'E' : 'O'
      location = `${Math.abs(raw.GPSLatitude).toFixed(4)}°${latDir}, ${Math.abs(raw.GPSLongitude).toFixed(4)}°${lonDir}`
    }

    return { exif, location }
  } catch {
    return { exif: {}, location: null }
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const albumId = req.nextUrl.searchParams.get('album_id')
  if (!albumId) {
    return NextResponse.json({ error: 'album_id manquant' }, { status: 400 })
  }

  const db = getDb()
  const photos = db
    .prepare('SELECT * FROM photos WHERE album_id = ? ORDER BY is_favorite DESC, display_order ASC')
    .all(albumId) as Photo[]

  return NextResponse.json(photos)
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { photo_id, is_favorite, location } = await req.json()
  const db = getDb()

  if (is_favorite !== undefined) {
    const photo = db
      .prepare('UPDATE photos SET is_favorite = ? WHERE id = ? RETURNING *')
      .get(is_favorite ? 1 : 0, photo_id) as Photo
    return NextResponse.json(photo)
  }

  if (location !== undefined) {
    const photo = db
      .prepare('UPDATE photos SET location = ? WHERE id = ? RETURNING *')
      .get(location || null, photo_id) as Photo
    return NextResponse.json(photo)
  }

  return NextResponse.json({ error: 'Aucun champ à mettre à jour' }, { status: 400 })
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const formData = await req.formData()
  const albumId = formData.get('album_id') as string
  const albumSlug = formData.get('album_slug') as string
  const files = formData.getAll('files') as File[]

  if (!albumId || !albumSlug || files.length === 0) {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
  }

  const db = getDb()

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'albums', albumSlug)
  fs.mkdirSync(uploadDir, { recursive: true })

  const last = db
    .prepare('SELECT display_order FROM photos WHERE album_id = ? ORDER BY display_order DESC LIMIT 1')
    .get(albumId) as { display_order: number } | undefined
  let nextOrder = last ? last.display_order + 1 : 0

  const results: Photo[] = []

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const filename = `${uid}.${ext}`
    const thumbFilename = `thumb_${uid}.jpg`

    // Écriture fichier original
    fs.writeFileSync(path.join(uploadDir, filename), buffer)

    // Génération miniature avec sharp
    let thumbUrl: string | null = null
    let thumbWidth: number | null = null
    let thumbHeight: number | null = null
    try {
      const sharp = (await import('sharp')).default
      const { data: thumbBuffer, info } = await sharp(buffer)
        .resize(600, 600, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 78 })
        .toBuffer({ resolveWithObject: true })
      fs.writeFileSync(path.join(uploadDir, thumbFilename), thumbBuffer)
      thumbUrl = `/uploads/albums/${albumSlug}/${thumbFilename}`
      thumbWidth = info.width
      thumbHeight = info.height
    } catch {
      // Si sharp échoue, on continue sans miniature
    }

    // Extraction EXIF
    const { exif, location } = await extractExif(buffer)

    const url = `/uploads/albums/${albumSlug}/${filename}`
    const storagePath = `uploads/albums/${albumSlug}/${filename}`
    const thumbStoragePath = thumbUrl ? `uploads/albums/${albumSlug}/${thumbFilename}` : null

    const photo = db
      .prepare(`
        INSERT INTO photos (album_id, storage_path, url, thumb_url, thumb_width, thumb_height, exif_data, location, display_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING *
      `)
      .get(
        albumId,
        storagePath,
        url,
        thumbUrl,
        thumbWidth,
        thumbHeight,
        Object.keys(exif).length > 0 ? JSON.stringify(exif) : null,
        location,
        nextOrder,
      ) as Photo

    results.push(photo)
    nextOrder++
  }

  return NextResponse.json(results)
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { photo_id } = await req.json()
  const db = getDb()

  const photo = db.prepare('SELECT storage_path, thumb_url FROM photos WHERE id = ?').get(photo_id) as
    | { storage_path: string; thumb_url: string | null }
    | undefined

  if (photo) {
    const fullPath = path.join(process.cwd(), 'public', photo.storage_path)
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath)

    if (photo.thumb_url) {
      // thumb_url est une URL publique (/uploads/...), on reconstruit le path
      const thumbPath = path.join(process.cwd(), 'public', photo.thumb_url)
      if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath)
    }
  }

  db.prepare('DELETE FROM photos WHERE id = ?').run(photo_id)
  return NextResponse.json({ ok: true })
}
