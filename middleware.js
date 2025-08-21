import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
	'/dashboard(.*)',
	'/account(.*)',
	'/transaction(.*)',
])

export default clerkMiddleware(async (auth, req) => {
	// For protected routes, check authentication
	if (isProtectedRoute(req)) {
		const { userId } = await auth()

		if (!userId) {
			// Create sign-in URL with proper redirect
			const signInUrl = new URL('/sign-in', req.url)
			return NextResponse.redirect(signInUrl)
		}
	}

	return NextResponse.next()
})

export const config = {
	matcher: [
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		'/(api|trpc)(.*)',
	],
}
