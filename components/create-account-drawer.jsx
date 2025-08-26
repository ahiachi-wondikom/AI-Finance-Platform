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
			<DrawerTrigger>{children}</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Are you absolutely sure?</DrawerTitle>
				</DrawerHeader>
			</DrawerContent>
		</Drawer>
	)
}

export default CreateAccountDrawer
