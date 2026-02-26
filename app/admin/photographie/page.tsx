'use client'

import { useState, useEffect, useRef } from 'react'
import type { Album, Photo } from '@/types/gallery'

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function AdminPhotographiePage() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [activeTab, setActiveTab] = useState<'create' | 'upload' | 'edit' | 'favorites'>('create')

  // Favoris
  const [favAlbum, setFavAlbum] = useState<Album | null>(null)
  const [favPhotos, setFavPhotos] = useState<Photo[]>([])
  const [favLoading, setFavLoading] = useState(false)

  // Form édition album
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editStatus, setEditStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [editError, setEditError] = useState('')

  // Form création album
  const [albumTitle, setAlbumTitle] = useState('')
  const [albumSlug, setAlbumSlug] = useState('')
  const [albumSlugManual, setAlbumSlugManual] = useState(false)
  const [albumDesc, setAlbumDesc] = useState('')
  const [albumDate, setAlbumDate] = useState(new Date().toISOString().split('T')[0])
  const [albumStatus, setAlbumStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [albumError, setAlbumError] = useState('')

  // Upload photos
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, 'pending' | 'done' | 'error'>>({})
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'done'>('idle')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchAlbums()
  }, [])

  async function fetchAlbums() {
    const res = await fetch('/api/admin/albums')
    if (res.ok) {
      const data = await res.json()
      setAlbums(data)
    }
  }

  function handleTitleChange(val: string) {
    setAlbumTitle(val)
    if (!albumSlugManual) {
      setAlbumSlug(slugify(val))
    }
  }

  async function handleCreateAlbum(e: React.FormEvent) {
    e.preventDefault()
    setAlbumStatus('loading')
    setAlbumError('')

    const res = await fetch('/api/admin/albums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: albumTitle,
        slug: albumSlug,
        description: albumDesc,
        date: albumDate,
      }),
    })

    if (res.ok) {
      setAlbumStatus('success')
      setAlbumTitle('')
      setAlbumSlug('')
      setAlbumSlugManual(false)
      setAlbumDesc('')
      await fetchAlbums()
      setTimeout(() => setAlbumStatus('idle'), 2000)
    } else {
      try {
        const data = await res.json()
        setAlbumError(data.error?.message ?? data.error ?? 'Erreur lors de la création')
      } catch {
        setAlbumError(`Erreur serveur (${res.status}) — vérifie les variables d'environnement`)
      }
      setAlbumStatus('error')
    }
  }

  function startEditing(album: Album) {
    setEditingAlbum(album)
    setEditTitle(album.title)
    setEditDesc(album.description ?? '')
    setEditDate(album.date)
    setEditStatus('idle')
    setEditError('')
  }

  async function handleEditAlbum(e: React.FormEvent) {
    e.preventDefault()
    if (!editingAlbum) return
    setEditStatus('loading')
    setEditError('')

    const res = await fetch('/api/admin/albums', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingAlbum.id,
        title: editTitle,
        description: editDesc,
        date: editDate,
      }),
    })

    if (res.ok) {
      setEditStatus('success')
      await fetchAlbums()
      setTimeout(() => setEditStatus('idle'), 2000)
    } else {
      try {
        const data = await res.json()
        setEditError(data.error ?? 'Erreur lors de la modification')
      } catch {
        setEditError(`Erreur serveur (${res.status})`)
      }
      setEditStatus('error')
    }
  }

  async function deleteAlbum(album: Album) {
    if (!window.confirm(`Supprimer l'album "${album.title}" et toutes ses photos ? Cette action est irréversible.`)) return

    const res = await fetch('/api/admin/albums', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: album.id }),
    })

    if (res.ok) {
      setEditingAlbum(null)
      await fetchAlbums()
    }
  }

  async function loadFavPhotos(album: Album) {
    setFavAlbum(album)
    setFavLoading(true)
    const res = await fetch(`/api/admin/photos?album_id=${album.id}`)
    if (res.ok) setFavPhotos(await res.json())
    setFavLoading(false)
  }

  async function deletePhoto(photo: Photo) {
    if (!window.confirm(`Supprimer cette photo ? Cette action est irréversible.`)) return

    const res = await fetch('/api/admin/photos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photo_id: photo.id }),
    })

    if (res.ok) {
      setFavPhotos((prev) => prev.filter((p) => p.id !== photo.id))
    }
  }

  async function toggleFavorite(photo: Photo) {
    const newVal = photo.is_favorite ? 0 : 1
    const res = await fetch('/api/admin/photos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photo_id: photo.id, is_favorite: newVal }),
    })
    if (res.ok) {
      setFavPhotos((prev) =>
        prev.map((p) => (p.id === photo.id ? { ...p, is_favorite: newVal } : p))
      )
    }
  }

  async function setCover(photo: Photo) {
    if (!favAlbum) return
    const res = await fetch('/api/admin/albums', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: favAlbum.id, cover_url: photo.url }),
    })
    if (res.ok) {
      setFavAlbum((prev) => prev ? { ...prev, cover_url: photo.url } : prev)
    }
  }

  function addFiles(newFiles: FileList | File[]) {
    const arr = Array.from(newFiles).filter((f) => f.type.startsWith('image/'))
    setFiles((prev) => [...prev, ...arr])
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleUpload() {
    if (!selectedAlbum || files.length === 0) return
    setUploadStatus('loading')

    const initial: Record<string, 'pending' | 'done' | 'error'> = {}
    files.forEach((f) => (initial[f.name + f.size] = 'pending'))
    setUploadProgress(initial)

    // Upload par batch de 3, on libère les fichiers au fur et à mesure
    const batchSize = 3
    const snapshot = [...files]
    for (let i = 0; i < snapshot.length; i += batchSize) {
      const batch = snapshot.slice(i, i + batchSize)
      const formData = new FormData()
      formData.append('album_id', selectedAlbum.id)
      formData.append('album_slug', selectedAlbum.slug)
      batch.forEach((f) => formData.append('files', f))

      const res = await fetch('/api/admin/photos', {
        method: 'POST',
        body: formData,
      })

      const status = res.ok ? 'done' : 'error'
      setUploadProgress((prev) => {
        const next = { ...prev }
        batch.forEach((f) => (next[f.name + f.size] = status))
        return next
      })

      // Libérer les fichiers uploadés de la mémoire
      if (res.ok) {
        setFiles((prev) => prev.filter((f) => !batch.includes(f)))
      }
    }

    setUploadStatus('done')
    setFiles([])
  }

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <span className="inline-block text-xs font-mono uppercase tracking-widest mb-3 px-2 py-1 rounded"
          style={{ color: '#f59e0b', backgroundColor: '#f59e0b15' }}>
          Admin
        </span>
        <h1 className="text-3xl font-bold text-white mb-2">Photographie</h1>
        <p className="text-[#71717a] text-sm">Gérer les albums et photos</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-[#141414] border border-[#262626] rounded-lg p-1 w-fit">
        {(['create', 'edit', 'favorites', 'upload'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-[#262626] text-white'
                : 'text-[#71717a] hover:text-white'
            }`}
          >
            {tab === 'create' ? 'Créer' : tab === 'edit' ? 'Modifier' : tab === 'favorites' ? 'Administrer' : 'Uploader'}
          </button>
        ))}
      </div>

      {/* Tab : créer album */}
      {activeTab === 'create' && (
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
          <h2 className="text-white font-medium mb-6">Nouvel album</h2>
          <form onSubmit={handleCreateAlbum} className="space-y-4">
            <div>
              <label className="block text-xs text-[#71717a] mb-1.5">Titre</label>
              <input
                value={albumTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#52525b] focus:outline-none focus:border-[#f59e0b]/50"
                placeholder="Ex: Portugal 2024"
              />
            </div>
            <div>
              <label className="block text-xs text-[#71717a] mb-1.5">Slug (URL)</label>
              <input
                value={albumSlug}
                onChange={(e) => {
                  setAlbumSlug(e.target.value)
                  setAlbumSlugManual(true)
                }}
                required
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-sm font-mono placeholder-[#52525b] focus:outline-none focus:border-[#f59e0b]/50"
                placeholder="portugal-2024"
              />
              <p className="text-[#52525b] text-xs mt-1">/photographie/{albumSlug || '...'}</p>
            </div>
            <div>
              <label className="block text-xs text-[#71717a] mb-1.5">Description</label>
              <textarea
                value={albumDesc}
                onChange={(e) => setAlbumDesc(e.target.value)}
                rows={3}
                className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#52525b] focus:outline-none focus:border-[#f59e0b]/50 resize-none"
                placeholder="Description de l'album…"
              />
            </div>
            <div>
              <label className="block text-xs text-[#71717a] mb-1.5">Date</label>
              <input
                type="date"
                value={albumDate}
                onChange={(e) => setAlbumDate(e.target.value)}
                required
                className="bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#f59e0b]/50"
              />
            </div>

            {albumStatus === 'error' && (
              <p className="text-red-400 text-xs">{albumError}</p>
            )}

            <button
              type="submit"
              disabled={albumStatus === 'loading'}
              className="bg-[#f59e0b] text-black font-medium text-sm rounded-lg px-6 py-2.5 hover:bg-[#d97706] transition-colors disabled:opacity-50"
            >
              {albumStatus === 'loading' ? 'Création...' : albumStatus === 'success' ? 'Album créé !' : 'Créer l\'album'}
            </button>
          </form>

          {/* Liste des albums existants */}
          {albums.length > 0 && (
            <div className="mt-8 pt-8 border-t border-[#262626]">
              <h3 className="text-xs font-mono text-[#52525b] uppercase tracking-widest mb-4">Albums existants</h3>
              <div className="space-y-2">
                {albums.map((album) => (
                  <div key={album.id} className="flex items-center justify-between py-2.5 px-3 bg-[#0a0a0a] rounded-lg border border-[#262626]">
                    <div>
                      <p className="text-white text-sm">{album.title}</p>
                      <p className="text-[#52525b] text-xs font-mono">/photographie/{album.slug}</p>
                    </div>
                    <span className="text-[#52525b] text-xs">{album.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab : modifier album */}
      {activeTab === 'edit' && (
        <div className="space-y-4">
          {/* Sélection album */}
          {albums.length === 0 ? (
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
              <p className="text-[#52525b] text-sm">Aucun album à modifier.</p>
            </div>
          ) : (
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
              <h2 className="text-white font-medium mb-4">Choisir un album</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {albums.map((album) => (
                  <button
                    key={album.id}
                    onClick={() => startEditing(album)}
                    className={`text-left px-4 py-3 rounded-lg border transition-all ${
                      editingAlbum?.id === album.id
                        ? 'border-[#f59e0b]/50 bg-[#f59e0b]/5 text-white'
                        : 'border-[#262626] text-[#a1a1aa] hover:border-[#f59e0b]/30 hover:text-white'
                    }`}
                  >
                    <p className="text-sm font-medium">{album.title}</p>
                    <p className="text-xs text-[#52525b] font-mono mt-0.5">{album.date}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Formulaire d'édition */}
          {editingAlbum && (
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
              <h2 className="text-white font-medium mb-1">
                Modifier — <span className="text-[#f59e0b]">{editingAlbum.title}</span>
              </h2>
              <p className="text-[#52525b] text-xs font-mono mb-6">/photographie/{editingAlbum.slug}</p>
              <form onSubmit={handleEditAlbum} className="space-y-4">
                <div>
                  <label className="block text-xs text-[#71717a] mb-1.5">Titre</label>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                    className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#52525b] focus:outline-none focus:border-[#f59e0b]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#71717a] mb-1.5">Description</label>
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    rows={3}
                    className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#52525b] focus:outline-none focus:border-[#f59e0b]/50 resize-none"
                    placeholder="Description de l'album…"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#71717a] mb-1.5">Date</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    required
                    className="bg-[#0a0a0a] border border-[#262626] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#f59e0b]/50"
                  />
                </div>

                {editStatus === 'error' && (
                  <p className="text-red-400 text-xs">{editError}</p>
                )}

                <button
                  type="submit"
                  disabled={editStatus === 'loading'}
                  className="bg-[#f59e0b] text-black font-medium text-sm rounded-lg px-6 py-2.5 hover:bg-[#d97706] transition-colors disabled:opacity-50"
                >
                  {editStatus === 'loading' ? 'Enregistrement...' : editStatus === 'success' ? 'Modifié !' : 'Enregistrer'}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-[#262626]">
                <button
                  onClick={() => deleteAlbum(editingAlbum)}
                  className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                  </svg>
                  Supprimer l'album
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab : administrer les photos */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          {/* Sélection album */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
            <h2 className="text-white font-medium mb-4">Choisir un album</h2>
            {albums.length === 0 ? (
              <p className="text-[#52525b] text-sm">Aucun album.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {albums.map((album) => (
                  <button
                    key={album.id}
                    onClick={() => loadFavPhotos(album)}
                    className={`text-left px-4 py-3 rounded-lg border transition-all ${
                      favAlbum?.id === album.id
                        ? 'border-[#f59e0b]/50 bg-[#f59e0b]/5 text-white'
                        : 'border-[#262626] text-[#a1a1aa] hover:border-[#f59e0b]/30 hover:text-white'
                    }`}
                  >
                    <p className="text-sm font-medium">{album.title}</p>
                    <p className="text-xs text-[#52525b] font-mono mt-0.5">{album.date}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grille de photos */}
          {favAlbum && (
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-medium">
                  <span className="text-[#f59e0b]">{favAlbum.title}</span>
                </h2>
                {favPhotos.length > 0 && (
                  <span className="text-[#52525b] text-xs font-mono">
                    {favPhotos.filter((p) => p.is_favorite).length} favori{favPhotos.filter((p) => p.is_favorite).length !== 1 ? 's' : ''} · {favPhotos.length} photos
                  </span>
                )}
              </div>
              <p className="text-[#52525b] text-xs mb-5">
                Survole une photo pour accéder aux actions
              </p>

              {favLoading ? (
                <p className="text-[#52525b] text-sm">Chargement…</p>
              ) : favPhotos.length === 0 ? (
                <p className="text-[#52525b] text-sm">Aucune photo dans cet album.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                  {favPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative group rounded-lg overflow-hidden bg-[#0a0a0a] aspect-square"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.thumb_url ?? photo.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />

                      {/* Fond assombri au hover */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Bouton supprimer (gauche) */}
                      <button
                        onClick={() => deletePhoto(photo)}
                        className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md bg-red-500/80 hover:bg-red-500 text-white"
                        title="Supprimer"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                        </svg>
                      </button>

                      {/* Bouton couverture (centre) */}
                      <button
                        onClick={() => setCover(photo)}
                        className={`absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md text-white ${
                          photo.url === favAlbum?.cover_url
                            ? 'bg-sky-500 hover:bg-sky-400'
                            : 'bg-black/60 hover:bg-sky-500/80'
                        }`}
                        title={photo.url === favAlbum?.cover_url ? 'Couverture actuelle' : 'Définir comme couverture'}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </button>

                      {/* Bouton favori (droite) */}
                      <button
                        onClick={() => toggleFavorite(photo)}
                        className={`absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md text-white ${
                          photo.is_favorite
                            ? 'bg-[#f59e0b] hover:bg-[#d97706]'
                            : 'bg-black/60 hover:bg-[#f59e0b]/80'
                        }`}
                        title={photo.is_favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={photo.is_favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab : upload photos */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* Sélection album */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
            <h2 className="text-white font-medium mb-4">Sélectionner un album</h2>
            {albums.length === 0 ? (
              <p className="text-[#52525b] text-sm">Aucun album. Crée d'abord un album.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {albums.map((album) => (
                  <button
                    key={album.id}
                    onClick={() => setSelectedAlbum(album)}
                    className={`text-left px-4 py-3 rounded-lg border transition-all ${
                      selectedAlbum?.id === album.id
                        ? 'border-[#f59e0b]/50 bg-[#f59e0b]/5 text-white'
                        : 'border-[#262626] text-[#a1a1aa] hover:border-[#f59e0b]/30 hover:text-white'
                    }`}
                  >
                    <p className="text-sm font-medium">{album.title}</p>
                    <p className="text-xs text-[#52525b] font-mono mt-0.5">{album.date}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Zone de drop */}
          {selectedAlbum && (
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
              <h2 className="text-white font-medium mb-4">
                Photos — <span className="text-[#f59e0b]">{selectedAlbum.title}</span>
              </h2>

              {/* Drag & drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                  if (e.dataTransfer.files) addFiles(e.dataTransfer.files)
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-[#f59e0b]/60 bg-[#f59e0b]/5'
                    : 'border-[#262626] hover:border-[#f59e0b]/30'
                }`}
              >
                <p className="text-[#71717a] text-sm">
                  Glisse tes photos ici ou <span className="text-[#f59e0b]">clique pour choisir</span>
                </p>
                <p className="text-[#52525b] text-xs mt-1">JPG, PNG, WEBP, HEIC</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files && addFiles(e.target.files)}
                />
              </div>

              {/* Liste fichiers sélectionnés */}
              {files.length > 0 && (
                <div className="mt-4">
                  <p className="text-[#71717a] text-xs mb-2">
                    {files.length} fichier{files.length > 1 ? 's' : ''} sélectionné{files.length > 1 ? 's' : ''}
                    {' · '}
                    {(files.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(1)} MB au total
                  </p>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {files.map((file, i) => {
                      const key = file.name + file.size
                      const status = uploadProgress[key]
                      return (
                        <div key={i} className="flex items-center gap-3 py-1.5 px-3 bg-[#0a0a0a] rounded-lg border border-[#262626]">
                          <svg className="flex-shrink-0 text-[#52525b]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="M21 15l-5-5L5 21" />
                          </svg>
                          <p className="text-[#a1a1aa] text-xs truncate flex-1">{file.name}</p>
                          <p className="text-[#52525b] text-xs flex-shrink-0">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                          {status === 'done' && <span className="text-green-400 text-xs flex-shrink-0">✓</span>}
                          {status === 'error' && <span className="text-red-400 text-xs flex-shrink-0">✗</span>}
                          {!status && (
                            <button
                              onClick={() => removeFile(i)}
                              className="text-[#52525b] hover:text-red-400 text-xs transition-colors flex-shrink-0"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Bouton upload */}
              {files.length > 0 && (
                <div className="mt-4 flex items-center gap-4">
                  <button
                    onClick={handleUpload}
                    disabled={uploadStatus === 'loading'}
                    className="bg-[#f59e0b] text-black font-medium text-sm rounded-lg px-6 py-2.5 hover:bg-[#d97706] transition-colors disabled:opacity-50"
                  >
                    {uploadStatus === 'loading'
                      ? 'Upload en cours...'
                      : uploadStatus === 'done'
                      ? 'Upload terminé !'
                      : `Uploader ${files.length} photo${files.length > 1 ? 's' : ''}`}
                  </button>
                  {uploadStatus === 'done' && (
                    <button
                      onClick={() => {
                        setFiles([])
                        setUploadProgress({})
                        setUploadStatus('idle')
                      }}
                      className="text-[#71717a] text-sm hover:text-white transition-colors"
                    >
                      Réinitialiser
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
