import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
	'/dashboard(.*)',
	'/account(.*)',
	'/transaction(.*)',
])

// Define public routes that should be accessible without authentication
const isPublicRoute = createRouteMatcher([
	'/',
	'/sign-in(.*)',
	'/sign-up(.*)',
	'/api/webhook(.*)', // if you have webhooks
])

export default clerkMiddleware(async (auth, req) => {
	const { userId } = await auth()
	const { pathname } = req.nextUrl

	// Debug logging (remove in production)
	console.log('Middleware - Path:', pathname, 'UserId:', !!userId)

	// If user is signed in and trying to access sign-in/sign-up pages, redirect to dashboard
	if (
		userId &&
		(pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up'))
	) {
		return NextResponse.redirect(new URL('/dashboard', req.url))
	}

	// If user is not signed in and trying to access protected routes, redirect to sign-in
	if (!userId && isProtectedRoute(req)) {
		const signInUrl = new URL('/sign-in', req.url)
		signInUrl.searchParams.set('redirect_url', pathname)
		return NextResponse.redirect(signInUrl)
	}

	// Allow the request to proceed
	return NextResponse.next()
})

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
}
