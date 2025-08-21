'use client'
import {
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
	useUser,
} from '@clerk/nextjs'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from './Button'
import { LayoutDashboard, PenBox } from 'lucide-react'

const Header = () => {
	const { isLoaded, isSignedIn } = useUser()
	const [mounted, setMounted] = useState(false)
	const router = useRouter()

	useEffect(() => {
		setMounted(true)
	}, [])

	const handleDashboardClick = () => {
		router.push('/dashboard')
	}

	const handleTransactionClick = () => {
		router.push('/transaction/create')
	}

	// Don't render until client-side hydration is complete
	if (!mounted || !isLoaded) {
		return (
			<div className='fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b'>
				<nav className='container mx-auto px-4 py-4 flex items-center justify-between'>
					<Link href='/'>
						<Image
							src={'/logo.png'}
							alt='Welth logo'
							height={60}
							width={200}
							className='h-12 w-auto object-contain'
						/>
					</Link>
					<div className='flex items-center gap-4'>
						{/* Loading placeholder */}
						<div className='h-10 w-20 bg-gray-200 rounded animate-pulse'></div>
					</div>
				</nav>
			</div>
		)
	}

	return (
		<div className='fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b'>
			<nav className='container mx-auto px-4 py-4 flex items-center justify-between'>
				<Link href='/'>
					<Image
						src={'/logo.png'}
						alt='Welth logo'
						height={60}
						width={200}
						className='h-12 w-auto object-contain'
					/>
				</Link>
				<div className='flex items-center gap-4'>
					<SignedOut>
						<SignInButton>
							<Button variant='outline'>Sign In</Button>
						</SignInButton>
					</SignedOut>
					<SignedIn>
						{/* Using onClick handlers for navigation */}
						<Button
							variant='outline'
							className='flex items-center gap-2'
							onClick={handleDashboardClick}
						>
							<LayoutDashboard size={18} />
							<span className='hidden md:inline'>Dashboard</span>
						</Button>

						<Button
							className='flex items-center gap-2'
							onClick={handleTransactionClick}
						>
							<PenBox size={18} />
							<span className='hidden md:inline'>Add Transaction</span>
						</Button>

						<UserButton
							afterSignOutUrl='/'
							appearance={{
								elements: {
									avatarBox: 'h-10 w-10',
								},
							}}
						/>
					</SignedIn>
				</div>
			</nav>
		</div>
	)
}

export default Header
