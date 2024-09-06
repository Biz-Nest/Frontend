"use client";
import { AuthContext } from '@/app/context/Auth';
import useResource from '@/app/hooks/useResource';
import React, { useContext, useState } from 'react';
import { useToast } from '@chakra-ui/react'; // Import useToast
import { useRouter } from 'next/navigation';

function AddIdea() {
    const router = useRouter()
    const { tokens } = useContext(AuthContext);
    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/idea/`;
    const { createResource } = useResource(baseUrl);
    const toast = useToast(); // Initialize toast
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'TECH', // Default value
        cost: '',
        location: '',
        expenses: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const data = {
            owner: tokens.user.id,
            name: formData.name,
            description: formData.description,
            category: formData.category,
            cost: formData.cost,
            location: formData.location,
            expenses: formData.expenses,
        };
    
        try {
            await createResource(data);

            // Show toast notification
            toast({
                title: "Idea added.",
                description: "Your idea has been successfully added.",
                status: "success",
                duration: 2000,
                isClosable: true,
            });

            // Clear form after submission
            setFormData({
                name: '',
                description: '',
                category: 'TECH',
                cost: '',
                location: '',
                expenses: ''
            });
            router.push('/routes/Ideas/')

        } catch (error) {
            // Show error toast in case of failure
            toast({
                title: "Error adding idea.",
                description: "There was an issue adding your idea.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    };

    if (!tokens) {
        toast({
            title: "Error: Something Went Wrong ",
            description: "Please log in to add a new product.",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "bottom",
        });
    }

    return (
        <div className="flex items-center justify-center min-h-screen dark:bg-gray-800">
            <div className="flex flex-col items-stretch w-full max-w-4xl bg-white md:rounded-[90px] overflow-hidden shadow-lg md:flex-row border-[1px] border-[solid] border-[#c1c8e4]">
                {/* Left Column */}
                <div className="flex flex-col justify-center w-full p-8 md:w-1/2 bg-[linear-gradient(to_right,_#6190e8,_#83a0d0)] dark:!bg-[radial-gradient(circle,_rgba(24,_32,_45,_1)_20%,_rgba(10,_15,_20,_1)_80%)]">
                    <h1 className="text-white mb-2 text-5xl font-light text-center md:text-left !mb-[15px]">
                        Add New Idea
                    </h1>
                    <p className="text-white text-xl font-semibold text-center md:text-left">
                        Lets make something cool
                    </p>
                    <h2 className="text-white text-xl font-semibold text-center md:text-left">
                        Get started by adding your idea
                    </h2>
                </div>

                {/* Right Column with Form */}
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
                                placeholder="Idea Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
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
                                placeholder="Idea Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="category">
                                Category
                            </label>
                            <select
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="TECH">Tech</option>
                                <option value="FIN">Finance</option>
                                <option value="EDU">Education</option>
                                <option value="HEALTH">Health</option>
                                <option value="AGR">Agriculture</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="cost">
                                Cost
                            </label>
                            <input
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                id="cost"
                                type="number"
                                placeholder="Estimated Cost"
                                name="cost"
                                value={formData.cost}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="location">
                                Location
                            </label>
                            <input
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                id="location"
                                type="text"
                                placeholder="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="expenses">
                                Expenses
                            </label>
                            <input
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                id="expenses"
                                type="number"
                                placeholder="Estimated Expenses"
                                name="expenses"
                                value={formData.expenses}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex items-center justify-center">
                            <button
                                className="w-full px-4 py-2 font-semibold text-white rounded-[90px] bg-[linear-gradient(to_right,_#6190e8,_#83a0d0)] hover:hover:bg-[linear-gradient(_135deg,_#b2c3f5_0%,_#c0e0f5_25%,_#a8d5f9_50%,_#d1d9f1_75%,_#c3b8f1_100%)] focus:outline-none focus:ring focus:ring-blue-200"
                                type="submit"
                            >
                                Add Idea
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddIdea;
