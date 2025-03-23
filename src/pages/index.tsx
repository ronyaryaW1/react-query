import { useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { FormEvent, useState } from 'react';

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
	const [showAddProduct, setShowAddProduct] = useState(false);

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
		// isLoading: isDetailLoading,
		data: details,
		// isError: isDetailError,
	} = useQuery({
		queryKey: ['products', showProduct], // params showProduct
		queryFn: async () => {
			const res = await fetch(`https://fakestoreapi.com/products/${showProduct}`);
			return res.json();
		},
		enabled: showProduct !== null, // retriggers the query when showProduct is not null
	});

	const mutationAddProduct = useMutation({
		mutationFn: async (product: FormData) => {
			return await fetch('https://fakestoreapi.com/products', {
				method: 'POST',
				body: product,
			});
		},
	});

	const AddProduct = (e: FormEvent) => {
		e.preventDefault();
		mutationAddProduct.mutate(new FormData(e.target as HTMLFormElement));
	};

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
		<div className='container mx-auto p-8'>
			<div className='mb-4 flex justify-end'>
				<button
					className='bg-blue-500 text-white py-2 rounded-sm px-4 cursor-pointer'
					onClick={() => setShowAddProduct(true)}
				>
					Add Product
				</button>
				<div className={`fixed h-screen w-screen top-0 bg-black/50 left-0 ${showAddProduct ? 'flex justify-center items-center z-50' : 'hidden'}`}>
					<div className='w-1/4  bg-white relative flex items-center gap-8 p-8 text-black'>
						<button
							className='absolute top-5 right-5 cursor-pointer'
							onClick={() => setShowAddProduct(false)}
						>
							X
						</button>
						<form
							onSubmit={AddProduct}
							className='w-full space-y-4'
						>
							<label
								htmlFor='id'
								className='flex flex-col'
							>
								ID:
								<input
									type='number'
									id='id'
									name='id'
									className='w-full border  px-1 py-1'
								/>
							</label>
							<label
								htmlFor='title'
								className='flex flex-col'
							>
								Title:
								<input
									type='text'
									id='title'
									name='title'
									className='w-full border  px-1 py-1'
								/>
							</label>
							<label
								htmlFor='Price'
								className='flex flex-col'
							>
								Price:
								<input
									type='number'
									id='price'
									name='price'
									className='w-full border  px-1 py-1'
								/>
							</label>
							<label
								htmlFor='description'
								className='flex flex-col'
							>
								Description:
								<input
									type='text'
									id='description'
									name='description'
									className='w-full border  px-1 py-1'
								/>
							</label>
							<label
								htmlFor='category'
								className='flex flex-col'
							>
								Category:
								<input
									type='text'
									id='category'
									name='category'
									className='w-full border  px-1 py-1'
								/>
							</label>
							<label
								htmlFor='image'
								className='flex flex-col'
							>
								Image:
								<input
									type='text'
									id='image'
									name='image'
									className='w-full border border-grey px-1 py-1'
								/>
							</label>

							<button className='w-full bg-black text-white py-2 rounded-md cursor-pointer'>Submit</button>
						</form>
					</div>
				</div>
			</div>
			<div className='grid grid-cols-1 gap-4 lg:grid-cols-5'>
				{data?.map((product: Product) => {
					return (
						<div
							key={product.id}
							className='bg-white p-4 shadow rounded flex flex-col items-center justify-center cursor-pointer'
							onClick={() => setShowProduct(product.id.toString())}
						>
							<Image
								src={product.image}
								alt={product.title ?? ''}
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
