'use client';
import { AuthContext } from "@/app/context/Auth";
import { useState, useEffect, useContext } from "react";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

function Liked() {
    const [ideaLike, setIdeaLike] = useState([]);
    const [marketGabLike, setMarketGabLike] = useState([]);
    const [loading, setLoading] = useState(true);
    const { tokens } = useContext(AuthContext);
    const toast = useToast();
    const router = useRouter();

    useEffect(() => {
        const fetchLikes = async () => {
            if (!tokens) return;

            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/like/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokens.access}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch likes");
                }

                const data = await response.json();
                console.log("Fetched likes data:", data);

                const userId = tokens.user.id;

                const marketGabLikes = data.filter(like => like.content_type === 11 && like.user === userId);
                const ideaLikes = data.filter(like => like.content_type === 9 && like.user === userId);

                setIdeaLike(ideaLikes);
                setMarketGabLike(marketGabLikes);
            } catch (error) {
                console.error("Error fetching likes:", error.message);
                toast({
                    title: "Error",
                    description: error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchLikes();
    }, [tokens]);

    const handleDetailsClick = (reportId) => {
        if (!tokens) {
            toast({
                title: "Please log in",
                description: "You need to be logged in to view this report's details.",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
        } else {
            router.push(`/routes/MarketGabDetails?id=${reportId}`);
        }
    };
    const handleDetailsClickIdea=(ideaId)=>{
        if (!tokens) {
            toast({
                title: "Please log in",
                description: "You need to be logged in to view this report's details.",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
        } else {
            router.push(`/routes/idea?id=${ideaId}`);
        }
        
    }

    const likeIdea = (ideaId) => {
        // Implement the like functionality here
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            {/* Ideas likes */}
            <h2 className="main-title dark:text-white">
                Ideas<span></span>
            </h2>
            <ul>
                {ideaLike.length > 0 ? (
                    ideaLike.map((like) => (
                        <div
                            className="idea-card dark:!bg-gray-900 dark:!text-white dark:!border-[transparent]"
                            key={like.id}
                        >
                            <i className="ri-lightbulb-flash-line light dark:after:!bg-[#0b4661]"></i>

                            <div className="info">
                                <p>
                                    <strong>Title:</strong> {like.content_object?.name || 'Unknown Name'}
                                </p>
                                <p>
                                    <strong>Category:</strong> {like.content_object?.category || 'Unknown Category'}
                                </p>
                                <p>
                                    <strong>Cost:</strong> ${like.content_object?.cost || 'N/A'}
                                </p>
                                <p>
                                    <strong>Location:</strong> {like.content_object?.location || 'Unknown Location'}
                                </p>

                                <span onClick={() => handleDetailsClickIdea(like.content_object?.id)}>
                                    More Details <i className="ri-arrow-right-line"></i>
                                </span>
                            </div>

                        
                        </div>
                    ))
                ) : (
                    <p>No ideas liked yet.</p>
                )}
            </ul>

            {/* Market Gab likes */}
            <h2 className="main-title dark:text-white">
                Market Gab<span></span>
            </h2>
            <ul>
                {marketGabLike.length > 0 ? (
                    marketGabLike.map((like) => (
                        <div
                            className="idea-card dark:!bg-gray-900 dark:!text-white dark:!border-[transparent]"
                            key={like.id}
                        >
                            <i className="ri-store-2-line light dark:after:!bg-[#0b4661]"></i>

                            <div className="info">
                                <p>
                                    <strong>Title: </strong>
                                    {like.content_object?.title || 'No Description'}
                                </p>
                                <p>
                                    <strong>Funding: </strong>
                                    {like.content_object?.funding_required || 'N/A'}
                                </p>
                                <p>
                                    <strong>Location: </strong>
                                    {like.content_object?.location || 'Unknown Location'}
                                </p>

                                <span onClick={() => handleDetailsClick(like.content_object.id)}>
                                    More Details <i className="ri-arrow-right-line"></i>
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No market gaps liked yet.</p>
                )}
            </ul>
        </>
    );
}

export default Liked;
