// File: middleware.ts (or middleware.js)
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes that should NOT require authentication
const isPublicRoute = createRouteMatcher([
	'/sign-in',
	'/sign-up',
	'/', // Add your homepage if it should be public
	// Add any other public routes you need
])

export default clerkMiddleware((auth, request) => {
	if (!isPublicRoute(request)) {
		auth().protect()
	}
})

export const config = {
	matcher: [
		// Skip Next.js internals and all static files
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
}
