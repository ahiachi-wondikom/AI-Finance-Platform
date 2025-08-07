'use client'
import { useEffect } from 'react'

export default function ClerkToastHider() {
	useEffect(() => {
		const hideClerkToasts = () => {
			const elements = document.querySelectorAll('*')
			elements.forEach((el) => {
				if (
					el.textContent &&
					el.textContent.includes("This is a hosted version of Clerk's")
				) {
					// Hide the element and its parent containers
					el.style.display = 'none'
					const parent = el.closest('[class*="DevToast"], [class*="Toast"]')
					if (parent) parent.style.display = 'none'
				}
			})
		}

		// Run immediately and set up observer
		hideClerkToasts()
		const observer = new MutationObserver(hideClerkToasts)
		observer.observe(document.body, { childList: true, subtree: true })

		return () => observer.disconnect()
	}, [])

	return null // This component doesn't render anything
}
