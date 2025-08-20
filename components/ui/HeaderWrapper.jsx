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
						console.log(result.user)
					}
				} catch (error) {
					console.error(error)
				}
			}
		}

		syncUser()
	}, [isLoaded, isSignedIn, user])

	return <Header />
}

export default HeaderWrapper
