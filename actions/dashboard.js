'use server'

import { db } from '@/lib/prisma'
import { auth, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

const serializeTransaction = (obj) => {
	const serialized = { ...obj }
	if (obj.balance) {
		serialized.balance = obj.balance.toNumber()
	}

	if (obj.amount) {
		serialized.amount = obj.amount.toNumber() // ✅ fixed (was using obj.balance)
	}

	return serialized
}

export async function createAccount(data) {
	console.log(
		'⚡ createAccount CALLED with:',
		data.get('name'),
		data.get('type'),
		data.get('balance'),
		data.get('isDefault')
	)
	try {
		const name = data.get('name')
		const type = data.get('type')
		const balance = data.get('balance')
		const isDefault = data.get('isDefault') === 'on' ? true : false // Checkbox returns 'on' if checked

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
		const balanceFloat = parseFloat(balance)
		if (isNaN(balanceFloat)) {
			throw new Error('Invalid balance amount')
		}

		// ✅ Check if this is the first account
		const existingAccounts = await db.account.findMany({
			where: { userId: dbUser.id },
		})

		const shouldBeDefault = existingAccounts.length === 0 ? true : isDefault

		if (shouldBeDefault) {
			await db.account.updateMany({
				where: { userId: dbUser.id, isDefault: true },
				data: { isDefault: false },
			})
		}

		// ✅ Create account
		const account = await db.account.create({
			data: {
				name: name,
				type: type,
				balance: balanceFloat,
				isDefault: shouldBeDefault,
				userId: dbUser.id,
			},
		})

		// ✅ Serialize & revalidate
		const serializedAccount = serializeTransaction(account) // ✅ fixed typo
		revalidatePath('/dashboard')

		return { success: true, data: serializedAccount }
	} catch (error) {
		console.error('[createAccount error]', error)
		throw new Error(error.message || 'Something went wrong')
	}
}

export async function getUserAccounts() {
	const { userId } = await auth()
	if (!userId) throw new Error('unauthorized')

	const user = await db.user.findUnique({
		where: { clerkUserId: userId },
	})

	if (!user) {
		throw new Error('User not found')
	}

	const accounts = await db.account.findMany({
		where: { userId: user.id },
		orderBy: { createdAt: 'desc' },
		include: {
			_count: {
				select: {
					transactions: true,
				},
			},
		},
	})

	const serializedAccount = accounts.map(serializeTransaction)
	return serializedAccount
}
