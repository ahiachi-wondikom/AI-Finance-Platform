import { Inter } from 'next/font/google'
import './globals.css'
import HeaderWrapper from '@/components/ui/HeaderWrapper'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'Welth',
	description: 'One stop Finance platform',
}

export default function RootLayout({ children }) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<body className={inter.className}>
					<HeaderWrapper />
					<main className='min-h-screen'>{children}</main>
					<Toaster />
					<footer className='bg-blue-50 py-12'>
						<div className='container mx-auto px-4 text-center text-gray-600'>
							<p>Made with 💖 by Marvis</p>
						</div>
					</footer>
				</body>
			</html>
		</ClerkProvider>
	)
}
