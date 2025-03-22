# Tanstack Query Setup

## Introduction
Tanstack Query adalah library yang digunakan untuk melakukan fetching, caching, dan syncing data secara efisien dalam aplikasi React.

## Setup
1. Instalasi Tanstack Query:
   ```sh
   npm install @tanstack/react-query
   ```

2. Buat instance QueryClient:
   ```js
   import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

   const queryClient = new QueryClient();

   function App() {
     return (
       <QueryClientProvider client={queryClient}>
         <Component />
       </QueryClientProvider>
     );
   }
   ```

3. Gunakan `useQuery` untuk fetching data:
   ```js
   import { useQuery } from '@tanstack/react-query';

   function Products({ showProduct }) {
     const { isLoading, data, isError } = useQuery({
		queryKey: ['products'],
		queryFn: async () => {
			const res = await fetch('https://fakestoreapi.com/products');
			return res.json();
		},
		enabled: true, 
	    });

     if (isLoading) return <p>Loading...</p>;
     if (error) return <p>Error fetching data</p>;
   
     return <div>{JSON.stringify(data)}</div>;
   }
   ```

## Query Keys
Query Keys digunakan untuk melakukan refetching dengan parameter tertentu. Contoh:

```js
queryKey: ['products', showProduct],
queryFn: async () => {
  const res = await fetch(`https://fakestoreapi.com/products/${showProduct}`);
  return res.json();
},
enabled: showProduct !== null,
```

Kode di atas akan otomatis melakukan refetch berdasarkan nilai `showProduct`.

