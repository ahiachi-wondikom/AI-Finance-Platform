import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/Card'
import { Switch } from '@radix-ui/react-switch'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import React from 'react'

const AccountCard = ({ account }) => {
	const { name, type, balance, id, isDefault } = account
	return (
		<Card>
			<CardHeader>
				<CardTitle>{name}</CardTitle>
				<Switch />
			</CardHeader>
			<CardContent>
				<div className='text-2xl font-bold'>
					${parseFloat(balance).toFixed(2)}
				</div>
				<p className='text-xs text-muted-foreground '>Account</p>
			</CardContent>
			<CardFooter className='flex'>
				<div className='flex items-center mr-1'>
					<ArrowUpRight className='mr-1 h-4 w-4 text-green-500' /> Income
				</div>
				<div className='flex items-center'>
					<ArrowDownRight className='mr-1 h-4 w-4 text-red-500' /> Expense
				</div>
			</CardFooter>
		</Card>
	)
}

export default AccountCard
