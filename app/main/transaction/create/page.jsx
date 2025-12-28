'use client'
import { format } from 'date-fns'
import { categoryColors } from '@/components/data/categories'
import { Checkbox } from '@/components/ui/Checkbox'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/Table'
import React from 'react'

console.log('categoryColors:', categoryColors)
const TransactionTable = ({ transactions = [] }) => {
	// ← Add default empty array
	const filteredAndSortedtransactions = transactions
	const handleSort = () => {}

	console.log('Transactions:', transactions)
	console.log('Available categoryColors:', categoryColors)
	console.log('First transaction category:', transactions[0]?.category)

	return (
		<div className='space-y-4'>
			{/* Filters */}
			{/* Transactions */}
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='w-[50px]'>
								<Checkbox />
							</TableHead>
							<TableHead
								className='cursor-pointer'
								onClick={() => handleSort('date')}
							>
								<div className='flex items-center'>Date</div>
							</TableHead>
							<TableHead>Description</TableHead>
							<TableHead
								className='cursor-pointer'
								onClick={() => handleSort('category')}
							>
								<div className='flex items-center'>Category</div>
							</TableHead>
							<TableHead
								className='cursor-pointer'
								onClick={() => handleSort('amount')}
							>
								<div className='flex items-center justify-end'>Amount</div>
							</TableHead>
							<TableHead>Recurring</TableHead>
							<TableHead className='w-[50px]' />
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredAndSortedtransactions.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={7}
									className='text-center text-muted-foreground'
								>
									No transaction found
								</TableCell>
							</TableRow>
						) : (
							filteredAndSortedtransactions.map((transaction) => (
								<TableRow key={transaction.id}>
									<TableCell>
										<Checkbox />
									</TableCell>
									<TableCell className='font-medium'>
										{format(new Date(transaction.date), 'PP')}
									</TableCell>
									<TableCell>{transaction.description}</TableCell>
									<TableCell className='capitalize'>
										<span
											style={{
												background: categoryColors[transaction.category],
											}}
											className='px-2 py-1 rounded text-white text-sm'
										>
											{transaction.category}
										</span>
									</TableCell>
									<TableCell
										className='text-right font-medium'
										style={{
											color: transaction.type === 'EXPENSE' ? 'red' : 'green',
										}}
									>
										{transaction.type === 'EXPENSE' ? '-' : '+'}$
										{transaction.amount.toFixed(2)}
									</TableCell>
									<TableCell>
										{transaction.isRecurring ? 'Yes' : 'No'}
									</TableCell>
									<TableCell />
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}

export default TransactionTable
