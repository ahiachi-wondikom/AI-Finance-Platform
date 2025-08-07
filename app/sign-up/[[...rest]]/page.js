// File: app/sign-up/page.tsx
import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-50'>
			<div className='w-full max-w-md'>
				<SignUp routing='hash' redirectUrl='/' signInUrl='/sign-in' />
			</div>
		</div>
	)
}
