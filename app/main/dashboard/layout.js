import DashboardPage from './page'

export default function DashboardLayout() {
	return (
		<div className='px-5'>
			<h1 className='text-6xl font-bold gradient-title mb-5'>Dashboard</h1>

			<DashboardPage />
		</div>
	)
}
