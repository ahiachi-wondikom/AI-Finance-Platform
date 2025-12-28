// app/api/sync-user/route.js
import { prisma } from '@/lib/prisma'

export async function POST(req) {
	try {
		const body = await req.json()

		const user = await prisma.user.upsert({
			where: {
				clerkUserId: body.clerkUserId,
			},
			update: {
				name: body.name,
				email: body.email,
				imageUrl: body.imageUrl,
			},
			create: {
				clerkUserId: body.clerkUserId,
				name: body.name,
				email: body.email,
				imageUrl: body.imageUrl,
			},
		})

		return Response.json({ user }, { status: 200 })
	} catch (error) {
		console.error('❌ Sync user error:', error)
		return Response.json(
			{ error: 'Failed to sync user', details: error.message },
			{ status: 500 }
		)
	}
}
