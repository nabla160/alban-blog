import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-[#262626] mt-20 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[#52525b]">
          © {new Date().getFullYear()} Alban Laborde-Laulhé
        </p>
        <div className="flex items-center gap-4 text-sm text-[#52525b]">
          <a
            href="mailto:alban@laulhe.io"
            className="hover:text-white transition-colors"
          >
            alban@laulhe.io
          </a>
          <a
            href="https://github.com/albanlaborde-laulhe"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/albanlabordelaulhe"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}
