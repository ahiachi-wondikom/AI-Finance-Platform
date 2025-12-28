import { seedTransactions } from '@/actions/seed'

export async function GET() {
	console.log('Starting seed...')
	const result = await seedTransactions()
	console.log(result)
	return Response.json(result)
}
