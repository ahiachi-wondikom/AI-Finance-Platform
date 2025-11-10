'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

import { updateDefaultAccount } from '@/actions/accounts'
import useFetch from '@/components/hooks/use-fetch'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

const AccountCard = ({ account }) => {
	const { name, type, balance, id, isDefault } = account

	const {
		loading: updateDefaultLoading,
		fn: updateDefaultFn,
		data: updatedAccount,
		error,
	} = useFetch(updateDefaultAccount)

	const handleDefaultChange = async (checked) => {
		if (isDefault) {
			toast.warning('You need at least 1 default account')
			return
		}

		const result = await updateDefaultFn(id)
		if (result?.success) {
			toast.success('Default account updated successfully')
		}
	}

	useEffect(() => {
		if (error) {
			toast.error(error.message || 'Failed to update default account')
		}
	}, [error])

	return (
		<Card className='hover:shadow-md transition-shadow group relative'>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<Link href={`/main/account/${id}`} className='flex-1'>
					<CardTitle className='text-sm font-medium capitalize'>
						{name}
					</CardTitle>
				</Link>
				<Switch
					checked={isDefault}
					onCheckedChange={handleDefaultChange}
					disabled={updateDefaultLoading}
				/>
			</CardHeader>
			<Link href={`/main/account/${id}`}>
				<CardContent>
					<div className='text-2xl font-bold'>
						${parseFloat(balance).toFixed(2)}
					</div>
					<p className='text-xs text-muted-foreground'>Account</p>
				</CardContent>
				<CardFooter className='flex justify-between text-sm text-muted-foreground'>
					<div className='flex items-center mr-1'>
						<ArrowUpRight className='mr-1 h-4 w-4 text-green-500' /> Income
					</div>
					<div className='flex items-center'>
						<ArrowDownRight className='mr-1 h-4 w-4 text-red-500' /> Expense
					</div>
				</CardFooter>
			</Link>
		</Card>
	)
}
export default AccountCard
