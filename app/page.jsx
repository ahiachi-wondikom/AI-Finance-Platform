import {
	featuresData,
	howItWorksData,
	statsData,
	testimonialsData,
} from '@/components/data/landing'
import { Card, CardContent } from '@/components/ui/Card'
import HeroSection from '@/components/ui/Hero'
import Image from 'next/image'

export default function Home() {
	return (
		<div className='mt-40'>
			<HeroSection />

			<section className='py-20 bg-blue-50 '>
				<div className='container mx-auto px-4'>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
						{statsData.map((stat) => (
							<div key={stat.label} className='text-center'>
								{' '}
								<div className='text-4xl font-bold text-blue-600 mb-2'>
									{stat.value}
								</div>
								<div className='text-gray-600'>{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className='py-20'>
				<div className='container mx-auto px-4'>
					<h2 className='text-3xl  font-bold text-center mb-12'>
						Everything you need to manage your finances
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
						{featuresData.map((feature, title) => (
							<Card key={feature.title}>
								<CardContent className='space-y-4 pt-4'>
									{feature.icon}
									<h3 className='text-xl font-semibold'>{feature.title}</h3>
									<p className='text-gray-600'>{feature.description}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			<section className='py-20 bg-blue-50'>
				<div className='container mx-auto px-4'>
					<h2 className='text-3xl  font-bold text-center mb-16'>
						How it works
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
						{howItWorksData.map((step, title) => (
							<div key={step.title}>
								<div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6'>
									{step.icon}
								</div>
								<h3 className='text-xl font-semibold mb-4'>{step.title}</h3>
								<p className='text-gray-600'>{step.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className='py-20'>
				<div className='container mx-auto px-4'>
					<h2 className='text-3xl  font-bold text-center mb-12'>
						What our Users Say
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						{testimonialsData.map((testimonial, title) => (
							<Card key={testimonial.role}>
								<CardContent className='pt-4'>
									<div>
										<Image
											src={testimonial.image}
											alt={testimonial.name}
											width={40}
											height={40}
											className='rounded-full'
										/>
									</div>
									<div className='text-sm text-gray-600'>
										{testimonial.name}
									</div>
									<div className='text-sm text-gray-600'>
										{testimonial.role}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>
		</div>
	)
}
