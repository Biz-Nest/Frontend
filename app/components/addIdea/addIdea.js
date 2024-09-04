"use client";
import { AuthContext } from '@/app/context/Auth';
import useResource from '@/app/hooks/useResource';
import React, { useContext, useState } from 'react';

function AddIdea() {
    const { tokens } = useContext(AuthContext);
    const baseUrl = 'http://localhost:8000/idea/';
    const { createResource } = useResource(baseUrl);
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

    const handleSubmit = (e) => {
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
    
        createResource(data);
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
                            Please log in to add a new idea.
                        </p>
                    </div>
                </div>
            </div>
        );
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