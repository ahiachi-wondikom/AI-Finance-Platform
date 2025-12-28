'use server'

import { db } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

import { revalidatePath } from 'next/cache'

const serializeTransaction = (obj) => {
	const serialized = { ...obj }
	if (obj.balance) {
		serialized.balance = obj.balance.toNumber()
	}

	if (obj.amount) {
		serialized.amount = obj.amount.toNumber()
	}

	return serialized
}

export async function updateDefaultAccount(accountId) {
	try {
		const { userId } = await auth()
		if (!userId) throw new Error('unauthorized')

		const user = await db.user.findUnique({
			where: { clerkUserId: userId },
		})

		if (!user) {
			throw new Error('User not found')
		}

		await db.account.updateMany({
			where: { userId: user.id, isDefault: true },
			data: { isDefault: false },
		})

		const account = await db.account.update({
			where: {
				id: accountId,
				userId: user.id,
			},
			data: { isDefault: true },
		})

		revalidatePath('/dashboard')
		return { success: true, data: serializeTransaction(account) }
	} catch (error) {
		return { success: false, error: error.message }
	}
}

export async function getAccountWithTransactions(accountId) {
	const { userId } = await auth()
	if (!userId) throw new Error('Unauthorized')

	console.log('🔍 getAccountWithTransactions called')
	console.log('  - Looking for accountId:', accountId)
	console.log('  - Clerk userId:', userId)

	const user = await db.user.findUnique({
		where: { clerkUserId: userId },
	})

	console.log('  - Database user found:', user?.id)

	if (!user) {
		throw new Error('User not found')
	}

	const account = await db.account.findUnique({
		where: { id: accountId, userId: user.id },
		include: {
			transactions: {
				orderBy: { date: 'desc' },
			},
			_count: {
				select: { transactions: true },
			},
		},
	})

	console.log('  - Account found:', account?.name)
	console.log('  - Account userId:', account?.userId)
	console.log('  - Transactions count:', account?.transactions?.length)
	console.log('  - First transaction:', account?.transactions?.[0])

	if (!account) return null

	return {
		...serializeTransaction(account),
		transactions: account.transactions.map(serializeTransaction),
	}
}
