import {
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton,
	UserButton,
} from '@clerk/nextjs'
import React from 'react'

const Header = () => {
	return (
		<header className='flex justify-between items-center px-6 py-4 border-b'>
			<h1 className='text-lg font-bold'>Welth</h1>

			{/* Auth buttons */}
			<div className='flex items-center gap-4'>
				<SignedOut>
					<SignInButton>
						<button className='text-sm sm:text-base font-medium border border-[#6c47ff] text-[#6c47ff] rounded-full h-10 sm:h-12 px-4 sm:px-5 hover:bg-[#6c47ff]/10 transition'>
							Sign In
						</button>
					</SignInButton>

					<SignUpButton>
						<button className='bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 hover:bg-[#5a3ddf] transition'>
							Sign Up
						</button>
					</SignUpButton>
				</SignedOut>

				<SignedIn>
					<UserButton afterSignOutUrl='/' />
				</SignedIn>
			</div>
		</header>
	)
}

export default Header
