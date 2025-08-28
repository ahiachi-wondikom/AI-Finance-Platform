'use client'

import { useState } from 'react'
import {
	Drawer,
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
} from '@radix-ui/react-select'
import { useForm } from 'react-hook-form'

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

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Create New Account</DrawerTitle>
				</DrawerHeader>
				<div className='px-4 pb-4'>
					<form className='space-y-4'>
						<div className='space-y-2'>
							<label htmlFor='name' className='text-sm font-medium'>
								Account Name
							</label>
							<Input
								id='name'
								placeholder='e.g., Main Checking'
								{...register('name')}
							/>
							{errors.name && (
								<p className='text-sm text-red-500'>{errors.name.message}</p>
							)}
						</div>

						<div className='space-y-2'>
							<label htmlFor='type' className='text-sm font-medium'>
								Account Type
							</label>
							<Select
								onValueChange={(value) => setValue('type', value)}
								defaultValue={watch('type')}
							>
								<SelectTrigger id='type'>
									<SelectValue placeholder='Select Type' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='Current'>Current</SelectItem>
									<SelectItem value='Savings'>Savings</SelectItem>
								</SelectContent>
							</Select>
							{errors.type && (
								<p className='text-sm text-red-500'>{errors.type.message}</p>
							)}
						</div>
					</form>
				</div>
			</DrawerContent>
		</Drawer>
	)
}

export default CreateAccountDrawer
