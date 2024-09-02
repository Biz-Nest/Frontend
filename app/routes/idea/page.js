'use client';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';
import { AuthContext } from '@/app/context/Auth';

export default function IdeaDetail() {
    const [idea, setIdea] = useState(null);
    const [relatedCat, setRelatedCat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpdateForm, setShowUpdateForm] = useState(false); // State to manage form visibility
    const router = useRouter();
    const { id } = router.query || { id: "7" };
    const { tokens } = useContext(AuthContext)

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
        const token = /*tokens.access ||*/ 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI1Mjg3OTc2LCJpYXQiOjE3MjUyODc2NzYsImp0aSI6ImRkZmYyZmQwYjliMDRiNGY4MzkzMTNkNGU3ODMwMzRhIiwidXNlcl9pZCI6Mn0.VDVfVjlbtjBZqNV5m7v-DeggN5m7GsXt-jebqLhurFA';
        try {
            if (!id) throw new Error("ID not available for deletion");

            await fetcher(`http://127.0.0.1:8000/idea/${id}/`, token, "DELETE");
            alert('Idea deleted successfully');
            router.push('/'); // Redirect after deletion
        } catch (error) {
            console.error('Error deleting idea:', error);
            alert('Failed to delete idea');
        }
    };

    const handleUpdate = async (updatedData) => {
        const token = /*tokens.access ||*/ 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI1Mjg3OTc2LCJpYXQiOjE3MjUyODc2NzYsImp0aSI6ImRkZmYyZmQwYjliMDRiNGY4MzkzMTNkNGU3ODMwMzRhIiwidXNlcl9pZCI6Mn0.VDVfVjlbtjBZqNV5m7v-DeggN5m7GsXt-jebqLhurFA';
        try {
            await fetcher(`http://127.0.0.1:8000/idea/${id}/`, token, 'PATCH', updatedData);
            alert('Idea updated successfully');
            setShowUpdateForm(false); // Hide the form after successful update
            mutate(`http://127.0.0.1:8000/idea/${id}/`); // Revalidate the idea data
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
            onUpdate(formData);
        };

        return (
            <form onSubmit={handleSubmit} className="bg-gray-200 p-4 rounded shadow-md">
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
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Update Idea
                </button>
            </form>
        );
    };

    useEffect(() => {
        const fetchIdea = async () => {
            if (!id) return;

            const token = /*tokens.access ||*/ 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI1Mjg5MjEyLCJpYXQiOjE3MjUyODg5MTIsImp0aSI6ImJmZTgyNzdjMjI1MjQ2MmQ4MzNlYzBhMmNkZWEwMTEwIiwidXNlcl9pZCI6Mn0.rJWn9juI2CA5qTBdGScwSYCS2HtDvxy7jLyB2BplfjY';

            try {
                const data = await fetcher(`http://127.0.0.1:8000/idea/${id}/`, token);
                setIdea(data);

                const relatedData = await fetcher('http://127.0.0.1:8000/idea/', token);
                const filteredRelated = relatedData
                    .filter(currentIdea => currentIdea.category === data.category && currentIdea.id !== data.id);

                setRelatedCat(filteredRelated.slice(0, 3));

                // Trigger revalidation of the idea data
                mutate(`http://127.0.0.1:8000/idea/${id}/`);
            } catch (error) {
                console.error('Error fetching idea:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchIdea();
    }, [id]); // Ensure the effect depends on the `id`

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!idea) {
        return <div>Idea not found.</div>;
    }

    return (
        <div>
            <Header />
            <div className="rounded-xl overflow-hidden flex shadow hover:shadow-md bg-white cursor-pointer">
                {/* Left Section */}
                <div className="flex-1 p-8 text-text1 flex flex-col justify-between">
                    <p className="text-[22px] font-bold text-gray-900">Name: {idea.name}</p>
                    <p>Description: {idea.description}</p>
                    <p>Category: {idea.category}</p>
                    <p>Cost: {idea.cost}</p>
                    <p>Location: {idea.location}</p>
                    <p>Expenses: {idea.expenses}</p>

                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={handleDelete}
                    >
                        Delete Idea
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
                        onClick={() => setShowUpdateForm(true)} // Show the form when clicked
                    >
                        Update Idea
                    </button>
                </div>

                {/* Related Ideas Section */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold">Related Ideas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
                </div>

                {/* Show Update Form */}
                {showUpdateForm && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                        <UpdateIdeaForm idea={idea} onUpdate={handleUpdate} />
                    </div>
                )}

                <Footer />
            </div>
            );
}
