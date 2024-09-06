'use client';
import { useEffect, useState, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthContext } from '@/app/context/Auth';
import { Spinner, useToast } from '@chakra-ui/react'; // Import Spinner and useToast

export default function StoreDetail() {
    const searchParams = useSearchParams();
    const identifier = searchParams.get('id') || '10';
    const { tokens } = useContext(AuthContext);
    const [store, setStore] = useState({});
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const router = useRouter();
    const toast = useToast(); // Initialize toast

    const fetcher = async (url, token, method = 'GET', body = null) => {
        const options = {
            method: method,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
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
                title: "Authentication Required",
                description: "Please log in to view store details.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            setLoading(false); // Stop loading since there are no tokens
            return;
        }

        setLoading(true); // Set loading to true when starting fetch
        const fetchStore = async () => {
            try {
                const data = await fetcher(`${process.env.NEXT_PUBLIC_API_URL}/store/${identifier}/`, tokens.access);
                setStore(data);
                const relatedData = await fetcher(`${process.env.NEXT_PUBLIC_API_URL}/product/`, tokens.access);
                const filteredRelated = relatedData
                    .filter(currentProduct => currentProduct.store == identifier);
                setProducts(filteredRelated);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false); // Set loading to false after fetch completes
            }
        };
        fetchStore();
    }, [identifier, tokens, toast]); // Dependencies array includes `tokens` instead of `tokens.access`

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <Spinner
                    color='red.500'
                    size='xl'
                    style={{
                        width: '100px',  // Adjust size as needed
                        height: '100px', // Adjust size as needed
                        borderWidth: '12px', // Make the spinner thicker
                    }}
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div>
            <section>
                <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 h-screen text-white overflow-hidden">
                    <div className="absolute inset-0">
                        <img src={store.logo} alt="Store Logo" className="object-cover object-center w-full h-full" />
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                    </div>
                    <div className="relative flex flex-col justify-center items-center h-full text-center">
                        <h1 className="text-5xl font-bold leading-tight mb-4">Welcome to Our Awesome {store.name} store</h1>
                        <p className="text-lg text-gray-300 mb-8">{store.description}</p>
                        <a href="#Projects" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 py-2 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">Get Started</a>
                    </div>
                </div>
            </section>
            <section id="Projects" className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
                {products.map(product => (
                    <div key={product.id} className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
                        <a onClick={() => router.push(`/routes/productDetails?id=${product.id}`)}>
                            <img
                                src={product.product_image}
                                alt="Product"
                                className="h-80 w-72 object-cover rounded-t-xl"
                            />
                            <div className="px-4 py-3 w-72">
                                <span className="text-gray-400 mr-3 uppercase text-xs">{store.name}</span>
                                <p className="text-lg font-bold text-black truncate block capitalize">{product.name}</p>
                                <div className="flex items-center">
                                    <p className="text-lg font-semibold text-black cursor-auto my-3">${product.price}</p>
                                    <del>
                                        <p className="text-sm text-gray-600 cursor-auto ml-2">
                                            ${(parseFloat(product.price) * 1.3).toFixed(2)}
                                        </p>
                                    </del>
                                    <div className="ml-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-bag-plus" viewBox="0 0 16 16">
                                            <path fillRule="evenodd"
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
