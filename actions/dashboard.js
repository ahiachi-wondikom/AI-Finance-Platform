'use server'

import { db } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

const serializeAccount = (obj) => {
	const serialized = { ...obj }
	if (obj.balance) {
		serialized.balance = obj.balance.toNumber()
	}
	return serialized
}

export async function createAccount(data) {
	console.log('⚡ createAccount CALLED with:', data)
	try {
		// ✅ Get logged-in user from Clerk
		const user = await currentUser()
		console.log('🔑 Clerk currentUser:', user)
		if (!user) {
			throw new Error('Unauthorized')
		}

		// ✅ Look up the user in Prisma
		const dbUser = await db.user.findUnique({
			where: { clerkUserId: user.id },
		})
		if (!dbUser) {
			throw new Error('User not found in database')
		}

		// ✅ Convert balance to float
		const balanceFloat = parseFloat(data.balance)
		if (isNaN(balanceFloat)) {
			throw new Error('Invalid balance amount')
		}

		// ✅ Check if this is the first account
		const existingAccounts = await db.account.findMany({
			where: { userId: dbUser.id },
		})

		const shouldBeDefault =
			existingAccounts.length === 0 ? true : data.isDefault

		if (shouldBeDefault) {
			// unset old default accounts
			await db.account.updateMany({
				where: { userId: dbUser.id, isDefault: true },
				data: { isDefault: false },
			})
		}

		// ✅ Create account
		const account = await db.account.create({
			data: {
				name: data.name,
				type: data.type,
				balance: balanceFloat,
				isDefault: shouldBeDefault,
				userId: dbUser.id,
			},
		})

		// ✅ Serialize & revalidate
		const serializedAccount = serializeAccount(account)
		revalidatePath('/dashboard')

		return { success: true, data: serializedAccount }
	} catch (error) {
		console.error('[createAccount error]', error)
		throw new Error(error.message || 'Something went wrong')
	}
}
