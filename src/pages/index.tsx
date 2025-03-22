import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';

interface Product {
	id: number;
	title: string;
	price: number;
	description: string;
	category: string;
	image: string;
}

export default function Home() {
	const [showProduct, setShowProduct] = useState<string | null>(null);

	const { isLoading, data, isError } = useQuery({
		queryKey: ['products'],
		queryFn: async () => {
			const res = await fetch('https://fakestoreapi.com/products');
			return res.json();
		},
		enabled: true, // by default it's true this is for handling the query to be called or not
	});

	// Query keys is used for refetching the data with the parameter showProduct
	const {
		isLoading: isDetailLoading,
		data: details,
		isError: isDetailError,
	} = useQuery({
		queryKey: ['products', showProduct], // params showProduct
		queryFn: async () => {
			const res = await fetch(`https://fakestoreapi.com/products/${showProduct}`);
			return res.json();
		},
		enabled: showProduct !== null, // retriggers the query when showProduct is not null
	});

	if (isError) {
		return (
			<div>
				<h1>Something went wrong</h1>
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
						className='bg-white p-4 shadow rounded flex flex-col items-center justify-center cursor-pointer'
						onClick={() => setShowProduct(product.id.toString())}
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

			<div className={`fixed h-screen w-screen top-0 bg-black/50 left-0 ${showProduct ? 'flex justify-center items-center' : 'hidden'}`}>
				<div className='w-1/2 min-h-1/2 bg-white relative flex items-center gap-8 p-8 text-black'>
					<button
						className='absolute top-5 right-5 cursor-pointer'
						onClick={() => setShowProduct(null)}
					>
						X
					</button>

					<Image
						src={details?.image}
						alt={details?.title}
						className='w-1/4'
						width={100}
						height={100}
					/>

					<div className='w-3/4 space-y-4'>
						<h1 className='text-3xl font-bold'>{details?.title}</h1>
						<p className='text-xl '>{details?.description}</p>
						<p className='text-2xl font-bold'>{details?.price}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
