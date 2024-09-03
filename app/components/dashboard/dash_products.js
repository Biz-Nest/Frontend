"use client";
import useSWR from "swr";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashProducts({ tokens }) {
    const fetcher = (url) => fetch(url).then((response) => response.json());

    // Fetch user's stores
    const { data: storesData, error: storesError } = useSWR("http://localhost:8000/store/", fetcher);

    // Fetch all products
    const { data: productsData, error: productsError, mutate } = useSWR("http://localhost:8000/product/", fetcher);

    const router = useRouter();

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [file, setFile] = useState(null);

    // Handle loading and error states for stores
    if (!storesData) return <div className="p-8 bg-gray-100">Loading stores...</div>;
    if (storesError) return <div className="p-8 bg-gray-100">Error loading stores.</div>;

    // Handle loading and error states for products
    if (!productsData) return <div className="p-8 bg-gray-100">Loading products...</div>;
    if (productsError) return <div className="p-8 bg-gray-100">Error loading products.</div>;

    // Filter stores based on the user's ID
    const userStoreIds = storesData.filter(store => store.owner === tokens.user.id).map(store => store.id);

    // Filter products based on the user's store IDs
    let userProducts = productsData.filter(product => userStoreIds.includes(product.store));

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedProduct(null);
        setFile(null);
    };

    const handleDelete = async () => {
        if (!selectedProduct) return;
        try {
            await fetch(`http://localhost:8000/product/${selectedProduct.id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${tokens.access}`,
                },
            });

            // Update the product list after deletion
            userProducts = userProducts.filter(product => product.id !== selectedProduct.id);
            mutate(userProducts, false); // Optimistically update the state

            handleClosePopup();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleUpdate = async () => {
        if (!selectedProduct) return;
        try {
            const formData = new FormData();
            formData.append('name', selectedProduct.name);
            formData.append('price', selectedProduct.price);
            formData.append('description', selectedProduct.description);
            if (file) formData.append('product_image', file);

            await fetch(`http://localhost:8000/product/${selectedProduct.id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${tokens.access}`,
                },
                body: formData,
            });

            // Update the product list after update
            userProducts = userProducts.map(product =>
                product.id === selectedProduct.id ? { ...selectedProduct } : product
            );
            mutate(userProducts, false); // Optimistically update the state

            handleClosePopup();
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    if (userProducts.length === 0) {
        return (
            <div className="container">
                <div className="p-8 bg-gray-100 flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">You don&apos;t have any products yet.</h1>
                    <button
                        onClick={() => router.push('/create-product')}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
                    >
                        Add Product
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="p-8 bg-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Products</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 cursor-pointer hover:bg-gray-50 transition duration-300"
                            onClick={() => handleProductClick(product)}
                        >
                            {product.product_image && (
                                <Image
                                    width={300}
                                    height={200}
                                    src={product.product_image}
                                    alt={`${product.name} image`}
                                    className="w-full h-48 object-cover mb-4"
                                />
                            )}
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
                            <p className="text-gray-600 mb-2">Price: ${parseFloat(product.price).toFixed(2)}</p>
                            <p className="text-gray-600 mb-4">Description: {product.description || "No description available"}</p>
                        </div>
                    ))}
                </div>
            </div>

            {isPopupOpen && selectedProduct && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
                        <button
                            onClick={handleClosePopup}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition duration-300"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Product</h2>
                        <div className="mb-4">
                            {selectedProduct.product_image && (
                                <Image
                                    width={300}
                                    height={200}
                                    src={selectedProduct.product_image}
                                    alt={`${selectedProduct.name} image`}
                                    className="w-full h-48 object-cover mb-4"
                                />
                            )}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700">Name:</label>
                                    <input
                                        type="text"
                                        value={selectedProduct.name}
                                        onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Price:</label>
                                    <input
                                        type="number"
                                        value={selectedProduct.price}
                                        onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Description:</label>
                                    <textarea
                                        value={selectedProduct.description}
                                        onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Product Image:</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className="mt-1 block w-full"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
                            >
                                Delete
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
