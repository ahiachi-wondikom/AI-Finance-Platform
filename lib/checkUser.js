import { currentUser } from '@clerk/nextjs/dist/types/server'

export const checkUser = async () => {
	const user = await currentUser()

	if (!user) {
		return null
	}

	try {
		const loggedInUser = await db.user.findUnique({
			where: {
				clerkUserId: user.id,
			},
		})
	} catch (error) {}
}
