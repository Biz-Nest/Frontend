import { AuthContext } from "@/app/context/Auth";
import { useContext, useEffect, useState } from "react";
import { Spinner, useToast } from '@chakra-ui/react';
import Link from "next/link";

export default function Cart_List() {
    const { tokens } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const toast = useToast();

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

    const handleDelete = async (id) => {
        toast({
            title: "Confirm Deletion",
            description: "Are you sure you want to remove this item from your cart?",
            status: "warning",
            duration: null, // Keep the toast open until user interacts
            isClosable: true,
            position: "top-right",
            render: () => (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '16px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                        maxWidth: '400px',
                    }}
                >
                    <div style={{ flex: 1 }}>
                        <h2 className="text-lg font-semibold text-gray-800">Confirm Deletion</h2>
                        <p className="text-gray-600">Are you sure you want to remove this item from your cart?</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={async () => {
                                try {
                                    // Immediately remove the item from the UI
                                    setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
                                    // Close the toast
                                    toast.closeAll();

                                    // Proceed with deletion on the server
                                    await fetcher(`${process.env.NEXT_PUBLIC_API_URL}/cart/${id}`, tokens.access, 'DELETE');
                                } catch (error) {
                                    console.error('Error:', error);
                                    // Optionally re-add the product if the deletion fails
                                    // setProducts(prevProducts => [...prevProducts, products.find(product => product.id === id)]);
                                }
                            }}
                            className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-4 py-2"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => toast.closeAll()} // Close the toast
                            className="text-white bg-gray-600 hover:bg-gray-700 font-medium rounded-lg text-sm px-4 py-2"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ),
        });
    };

    useEffect(() => {
        const fetchStore = async () => {
            setLoading(true);
            try {
                const data = await fetcher(`${process.env.NEXT_PUBLIC_API_URL}/cart/`, tokens.access);
                const filteredRelated = data.filter(currentProduct => currentProduct.user === tokens.user.id);
                setProducts(filteredRelated);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStore();
    }, [tokens]);

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
                        width: '100px',
                        height: '100px',
                        borderWidth: '12px',
                    }}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-4 p-4">
            {products.map(product => (
                <div key={product.id} className="flex-shrink-0 w-80 bg-teal-500 rounded-lg shadow-lg relative">
                    <div className="relative flex items-center">
                        <Link href={`/routes/productDetails?id=${product.product.id}`}> 
                        <img
                            src={process.env.NEXT_PUBLIC_API_URL + product.product.product_image}
                            alt={product.product.name}
                            className="w-48 h-48 object-cover rounded-t-lg"
                        />
                        </Link>
                        <div className="absolute top-0 left-56 p-4 w-1/2">
                            <h2 className="text-white text-xl font-semibold mb-2">{product.product.name}</h2>
                            <p className="text-white text-lg font-bold">${product.product.price}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="absolute bottom-4 right-4 bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white font-medium rounded-lg text-sm px-5 py-2.5 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300"
                        onClick={() => handleDelete(product.id)}
                    >
                        Remove From Cart
                    </button>
                </div>
            ))}
        </div>
    );
}
