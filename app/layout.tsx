import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Noto_Serif } from 'next/font/google'
import './globals.css'
import 'katex/dist/katex.min.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getArticles } from '@/lib/mdx'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-noto-serif',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Alban Laborde-Laulhé',
    template: '%s — Alban Laborde-Laulhé',
  },
  description: 'Étudiant à l\'ENSCP — Chimie, photographie, comédie musicale, musique et théâtre.',
  authors: [{ name: 'Alban Laborde-Laulhé' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Alban Laborde-Laulhé',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const hasArticles = getArticles().length > 0

  return (
    <html lang="fr" className={`h-full ${inter.variable} ${jetbrainsMono.variable} ${notoSerif.variable} dark`}>
      <body className={`h-full flex flex-col ${notoSerif.className}`}>
        <Nav hasArticles={hasArticles} />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
