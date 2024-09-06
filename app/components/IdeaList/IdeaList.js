import React, { useContext } from 'react';
import useSWR from 'swr';
import { AuthContext } from '@/app/context/Auth';
import IdeaCard from './IdeaCard';

// Fetcher function for SWR (without authorization)
const fetcher = (url) =>
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json());

const IdeaList = () => {
    const { tokens } = useContext(AuthContext);

    // Use SWR to fetch ideas
    const { data: ideas, error } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/idea/`,  // No need for tokens here
        fetcher
    );

    if (error) return <div>Error loading ideas.</div>;
    if (!ideas) return <div>Loading...</div>;

    return (
        <div className='container'>
            <div className="idea-list container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ideas.map((idea) => (
                        <IdeaCard key={idea.id} idea={idea} />
                    ))}
                </div>
            </div>
        </div>

    );
};

export default IdeaList;
