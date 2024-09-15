'use client';
import { Suspense } from 'react';
import { useEffect, useState, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthContext } from '@/app/context/Auth';
import { Spinner, useToast } from '@chakra-ui/react';
import Image from 'next/image';

function StoreDetailComponent() {
    const searchParams = useSearchParams();
    const identifier = searchParams.get('id') || '10';
    const { tokens } = useContext(AuthContext);
    const [store, setStore] = useState({});
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const toast = useToast();

    const fetcher = async (url, token, method = 'GET', body = null) => {
        const options = {
            method: method,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : null,
        };
        const res = await fetch(url, options);
        if (!res.ok) {
            const error = await res.text();
            return Promise.reject(error || 'Failed to fetch');
        }
        return res.json();
    };

    useEffect(() => {
        if (!tokens || !tokens.access) {
            toast({
                title: 'Authentication Required',
                description: 'Please log in to view store details.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
            return;
        }

        setLoading(true);
        const fetchStore = async () => {
            try {
                const data = await fetcher(`${process.env.NEXT_PUBLIC_API_URL}/store/${identifier}/`, tokens.access);
                setStore(data);
                const relatedData = await fetcher(`${process.env.NEXT_PUBLIC_API_URL}/product/`, tokens.access);
                const filteredRelated = relatedData.filter(
                    (currentProduct) => currentProduct.store == identifier
                );
                setProducts(filteredRelated);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchStore();
    }, [identifier, tokens, toast]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spinner
                    color="red.500"
                    size="xl"
                    style={{
                        width: '100px',
                        height: '100px',
                        borderWidth: '12px',
                    }}
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div>
            {/* Store details */}
            <section>
                <div className="relative pt-20 pb-20 pl-[15px] pr-[15px] bg-gradient-to-r from-purple-600 to-blue-600 text-white overflow-hidden">
                    <div className="absolute inset-0">
                        <Image
                            width={1000}
                            height={1000}
                            src={store.logo}
                            alt="Store Logo"
                            className="object-cover object-center w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                    </div>
                    <div className="relative flex flex-col items-center justify-center h-full text-center">
                        <h1 className="mb-4 text-5xl font-bold leading-tight">
                            Welcome to Our Awesome {store.name} store
                        </h1>
                        <p className="text-lg text-gray-300 mb-8 max-w-[1000px] backdrop-filter backdrop-blur-[10px] rounded-[15px] p-[10px]">
                            {store.description}
                        </p>
                        <a
                            href="#Projects"
                            className="px-6 py-2 text-lg font-semibold text-gray-900 transition duration-300 ease-in-out transform bg-yellow-400 rounded-full hover:bg-yellow-300 hover:scale-105 hover:shadow-lg"
                        >
                            Get Started
                        </a>
                    </div>
                </div>
            </section>

            {/* Products list */}
            <section
                id="Projects"
                className="grid justify-center grid-cols-1 mx-auto mt-10 mb-5 w-fit lg:grid-cols-3 md:grid-cols-2 justify-items-center gap-y-20 gap-x-14"
            >
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="product-card cursor-pointer mb-10 mt-10 w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl dark:!bg-[radial-gradient(circle,_rgba(24,_32,_45,_1)_20%,_rgba(10,_15,_20,_1)_80%)]"
                    >
                        <a onClick={() => router.push(`/routes/productDetails?id=${product.id}`)}>
                            <Image
                                src={product.product_image}
                                alt="Product"
                                className="object-cover h-80 w-72 rounded-t-xl"
                                width={1000}
                                height={1000}
                            />
                            <div className="px-4 py-3 w-72 dark:text-white">
                                <span className="mr-3 text-xs text-gray-400 uppercase dark:text-white">
                                    {store.name}
                                </span>
                                <p className="block text-lg font-bold text-black capitalize truncate dark:text-white">
                                    {product.name}
                                </p>
                                <div className="flex items-center">
                                    <p className="my-3 text-lg font-semibold text-black cursor-auto dark:text-white">
                                        ${product.price}
                                    </p>
                                    <del>
                                        <p className="text-sm text-gray-600 cursor-auto ml-2 dark:text-[#ddd]">
                                            ${(parseFloat(product.price) * 1.3).toFixed(2)}
                                        </p>
                                    </del>
                                    <div className="ml-auto">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            fill="currentColor"
                                            className="bi bi-bag-plus"
                                            viewBox="0 0 16 16"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"
                                            />
                                            <path
                                                d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default function StoreDetail() {
    return (
        <Suspense fallback={<div>Loading store details...</div>}>
            <StoreDetailComponent />
        </Suspense>
    );
}
