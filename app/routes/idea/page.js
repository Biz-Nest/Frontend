'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spinner } from '@chakra-ui/react';
import "./page.css";
import Chat from '@/app/components/chat/chat';

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

                setRelatedCat(filteredRelated);
                
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
        <div className="marketgab-details dark:bg-gray-800">
        <div className="container">
          <div className="content dark:text-white">
            {/* Details */}
            <section className="full-details">
              <h2 className="">Full Details</h2>

              <div className="info">
                <div className="row">
                  <span>Name</span>
                  <p>{idea.name || "No Title Available"}</p>
                </div>
  
                <div className="row">
                  <span>Category</span>
                  <p>
                    {idea.category || "Not Available!"}
                  </p>
                </div>

                <div className="row">
                  <span>Cost</span>
                  <p>
                    {idea.cost || "Not Available!"}
                  </p>
                </div>
  
                <div className="row">
                  <span>Location</span>
                  <p>{idea.location || "No Location Information Available"}</p>
                </div>

                <div className="row">
                  <span>Expenses</span>
                  <p>{idea.expenses || "No Location Information Available"}</p>
                </div>
              </div>
  
              <div className="social">
                <h2>Contact Owner</h2>
                <div className="social-links">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ri-twitter-fill twitter dark:bg-white"></i>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ri-facebook-circle-fill facebook dark:bg-white"></i>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ri-linkedin-box-fill linkedin dark:bg-white"></i>
                </a>
                </div>
              </div>
            </section>
  
            {/* Nearby Reports Section */}
            <section className="nearby-markets">
              <div className="description">
                <h2>Description</h2>
                <p>{ idea.description || "Not Found!"}</p>
              </div>
  
              <div className="nearby-section">
                <h2 className="">Nearby Reports</h2>
                {relatedCat.length === 0 ? (
                  <div>No nearby reports available</div>
                ) : (
                  <div className="nearby-reports">
                    {relatedCat.map((relatedIdea, index) => (
                      <div
                        key={index}
                        className="report dark:text-[#333]"
                      >
                            <p><strong>Name:</strong> <span>{relatedIdea.name}</span></p>
                            <p><strong>Cost:</strong> <span>${relatedIdea.cost}</span></p>
                            <p><strong>Location:</strong> <span>{relatedIdea.location}</span></p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
        <Chat />
      </div>
    );
}