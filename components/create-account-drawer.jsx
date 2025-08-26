'use client'

import { useState } from 'react'
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from './ui/Drawer'

const CreateAccountDrawer = ({ children }) => {
	const [open, setOpen] = useState(false)

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Create New Account</DrawerTitle>
				</DrawerHeader>
				<div>
					<form></form>
				</div>
			</DrawerContent>
		</Drawer>
	)
}

export default CreateAccountDrawer
