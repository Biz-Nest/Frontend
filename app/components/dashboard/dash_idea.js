"use client";
import useSWR from "swr";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashIdea({ tokens }) {
    // Define fetcher function for SWR
    const fetcher = (url) => fetch(url).then((response) => response.json());

    // Use SWR to fetch ideas and likes data
    const { data: ideasData, error: ideasError, mutate: mutateIdeas } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/idea/`, fetcher);
    const { data: likesData, error: likesError } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/like/`, fetcher);

    const router = useRouter(); // Initialize useRouter

    const [selectedIdea, setSelectedIdea] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [file, setFile] = useState(null);

    if (!ideasData || !likesData) return <div className="p-8 bg-gray-100">Loading...</div>;
    if (ideasError || likesError) return <div className="p-8 bg-gray-100">Error loading data.</div>;

    const userIdeas = ideasData.filter(idea => idea.owner === tokens.user.id);

    // Count likes for each idea
    const getLikesCount = (ideaId) => {
        return likesData.filter(like => like.object_id === ideaId).length;
    };

    const handleIdeaClick = (idea) => {
        setSelectedIdea(idea);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedIdea(null);
        setFile(null);
    };

    const handleDelete = async () => {
        if (!selectedIdea) return;
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/idea/${selectedIdea.id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${tokens.access}`,
                },
            });

            // Update the idea list after deletion
            mutateIdeas((ideas) => ideas.filter((idea) => idea.id !== selectedIdea.id), false);

            handleClosePopup();
        } catch (error) {
            console.error('Error deleting idea:', error);
        }
    };

    const handleUpdate = async () => {
        if (!selectedIdea) return;
        try {
            const formData = new FormData();
            formData.append('name', selectedIdea.name);
            formData.append('description', selectedIdea.description);
            formData.append('category', selectedIdea.category);
            formData.append('cost', selectedIdea.cost);
            formData.append('location', selectedIdea.location);
            formData.append('expenses', selectedIdea.expenses);
            if (file) formData.append('idea_image', file);

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/idea/${selectedIdea.id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${tokens.access}`,
                },
                body: formData,
            });

            // Update the idea list after update
            mutateIdeas((ideas) => ideas.map((idea) => idea.id === selectedIdea.id ? { ...selectedIdea } : idea), false);

            handleClosePopup();
        } catch (error) {
            console.error('Error updating idea:', error);
        }
    };

    if (userIdeas.length === 0) {
        return (
            <div className="container">
                <div className="p-8 bg-gray-100 flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">You don&apos;t have any ideas yet.</h1>
                    <button
                        onClick={() => router.push('/routes/addIdea')}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
                    >
                        Add Idea
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="p-8 bg-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Ideas</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userIdeas.map((idea) => {
                        // Ensure cost and expenses are numbers
                        const cost = parseFloat(idea.cost) || 0;
                        const expenses = parseFloat(idea.expenses) || 0;
                        const likesCount = getLikesCount(idea.id); // Get likes count for the current idea

                        return (
                            <div
                                key={idea.id}
                                className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 cursor-pointer hover:bg-gray-50 transition duration-300"
                                onClick={() => handleIdeaClick(idea)}
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">{idea.name}</h2>
                                <p className="text-gray-600 mb-2">Description: {idea.description || "No description available"}</p>
                                <p className="text-gray-600 mb-2">Category: {idea.category || "Not specified"}</p>
                                <p className="text-gray-600 mb-2">Cost: ${cost.toFixed(2)}</p>
                                <p className="text-gray-600 mb-2">Location: {idea.location || "Not specified"}</p>
                                <p className="text-gray-600 mb-4">Expenses: ${expenses.toFixed(2)}</p>
                                <p className="text-gray-600 mb-2">Likes: {likesCount}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {isPopupOpen && selectedIdea && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
                        <button
                            onClick={handleClosePopup}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition duration-300"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Idea</h2>
                        <div className="mb-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700">Name:</label>
                                    <input
                                        type="text"
                                        value={selectedIdea.name}
                                        onChange={(e) => setSelectedIdea({ ...selectedIdea, name: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Description:</label>
                                    <textarea
                                        value={selectedIdea.description}
                                        onChange={(e) => setSelectedIdea({ ...selectedIdea, description: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Category:</label>
                                    <input
                                        type="text"
                                        value={selectedIdea.category}
                                        onChange={(e) => setSelectedIdea({ ...selectedIdea, category: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Cost:</label>
                                    <input
                                        type="number"
                                        value={selectedIdea.cost}
                                        onChange={(e) => setSelectedIdea({ ...selectedIdea, cost: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Location:</label>
                                    <input
                                        type="text"
                                        value={selectedIdea.location}
                                        onChange={(e) => setSelectedIdea({ ...selectedIdea, location: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Expenses:</label>
                                    <input
                                        type="number"
                                        value={selectedIdea.expenses}
                                        onChange={(e) => setSelectedIdea({ ...selectedIdea, expenses: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Idea Image:</label>
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
