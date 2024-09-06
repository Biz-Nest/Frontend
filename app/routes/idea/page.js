'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';


export default function IdeaDetail() {
    const [idea, setIdea] = useState(null);
    const [relatedCat, setRelatedCat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [tokens, setTokens] = useState(null); // State to hold tokens
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id'); // Get the ID from query parameters

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

    const handleDelete = async () => {
        if (!tokens || !tokens.access) {
           
            return;
        }

        try {
            if (!id) throw new Error("ID not available for deletion");

            await fetcher(`${process.env.NEXT_PUBLIC_API_URL}/idea/${id}/`, tokens.access, "DELETE");
         
            router.push('/routes/Ideas'); // Redirect to another page after deletion
        } catch (error) {
            console.error('Error deleting idea:', error);
           
        }
    };

    const handleUpdate = async (updatedData) => {
        const token = tokens.access;
        try {
            const updatedIdea = await fetcher(`${process.env.NEXT_PUBLIC_REGISTER_URL}/idea/${id}/`, token, 'PATCH', updatedData);
            setIdea(updatedIdea);  // Update the idea state with the new data
            alert('Idea updated successfully');
            setShowUpdateForm(false);
        } catch (error) {
            console.error('Error updating idea:', error);
            alert('Failed to update idea');
        }
    };

    const UpdateIdeaForm = ({ idea, onUpdate }) => {
        const [formData, setFormData] = useState({
            name: idea.name || '',
            description: idea.description || '',
            category: idea.category || '',
            cost: idea.cost || '',
            location: idea.location || '',
            expenses: idea.expenses || '',
        });

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            await onUpdate(formData); // Ensure that the update is awaited
        };

        return (
            <form onSubmit={handleSubmit} className="p-4 bg-gray-200 rounded shadow-md">
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 mt-2 mb-4"
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 mt-2 mb-4"
                    />
                </div>
                <div>
                    <label>Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-2 mt-2 mb-4"
                    >
                        <option value="TECH">Technology</option>
                        <option value="FIN">Finance</option>
                        <option value="EDU">Education</option>
                        <option value="HEALTH">Healthcare</option>
                        <option value="AGR">Agriculture</option>
                    </select>
                </div>
                <div>
                    <label>Cost</label>
                    <input
                        type="number"
                        name="cost"
                        value={formData.cost}
                        onChange={handleChange}
                        className="w-full p-2 mt-2 mb-4"
                    />
                </div>
                <div>
                    <label>Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full p-2 mt-2 mb-4"
                    />
                </div>
                <div>
                    <label>Expenses</label>
                    <input
                        type="number"
                        name="expenses"
                        value={formData.expenses}
                        onChange={handleChange}
                        className="w-full p-2 mt-2 mb-4"
                    />
                </div>
                <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                    Update Idea
                </button>
            </form>
        );
    };

    useEffect(() => {
        // Load tokens from localStorage
        const storedTokens = JSON.parse(localStorage.getItem('tokens'));
        setTokens(storedTokens);

        const fetchIdea = async () => {
            if (!id || !storedTokens || !storedTokens.access) return;

            try {
                const data = await fetcher(`${process.env.NEXT_PUBLIC_API_URL}/idea/${id}/`, storedTokens.access);
                setIdea(data);

                const relatedData = await fetcher(`${process.env.NEXT_PUBLIC_API_URL}/idea/`, storedTokens.access);
                const filteredRelated = relatedData
                    .filter(currentIdea => currentIdea.category === data.category && currentIdea.id !== data.id);

                setRelatedCat(filteredRelated.slice(0, 3));
                
            } catch (error) {
                console.error('Error fetching idea:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchIdea();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }
    if (!idea) {
        return <div>Idea not found.</div>;
    }

    return (
        <div>
            <div className="flex overflow-hidden bg-white shadow cursor-pointer rounded-xl hover:shadow-md">
                {/* Left Section */}
                <div className="flex flex-col justify-between flex-1 p-8 text-text1">
                    <p className="text-[22px] font-bold text-gray-900">Name: {idea.name}</p>
                    <p>Description: {idea.description}</p>
                    <p>Category: {idea.category}</p>
                    <p>Cost: {idea.cost}</p>
                    <p>Location: {idea.location}</p>
                    <p>Expenses: {idea.expenses}</p>
                </div>

                {/* Right Section */}
                {tokens && tokens.user && tokens.user.id === idea.owner ? (
                    <>
                        <button
                            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                            onClick={async () => {
                                const token = tokens.access || '';
                                try {
                                    await fetch(`${process.env.NEXT_PUBLIC_REGISTER_URL}/idea/${id}/`, {
                                        method: 'DELETE',
                                        headers: {
                                            "Authorization": `Bearer ${token}`,
                                            "Content-Type": "application/json",
                                        },
                                    });
                                   alert('Deleted ')
                                    router.push('/routes/Ideas/');
                                } catch (error) {
                                    console.error('Error deleting idea:', error);
                                    
                                }
                            }}
                        >
                            Delete Idea
                        </button>
                        <button
                            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
                            onClick={() => {
                                setShowUpdateForm(true);
                                
                            }}
                        >
                            Update Idea
                        </button>
                    </>
                ) : null}
            </div>
            {/* Related Ideas Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold">Related Ideas</h2>
                <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
                    {relatedCat.map((relatedIdea, index) => (
                        <div key={index} className="p-4 border rounded-lg shadow">
                            <p><strong>Name:</strong> {relatedIdea.name}</p>
                            <p><strong>id field for test:</strong> {relatedIdea.id}</p>
                            <p><strong>Description:</strong> {relatedIdea.description}</p>
                            <p><strong>Category:</strong> {relatedIdea.category}</p>
                            <p><strong>Owner:</strong> {relatedIdea.owner}</p>
                            <p><strong>Cost:</strong> ${relatedIdea.cost}</p>
                            <p><strong>Location:</strong> {relatedIdea.location}</p>
                            <p><strong>Expenses:</strong> ${relatedIdea.expenses}</p>
                            <p><strong>Date:</strong> {relatedIdea.date}</p>
                        </div>
                    ))}
                </div>
            </div>
            {/* Update Idea Form */}
            {showUpdateForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
                    <div className="p-6 bg-white rounded-lg shadow-lg">
                        <UpdateIdeaForm idea={idea} onUpdate={handleUpdate} />
                    </div>
                </div>
            )}
        </div>
    );
}
