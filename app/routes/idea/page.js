'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spinner } from '@chakra-ui/react';


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
    
        </div>
    );
}
