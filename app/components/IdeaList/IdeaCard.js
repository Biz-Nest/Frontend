import React, { useContext, useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { AuthContext } from '@/app/context/Auth';
import { useRouter } from 'next/navigation';

// Fetcher function for SWR
const fetcher = (url, token) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : undefined,
    },
  }).then(res => res.json());

const IdeaCard = ({ idea }) => {
    const { tokens } = useContext(AuthContext);
    const [isAnimating, setIsAnimating] = useState(false);
    const [liked, setLiked] = useState(false); // Track if idea is liked
    const router = useRouter(); // Initialize useRouter

    // Fetch likes without token
    const { data: likes, error } = useSWR(
        'http://127.0.0.1:8000/like/', // No token needed here
        (url) => fetcher(url, null) // Pass null for token
    );

    // Determine if the idea is liked
    useEffect(() => {
        if (likes) {
            const userLiked = likes.some(like => like.object_id === idea.id);
            setLiked(userLiked);
        }
    }, [likes, idea.id]);

    const likeIdea = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/like/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokens?.access}`,
                },
                body: JSON.stringify({
                    user: idea.owner,  // assuming idea.owner is the user ID
                    content_type: 9,  // replace with the actual content type ID for Idea
                    object_id: idea.id,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to like the idea');
            }

            // Set liked to true to hide the button
            setLiked(true);

            // Trigger animation
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 300); // Reset animation after 300ms

            // Revalidate the SWR cache for likes
            mutate('http://127.0.0.1:8000/like/');

        } catch (error) {
            console.error('Error liking idea:', error);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 m-4 max-w-sm relative">
            <h3 className="text-xl font-bold mb-2">{idea.name}</h3>
            <p className="text-gray-600 mb-2"><strong>Category:</strong> {idea.category}</p>
            <p className="text-gray-600 mb-2"><strong>Cost:</strong> ${idea.cost}</p>
            <p className="text-gray-600 mb-2"><strong>Location:</strong> {idea.location}</p>
            {!liked && tokens && (
                <button 
                    onClick={likeIdea} 
                    className={`absolute top-2 right-2 text-red-500 transform transition-transform ${isAnimating ? 'scale-125' : ''}`}
                >
                    ❤️
                </button>
            )}
            <a
                onClick={() => router.push(`/routes/idea?id=${idea.id}`)} // Use query parameter to navigate
                className="text-blue-500 hover:underline cursor-pointer"
            >
                More Details
            </a>
        </div>
    );
};

export default IdeaCard;
