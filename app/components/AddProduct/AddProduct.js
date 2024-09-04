"use client";
import { AuthContext } from '@/app/context/Auth';
import useResource from '@/app/hooks/useResource';
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react'; // Import useToast from Chakra UI

function AddProduct() {
    const { tokens } = useContext(AuthContext);
    const baseUrl = 'http://localhost:8000/product/';
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        store: ''
    });
    const [file, setFile] = useState(null);
    const [stores, setStores] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast(); // Initialize useToast

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await axios.get('http://localhost:8000/store/', {
                    headers: {
                        Authorization: `Bearer ${tokens.access}`,
                    },
                });
                const userStores = response.data.filter(store => store.owner === tokens.user.id);
                setStores(userStores);
            } catch (error) {
                console.error('Error fetching stores:', error);
            }
        };

        if (tokens) {
            fetchStores();
        }
    }, [tokens]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('description', formData.description);
        data.append('store', formData.store);
        if (file) {
            data.append('product_image', file);
        }

        try {
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${tokens.access}`,
                },
                body: data,
            });

            if (response.ok) {
                // Show success toast
                toast({
                    title: 'Product Added',
                    description: 'Your product has been added successfully.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                // Clear form fields
                setFormData({
                    name: '',
                    price: '',
                    description: '',
                    store: ''
                });
                setFile(null);
            } else {
                const errorData = await response.json();
                // Show error toast
                toast({
                    title: 'Error',
                    description: errorData.detail || 'Something went wrong.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error adding product:', error);
            // Show error toast
            toast({
                title: 'Error',
                description: 'An unexpected error occurred.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
            setFile(null);
        }
    };

    if (!tokens) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-pink-100">
                <div className="flex flex-col items-stretch w-full max-w-4xl bg-white rounded-lg shadow-lg md:flex-row">
                    <div className="flex flex-col justify-center w-full p-8 bg-blue-200 rounded-l-lg md:w-1/2">
                        <h1 className="mb-2 text-3xl font-bold text-center text-gray-800 md:text-left">
                            Error: No Token Found
                        </h1>
                        <p className="mb-6 text-center text-gray-600 md:text-left">
                            Please log in to add a new product.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-pink-100">
            <div className="flex flex-col items-stretch w-full max-w-4xl bg-white rounded-lg shadow-lg md:flex-row">
                <div className="flex flex-col justify-center w-full p-8 bg-blue-200 rounded-l-lg md:w-1/2">
                    <h1 className="mb-2 text-3xl font-bold text-center text-gray-800 md:text-left">
                        Add New Product
                    </h1>
                    <p className="mb-6 text-center text-gray-600 md:text-left">
                        Let's add your amazing product.
                    </p>
                    <h2 className="mb-4 text-xl font-semibold text-center text-gray-800 md:text-left">
                        Get started by filling out the form
                    </h2>
                </div>

                <div className="w-full p-8 md:w-1/2">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="name">
                                Name
                            </label>
                            <input
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                id="name"
                                type="text"
                                placeholder="Product Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="price">
                                Price
                            </label>
                            <input
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                id="price"
                                type="number"
                                placeholder="Product Price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="product_image">
                                Product Image
                            </label>
                            <input
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                id="product_image"
                                type="file"
                                name="product_image"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="description">
                                Description
                            </label>
                            <textarea
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                id="description"
                                placeholder="Product Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="store">
                                Store
                            </label>
                            <select
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                id="store"
                                name="store"
                                value={formData.store}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select Store</option>
                                {stores.map((store) => (
                                    <option key={store.id} value={store.id}>
                                        {store.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center justify-center">
                            <button
                                className={`w-full px-4 py-2 font-semibold text-black rounded-lg bg-gradient-to-r from-blue-100 to-pink-100 hover:from-pink-100 hover:to-blue-100 focus:outline-none focus:ring focus:ring-blue-200 ${
                                    isSubmitting ? "animate-bounce" : ""
                                }`}
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Add Product"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddProduct;
