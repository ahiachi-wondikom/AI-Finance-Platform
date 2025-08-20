import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'

export async function POST(request) {
	try {
		console.log('🔄 API sync-user called')

		// Try to get userId from auth first
		const { userId } = auth()
		console.log('👤 User ID from auth():', userId)

		// Get data from request body as fallback
		const body = await request.json()
		console.log('📦 Request body:', body)

		const userIdToUse = userId || body.clerkUserId

		if (!userIdToUse) {
			console.log('❌ No userId available')
			return Response.json({ error: 'Unauthorized' }, { status: 401 })
		}

		console.log('✅ Using user ID:', userIdToUse)

		// Check if user already exists
		const existingUser = await db.user.findUnique({
			where: { clerkUserId: userIdToUse },
		})

		if (existingUser) {
			console.log('✅ User already exists in database')
			return Response.json({ user: existingUser })
		}

		console.log('➕ Creating new user in database...')

		// Create new user using data from request body
		const newUser = await db.user.create({
			data: {
				clerkUserId: userIdToUse,
				name: body.name,
				email: body.email,
				imageUrl: body.imageUrl || '',
			},
		})

		console.log('✅ New user created in database:', newUser)
		return Response.json({ user: newUser })
	} catch (error) {
		console.error('❌ Database error:', error)
		return Response.json(
			{
				error: 'Internal server error',
				details: error.message,
			},
			{ status: 500 }
		)
	}
}
