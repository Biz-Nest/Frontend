'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';

export default function IdeaDetail() {
    const [idea, setIdea] = useState(null);
    const [relatedCat, setRelatedCat] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { id } = router.query || { id: '2' };

    const fetcher = async (url, token, method = 'GET', body = null) => {
        const options = {
            method: method,
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
            body: method === 'DELETE' || method === 'GET' ? null : JSON.stringify(body),
        };

        const res = await fetch(url, options);

        if (!res.ok) {
            const error = await res.text(); // Retrieve error message if available
            return Promise.reject(error || 'Failed to fetch');
        }

        return res.json();
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('tokens') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI1MjQ0NjI5LCJpYXQiOjE3MjUyNDQzMjksImp0aSI6IjM5NTcxYzE3MTU2MjQ1NTE5N2Y5MjIzZjNiMzRkYWI0IiwidXNlcl9pZCI6Mn0.riGPvDuOXjp2LwQ-FqS4JT21nMw7RU8Kx1gNczX9C2w';
        try {
            console.log(id, "id befroe deleting");
            
            await fetcher(`http://127.0.0.1:8000/idea/${id}/`,{
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI1MjQ1NDkyLCJpYXQiOjE3MjUyNDUxOTIsImp0aSI6IjE4ZWNjZGFiNDk3NTQwY2I4YmFlZTU3YmExZjkyNTI3IiwidXNlcl9pZCI6Mn0.Ek_fxpucsVpm_T7U6c4tK0MdaeUjD_HED0iQr08nva4`,
                    'Content-Type': 'application/json',
                }});
            alert('Idea deleted successfully');
            // router.push('/'); // Redirect to home or another page after deletion
        } catch (error) {
            console.error('Error deleting idea:', error);
            alert('Failed to delete idea');
        }
    };

    useEffect(() => {
        const fetchIdea = async () => {
            const token = localStorage.getItem('tokens') || 'your-default-token';

            try {
                // Fetch the main idea
                const data = await fetcher(`http://127.0.0.1:8000/idea/${id}/`, token);
                setIdea(data);

                // Fetch related ideas
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
    }, [router]);

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
                    <p className="text-[22px] font-bold text-gray-800"><strong>Idea Details:</strong></p>
                    <div className="mb-8">
                        <div className="text-sm text-primary mt-4 flex items-center">
                            <span className="font-bold tracking-wide text-lg text-red-400">Name: {idea.name}</span>
                        </div>
                        <div className="text-lg text-text2 tracking-wider mt-4 space-y-2">
                            <p><strong>Category:</strong> {idea.category}</p>
                            <p><strong>id field for test:</strong> {idea.id}</p>
                            <p><strong>Owner:</strong> {idea.owner}</p>
                            <p><strong>Cost:</strong> ${idea.cost}</p>
                            <p><strong>Location:</strong> {idea.location}</p>
                            <p><strong>Expenses:</strong> ${idea.expenses}</p>
                            <p><strong>Date:</strong> {idea.date}</p>
                        </div>
                        <div className="mt-4">
                            <button 
                                onClick={handleDelete} 
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Delete Idea
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-1/2 p-4">
                    <img src={idea.image || "https://source.unsplash.com/1600x900/?nature,water"} className="rounded-xl object-cover w-full h-full" />
                </div>
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
            <Footer />
        </div>
    );
}
