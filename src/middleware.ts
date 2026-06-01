import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const path = request.nextUrl.pathname
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true'

  // Check if we're on admin subdomain (admin.{domain})
  if (hostname.startsWith('admin.')) {
    // Allow full access to admin dashboard (admin has access regardless of maintenance mode)
    return NextResponse.rewrite(new URL('/admin', request.url))
  }

  // Check if we're on dev subdomain (dev.{domain})
  if (hostname.startsWith('dev.')) {
    // Check for dev access password
    const authHeader = request.headers.get('authorization')
    const devPassword = process.env.DEV_PASSWORD || 'dev123'

    // Allow API requests without auth
    if (path.startsWith('/api')) {
      return NextResponse.next()
    }

    // If not authenticated, request basic auth
    if (!authHeader) {
      return new NextResponse('Authorization required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Dev Access", charset="UTF-8"',
        },
      })
    }

    // Validate the Basic auth credentials
    const encoded = authHeader.split(' ')[1]
    if (encoded) {
      try {
        const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
        // Format: username:password, we only care about the password matching DEV_PASSWORD
        const parts = decoded.split(':')
        if (parts.length === 2 && parts[1] === devPassword) {
          return NextResponse.next()
        }
      } catch {
        // Invalid base64
      }
    }

    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Dev Access", charset="UTF-8"',
      },
    })
  }

  // For root domain (non-admin, non-dev subdomains)
  if (maintenanceMode) {
    // In maintenance mode, show maintenance page for all non-API requests
    // Allow API requests to work normally
    if (path.startsWith('/api')) {
      return NextResponse.next()
    }

    // Rewrite all other requests to maintenance page
    if (!path.startsWith('/maintenance')) {
      return NextResponse.rewrite(new URL('/maintenance', request.url))
    }
  }

  return NextResponse.next()
}
