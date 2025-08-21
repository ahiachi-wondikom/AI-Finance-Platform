import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default function TransactionPage() {
	const { userId } = auth()

	if (!userId) {
		redirect('/sign-in')
	}

	return (
		<div>
			<h1>Transactions Work!</h1>
			<p>Manage your transactions here.</p>
			<Link href='/transaction/create'>
				<button className='bg-blue-500 text-white px-4 py-2 rounded'>
					Create New Transaction
				</button>
			</Link>
		</div>
	)
}
