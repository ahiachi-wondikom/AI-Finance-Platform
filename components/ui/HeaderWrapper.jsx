'use client'
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'
import Header from './Header'

const HeaderWrapper = () => {
	const { isLoaded, isSignedIn, user } = useUser()

	useEffect(() => {
		const syncUser = async () => {
			if (isLoaded && isSignedIn && user) {
				try {
					console.log('🔄 Starting user sync from client...')
					console.log('👤 User data:', {
						id: user.id,
						firstName: user.firstName,
						lastName: user.lastName,
						email: user.emailAddresses?.[0]?.emailAddress,
					})

					const response = await fetch('/api/sync-user', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							clerkUserId: user.id,
							name: `${user.firstName} ${user.lastName}`,
							email: user.emailAddresses[0].emailAddress,
							imageUrl: user.imageUrl,
						}),
					})

					const result = await response.json()

					if (response.ok) {
						console.log('✅ User synced successfully:', result.user)
					} else {
						console.error('❌ Failed to sync user:', result.error)
						console.error('❌ Full response:', result)
					}
				} catch (error) {
					console.error('❌ Error syncing user:', error)
				}
			}
		}

		syncUser()
	}, [isLoaded, isSignedIn, user])

	return <Header />
}

export default HeaderWrapper
