import { NextRequest, NextResponse } from 'next/server'

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/campaign/:path*',
        '/create',
        '/auth',
        // '/campaigns/:path*',
    ],
}

export function middleware(request: NextRequest) {
    const walletAddress = request.cookies.get('walletAddress')?.value
    console.log("the middleware address is ",walletAddress)
    const pathname = request.nextUrl.pathname

    const isPublicRoute = [
        '/',
        '/auth',
        '/how-it-works',
        '/campaigns'
    ].some(path => pathname === path)

    const isPrivateRoute = [
        '/dashboard',
        '/campaign',
        '/create'
    ].some(path => pathname.startsWith(path))

    // Case 1: Authenticated user trying to access public routes — redirect to dashboard
    if (walletAddress && isPublicRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Case 2: Unauthenticated user trying to access private routes — redirect to auth
    if (!walletAddress && isPrivateRoute) {
        return NextResponse.redirect(new URL('/auth', request.url))
    }

    // Allow through otherwise
    return NextResponse.next()
}
