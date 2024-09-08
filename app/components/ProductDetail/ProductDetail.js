'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { Spinner } from '@chakra-ui/react';

export default function ProductDetail() {
    const [tokens, setTokens] = useState(null);
    const [product, setProduct] = useState(null);
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const searchParams = useSearchParams();
    const [id, setId] = useState(null);

    useEffect(() => {
        const storedTokens = localStorage.getItem('tokens');
        if (storedTokens) {
            setTokens(JSON.parse(storedTokens));
        }
    }, []);

    useEffect(() => {
        const productId = searchParams.get('id');
        if (productId) {
            setId(productId);
        }
    }, [searchParams]);

    useEffect(() => {
        if (!id || !tokens) return;

        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokens.access}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Error ${response.status}: ${errorData.message || 'Failed to fetch product'}`);
                }

                const data = await response.json();
                setProduct(data);

                const storeResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokens.access}`,
                    },
                });

                if (!storeResponse.ok) {
                    const storeErrorData = await storeResponse.json();
                    throw new Error(`Error ${storeResponse.status}: ${storeErrorData.message || 'Failed to fetch stores'}`);
                }

                const storeData = await storeResponse.json();
                const matchedStore = storeData.find(store => store.id === data.store);
                setStore(matchedStore);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, tokens]);

    const handleAddToCart = async () => {
        if (!product || !tokens) return;

        try {
            // Fetch the user's cart to check if the product already exists
            const cartResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokens.access}`,
                },
            });

            if (!cartResponse.ok) {
                const errorData = await cartResponse.json();
                throw new Error(`Error ${cartResponse.status}: ${errorData.message || 'Failed to fetch cart'}`);
            }

            const cartData = await cartResponse.json();
            const existingCartItem = cartData.find(item => item.product.id === product.id);

            if (existingCartItem) {
                // If the product is already in the cart, update the quantity
                const updatedQuantity = existingCartItem.quantity + quantity;

                const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${existingCartItem.id}/`, {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokens.access}`,
                    },
                    body: JSON.stringify({
                        quantity: updatedQuantity,
                    }),
                });

                if (!updateResponse.ok) {
                    const errorData = await updateResponse.json();
                    throw new Error(`Error ${updateResponse.status}: ${errorData.message || 'Failed to update cart'}`);
                }

                toast.success('Product quantity updated in the cart successfully!');
            } else {
                // If the product is not in the cart, add a new entry
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokens.access}`,
                    },
                    body: JSON.stringify({
                        quantity: quantity,
                        user: tokens.user.id,
                        product: product.id,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Error ${response.status}: ${errorData.message || 'Failed to add to cart'}`);
                }

                toast.success('Product added to cart successfully!');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const incrementQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decrementQuantity = () => {
        setQuantity(prev => Math.max(prev - 1, 1));
    };

    if (loading) {
        return <div style={{
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
        </div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <Toaster />
            {product ? (
                <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                    <div className="md:w-1/2">
                        <Image
                            width={200}
                            height={200}
                            src={product.product_image}
                            alt={product.name}
                            className="w-full h-auto rounded-lg object-cover"
                        />
                    </div>
                    <div className="md:w-1/2 flex flex-col space-y-4">
                        {store && (
                            <div className="flex items-start space-x-4">
                                <div className="relative w-24 h-24">
                                    <Image
                                        src={store.logo}
                                        alt={store.name}
                                        className="w-full h-full rounded-full object-cover"
                                        width={96}
                                        height={96}
                                        priority
                                    />
                                </div>
                                <div className="flex flex-col justify-between">
                                    <h3 className="text-xl font-semibold mb-2">{store.name}</h3>
                                    {store.social_links && Object.keys(store.social_links).length > 0 && (
                                        <div className="flex flex-wrap space-x-2">
                                            {Object.entries(store.social_links).map(([platform, url]) => (
                                                <a
                                                    key={platform}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    {platform}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Product name: {product.name}</h2>
                            <p className="text-lg text-gray-700 mb-4">Description: {product.description}</p>
                            <p className="text-lg font-bold text-gray-900">Price: ${product.price}</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={decrementQuantity}
                                    className="px-3 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="w-16 p-2 border rounded-md text-center"
                                />
                                <button
                                    onClick={incrementQuantity}
                                    className="px-3 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300"
                                >
                                    +
                                </button>
                                <button
                                    onClick={handleAddToCart}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-4 8h14l4-8M7 13h2m-3 4h2m-3-4h2m7-4h-2M7 13h2m7-4h2m-2-4h2" />
                                    </svg>
                                    Add to Cart
                                </button>
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                                Total: ${quantity * product.price}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center">Product not found</div>
            )}
        </div>
    );
}