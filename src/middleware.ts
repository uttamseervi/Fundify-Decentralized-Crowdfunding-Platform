import { NextRequest, NextResponse } from 'next/server'

// Define public routes
const PUBLIC_ROUTES = ['/', '/auth', '/how-it-works']

// Define private route prefixes
const PRIVATE_PREFIXES = ['/dashboard', '/campaigns']

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // Allow public routes
    if (PUBLIC_ROUTES.includes(pathname)) {
        return NextResponse.next()
    }

    // Check if the pathname starts with any private prefix
    const isPrivate = PRIVATE_PREFIXES.some(prefix =>
        pathname === prefix || pathname.startsWith(`${prefix}/`)
    )

    if (isPrivate) {
        const jwt = req.cookies.get('jwt')
        if (!jwt) {
            const loginUrl = new URL('/auth', req.url)
            loginUrl.searchParams.set('redirectedFrom', pathname)
            return NextResponse.redirect(loginUrl)
        }
    }

    return NextResponse.next()
}

// Fix the matcher to properly capture private routes
export const config = {
    matcher: [
        '/dashboard',
        '/dashboard/:path*',
        '/campaigns',
        '/campaigns/:path*',
    ],
}
