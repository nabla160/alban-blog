'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 pt-14 text-center">
      <p className="text-xs font-mono text-[#52525b] uppercase tracking-widest mb-4">Erreur</p>
      <h2 className="text-white font-semibold text-lg mb-2">Quelque chose s&apos;est mal passé</h2>
      <p className="text-[#71717a] text-sm mb-6">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 border border-[#333] text-white text-sm rounded-lg hover:border-white/40 transition-colors"
      >
        Réessayer
      </button>
    </div>
  )
}
