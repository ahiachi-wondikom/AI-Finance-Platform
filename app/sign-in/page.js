// File: app/sign-in/page.tsx
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-50'>
			<div className='w-full max-w-md'>
				<SignIn routing='hash' redirectUrl='/' signUpUrl='/sign-up' />
			</div>
		</div>
	)
}
