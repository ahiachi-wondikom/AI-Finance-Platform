import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
	'/dashboard(.*)',
	'/account(.*)',
	'/transaction(.*)',
])

const isPublicRoute = createRouteMatcher(['/', '/sign-in', '/sign-up'])

export default clerkMiddleware(async (auth, req) => {
	// Allow public routes to pass through
	if (isPublicRoute(req)) {
		return NextResponse.next()
	}

	// For protected routes, check authentication
	if (isProtectedRoute(req)) {
		const { userId } = await auth()

		if (!userId) {
			// Redirect to sign-in if not authenticated
			const signInUrl = new URL('/sign-in', req.url)
			signInUrl.searchParams.set('redirect_url', req.url)
			return NextResponse.redirect(signInUrl)
		}
	}

	return NextResponse.next()
})

export const config = {
	matcher: [
		// Skip Next.js internals and all static files
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
}
