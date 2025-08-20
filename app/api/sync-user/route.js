import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'

export async function POST(request) {
	try {
		// Try to get userId from auth first
		const { userId } = auth()

		// Get data from request body as fallback
		const body = await request.json()

		const userIdToUse = userId || body.clerkUserId

		if (!userIdToUse) {
			return Response.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Check if user already exists
		const existingUser = await db.user.findUnique({
			where: { clerkUserId: userIdToUse },
		})

		if (existingUser) {
			return Response.json({ user: existingUser })
		}

		// Create new user using data from request body
		const newUser = await db.user.create({
			data: {
				clerkUserId: userIdToUse,
				name: body.name,
				email: body.email,
				imageUrl: body.imageUrl || '',
			},
		})
	} catch (error) {
		return Response.json(
			{
				error: 'Internal server error',
				details: error.message,
			},
			{ status: 500 }
		)
	}
}
