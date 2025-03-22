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
	const query = useQuery({
		queryKey: ['products'],
		queryFn: async () => {
			const res = await fetch('https://fakestoreapi.com/products');
			return res.json();
		},
	});

	return (
		<div className='container mx-auto grid grid-cols-1 gap-4 lg:grid-cols-5'>
			{query.isLoading && <p>Loading...</p>}
			{query?.data?.map((product: Product) => {
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
