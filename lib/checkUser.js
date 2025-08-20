import { auth, clerkClient } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'

export const checkUser = async () => {
	console.log('🔍 checkUser function called')

	const { userId } = auth()
	console.log('👤 User ID from auth:', userId ? 'Found' : 'Not found')

	if (!userId) {
		console.log('❌ No user ID found, returning null')
		return null
	}

	try {
		// Get full user details from Clerk
		const user = await clerkClient.users.getUser(userId)
		console.log('📝 User details from Clerk:', {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.emailAddresses?.[0]?.emailAddress,
		})

		// Check if user exists in database
		const loggedInUser = await db.user.findUnique({
			where: {
				clerkUserId: user.id,
			},
		})

		if (loggedInUser) {
			console.log('✅ User found in database:', loggedInUser)
			return loggedInUser
		}

		console.log('➕ Creating new user in database...')
		const name = `${user.firstName} ${user.lastName}`

		const newUser = await db.user.create({
			data: {
				clerkUserId: user.id,
				name,
				imageUrl: user.imageUrl,
				email: user.emailAddresses[0].emailAddress,
			},
		})

		console.log('✅ New user created:', newUser)
		return newUser
	} catch (error) {
		console.error('❌ Error:', error.message)
		return null
	}
}
