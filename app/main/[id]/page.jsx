import { getAccountWithTransactions } from '@/actions/accounts'
import { notFound } from 'next/navigation'
import React from 'react'
import TransactionTable from '@/app/main/account/[id]/_components/transaction-table'

const AccountsPage = async ({ params }) => {
	const { id } = await params
	const accountData = await getAccountWithTransactions(id)

	if (!accountData) {
		notFound()
	}

	// ❌ REMOVE THIS LINE - accountId and user are not defined here
	// console.log('Fetching account:', accountId, 'for user:', user.id)

	// ✅ ADD THESE DEBUG LOGS INSTEAD
	console.log('===== ACCOUNT PAGE DEBUG =====')
	console.log('Account ID:', id)
	console.log('Account Data:', accountData)
	console.log('Transactions:', accountData?.transactions?.length)

	const { transactions, ...account } = accountData

	return (
		<div className='space-y-8 px-5'>
			<div className='flex gap-4 items-end justify-between'>
				<div>
					<h1 className='text-5xl sm:text-6xl font-bold gradient-title capitalize'>
						{' '}
						{/* ← Fixed typos */}
						{account.name}
					</h1>
					<p className='text-muted-foreground'>
						{account.type.charAt(0) + account.type.slice(1).toLowerCase()}{' '}
						Account
					</p>
				</div>
				<div className='text-right pb-2'>
					<div className='text-xl sm:text-2xl font-bold'>
						${parseFloat(account.balance).toFixed(2)}
					</div>
					<p className='text-sm text-muted-foreground'>
						{account._count.transactions} Transactions
					</p>
				</div>
			</div>

			{/* ❌ REMOVE Suspense - it's not needed here, data is already loaded */}
			{/* ✅ TransactionTable should be outside the flex container */}
			<TransactionTable transactions={transactions} />
		</div>
	)
}

export default AccountsPage
