import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // La page login est accessible sans cookie
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }

    const token = request.cookies.get('admin_token')?.value
    if (token !== process.env.ADMIN_SECRET) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
