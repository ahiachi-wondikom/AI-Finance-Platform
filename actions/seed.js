'use server'

import { db } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { subDays } from 'date-fns'

const ACCOUNT_ID = '1440af35-e27a-4089-9ffd-bf24b51f7276'
const USER_ID = '4be68a84-aa5c-4063-b9fd-2c1db7a7c0a6'

// Categories with their typical amount ranges
const CATEGORIES = {
	INCOME: [
		{ name: 'salary', range: [5000, 8000] },
		{ name: 'freelance', range: [1000, 3000] },
		{ name: 'investments', range: [500, 2000] },
		{ name: 'other-income', range: [100, 1000] },
	],
	EXPENSE: [
		{ name: 'housing', range: [1000, 2000] },
		{ name: 'transportation', range: [100, 500] },
		{ name: 'groceries', range: [200, 600] },
		{ name: 'utilities', range: [100, 300] },
		{ name: 'entertainment', range: [50, 200] },
		{ name: 'food', range: [50, 150] },
		{ name: 'shopping', range: [100, 500] },
		{ name: 'healthcare', range: [100, 1000] },
		{ name: 'education', range: [200, 1000] },
		{ name: 'travel', range: [500, 2000] },
	],
}

// Helper to generate random amount within a range
function getRandomAmount(min, max) {
	return Number((Math.random() * (max - min) + min).toFixed(2))
}

// Helper to get random category with amount
function getRandomCategory(type) {
	const categories = CATEGORIES[type]
	const category = categories[Math.floor(Math.random() * categories.length)]
	const amount = getRandomAmount(category.range[0], category.range[1])
	return { category: category.name, amount }
}

export async function seedTransactions() {
	try {
		const { userId } = await auth()
		if (!userId) throw new Error('Unauthorized')

		const user = await db.user.findUnique({
			where: { clerkUserId: userId },
			include: { accounts: true },
		})

		if (!user) throw new Error('User not found')
		if (user.accounts.length === 0) throw new Error('No accounts found')

		const account =
			user.accounts.find((acc) => acc.isDefault) || user.accounts[0]

		// ✅ FIX: Convert Decimal to number
		let totalBalance = parseFloat(account.balance.toString())

		// Generate transactions
		const transactions = []

		for (let i = 90; i >= 0; i--) {
			const date = subDays(new Date(), i)
			const transactionsPerDay = Math.floor(Math.random() * 3) + 1

			for (let j = 0; j < transactionsPerDay; j++) {
				const type = Math.random() < 0.4 ? 'INCOME' : 'EXPENSE'
				const { category, amount } = getRandomCategory(type)

				transactions.push({
					type,
					amount,
					description: `${
						type === 'INCOME' ? 'Received' : 'Paid for'
					} ${category}`,
					date,
					category,
					status: 'COMPLETED',
					userId: user.id,
					accountId: account.id,
					createdAt: date,
					updatedAt: date,
				})

				// ✅ Now this does proper math instead of string concatenation
				totalBalance += type === 'INCOME' ? amount : -amount
			}
		}

		// Clear existing transactions
		await db.transaction.deleteMany({
			where: { accountId: account.id },
		})

		// Insert in batches
		const BATCH_SIZE = 50
		let insertedCount = 0

		for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
			const batch = transactions.slice(i, i + BATCH_SIZE)

			await db.transaction.createMany({
				data: batch,
			})

			insertedCount += batch.length
			console.log(
				`Inserted ${insertedCount}/${transactions.length} transactions`
			)
		}

		// ✅ FIX: Round to 2 decimal places and ensure it's a valid number
		const finalBalance = Math.max(0, parseFloat(totalBalance.toFixed(2)))

		// Update account balance
		await db.account.update({
			where: { id: account.id },
			data: { balance: finalBalance },
		})

		return {
			success: true,
			message: `Created ${transactions.length} transactions for account: ${account.name}`,
			count: transactions.length,
			newBalance: finalBalance,
		}
	} catch (error) {
		console.error('Error seeding transactions:', error)
		return { success: false, error: error.message }
	}
}
