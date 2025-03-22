import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

interface Product {
	id: number;
	title: string;
	price: number;
	description: string;
	category: string;
	image: string;
}

export default function Home() {
	const { isLoading, data, isError } = useQuery({
		queryKey: ['products'],
		queryFn: async () => {
			const res = await fetch('https://fakestoreapi.com/products');
			return res.json();
		},
		enabled: true, // by default it's true this is for handling the query to be called or not
	});

	if (isError) {
		return (
			<div>
				<h1>something went wrong</h1>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className='grid grid-cols-1 gap-4 lg:grid-cols-5 p-8'>
				{Array.from({ length: 10 }).map((_, index) => {
					return (
						<div
							key={index}
							className='bg-white p-4 shadow rounded flex flex-col items-center justify-center animate-pulse aspect-square'
						>
							<div className='bg-gray-200 h-40 w-40' />
							<div className='bg-gray-200 h-4 w-20 mt-2' />
							<div className='bg-gray-200 h-4 w-20 mt-2' />
						</div>
					);
				})}
			</div>
		);
	}
	return (
		<div className='container mx-auto grid grid-cols-1 gap-4 lg:grid-cols-5 p-8'>
			{data?.map((product: Product) => {
				return (
					<div
						key={product.id}
						className='bg-white p-4 shadow rounded flex flex-col items-center justify-center'
					>
						<Image
							src={product.image}
							alt={product.title}
							width={100}
							height={100}
							priority={true}
							className='scale-50 h-40 w-fit'
						/>
						<h2 className='text-lg font-semibold text-black line-clamp-1 '>{product.title}</h2>
						<p className='text-sm text-gray-500'>${product.price}</p>
					</div>
				);
			})}
		</div>
	);
}
