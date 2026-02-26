import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import type { Album } from '@/types/gallery'

function isAuthorized(req: NextRequest): boolean {
  return req.cookies.get('admin_token')?.value === process.env.ADMIN_SECRET
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const db = getDb()
  const albums = db.prepare('SELECT * FROM albums ORDER BY date DESC').all() as Album[]
  return NextResponse.json(albums)
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { slug, title, description, date } = await req.json()

  if (!slug || !title || !date) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

  try {
    const db = getDb()
    const album = db
      .prepare(`
        INSERT INTO albums (slug, title, description, date)
        VALUES (?, ?, ?, ?)
        RETURNING *
      `)
      .get(slug, title, description || null, date) as Album

    return NextResponse.json(album)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    if (message.includes('UNIQUE')) {
      return NextResponse.json({ error: 'Ce slug existe déjà' }, { status: 409 })
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { id, ...fields } = await req.json()
  const allowed = ['title', 'description', 'date', 'cover_url']
  const updates = Object.entries(fields).filter(([k]) => allowed.includes(k))

  if (updates.length === 0) {
    return NextResponse.json({ error: 'Aucun champ à mettre à jour' }, { status: 400 })
  }

  const db = getDb()
  const set = updates.map(([k]) => `${k} = ?`).join(', ')
  const values = updates.map(([, v]) => v)

  const album = db
    .prepare(`UPDATE albums SET ${set} WHERE id = ? RETURNING *`)
    .get(...values, id) as Album

  return NextResponse.json(album)
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { id } = await req.json()
  const db = getDb()
  db.prepare('DELETE FROM albums WHERE id = ?').run(id)
  return NextResponse.json({ ok: true })
}
