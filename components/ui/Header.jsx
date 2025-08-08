import {
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton,
	UserButton,
} from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { Button } from './Button'

const Header = () => {
	return (
		<div className='fixed top-0  w-full bg-white/80 backdrop-blur-md z-50 border-b'>
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

				{/* Auth buttons */}
				<div className='flex items-center gap-4'>
					<SignedOut>
						<SignInButton>
							<Button variant='outline'>Sign In</Button>
						</SignInButton>

						{/* <SignUpButton>
						<button className='bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 hover:bg-[#5a3ddf] transition'>
							Sign Up
						</button>
					</SignUpButton> */}
					</SignedOut>

					<SignedIn>
						<UserButton afterSignOutUrl='/' />
					</SignedIn>
				</div>
			</nav>
		</div>
	)
}

export default Header
