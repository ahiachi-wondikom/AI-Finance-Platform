'use client'

import { useEffect, useState } from 'react'

import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from './ui/Drawer'
import { zodResolver } from '@hookform/resolvers/zod'
import { accountSchema } from '@/app/lib/schema'
import { Input } from './ui/Input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/Select'
import { useForm } from 'react-hook-form'
import { Switch } from './ui/Switch'
import { Button } from './ui/Button'
import useFetch from './hooks/use-fetch'
import { createAccount } from '@/actions/dashboard'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const CreateAccountDrawer = ({ children }) => {
	const [open, setOpen] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		reset,
	} = useForm({
		resolver: zodResolver(accountSchema),
		defaultValues: {
			name: '',
			type: 'CURRENT',
			balance: '',
			isDefault: false,
		},
	})

	const {
		data: newAccount,
		error,
		fn: createAccountFn,
		loading: createAccountLoading,
	} = useFetch(createAccount)

	useEffect(() => {
		if (newAccount && !createAccountLoading) {
			toast.success('Account created successfully')
			reset()
			setOpen(false)
		}
	}, [createAccountLoading, newAccount])

	useEffect(() => {
		if (error) {
			toast.error(error.message || 'Failed to create account')
		}
	}, [error])

	const onSubmit = async (data) => {
		//  // ← Add this test line
		await createAccount(data)
			.then((res) => {
				toast.info('Form submitted!')

				setOpen(false)
				console.log(res)
			})
			.catch((err) => {
				console.error(err)
				toast.error(err.message || 'Failed to create account')
			})
		console.log('Form submitted with data:', data.get('name')) // ← Log the form data
	}
	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Create New Account</DrawerTitle>
				</DrawerHeader>
				<div className='px-4 pb-4'>
					<form action={onSubmit} className='space-y-4'>
						<div className='space-y-2'>
							<label htmlFor='name' className='text-sm font-medium'>
								Account Name
							</label>
							<Input
								id='name'
								name='name'
								placeholder='e.g., Main Checking'
								required
							/>
						</div>

						<div className='space-y-2'>
							<label htmlFor='type' className='text-sm font-medium'>
								Account Type
							</label>
							<Select name='type' required>
								<SelectTrigger id='type'>
									<SelectValue placeholder='Select Type' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='CURRENT'>Current</SelectItem>
									<SelectItem value='SAVINGS'>Savings</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className='space-y-2'>
							<label htmlFor='balance' className='text-sm font-medium'>
								Initial Balance
							</label>
							<Input
								id='balance'
								name='balance'
								type='number'
								step='0.01'
								placeholder='0.00'
								required
							/>
						</div>

						<div className='flex items-center justify-between rounded-lg border p-3'>
							<div>
								<label
									htmlFor='isDefault'
									className='text-sm font-medium cursor-pointer'
								>
									Set as default
								</label>
								<p className='text-sm text-muted-foreground'>
									This account will be selected by default for transaction
								</p>
							</div>
							<Switch id='isDefault' name='isDefault' />
						</div>

						<div className='flex gap-2 pt-4'>
							<DrawerClose asChild>
								<Button type='button' variant='outline' className='flex-1'>
									Cancel
								</Button>
							</DrawerClose>
							<Button type='submit' className='flex-1'>
								Create Account
							</Button>
						</div>
					</form>
				</div>
			</DrawerContent>
		</Drawer>
	)
}
export default CreateAccountDrawer
