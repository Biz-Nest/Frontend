import React, { useContext, useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { AuthContext } from "@/app/context/Auth";
import "./Idea.css";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react"; // Import useToast

// Fetcher function for SWR
const fetcher = (url, token) =>
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  }).then((res) => res.json());

const IdeaCard = ({ idea }) => {
  const { tokens } = useContext(AuthContext);
  const [liked, setLiked] = useState(false); // Track if idea is liked
  const router = useRouter();
  const toast = useToast(); // Initialize toast

  // Fetch likes without token
  const { data: likes, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/like/`, // No token needed here
    (url) => fetcher(url, null) // Pass null for token
  );

  // Determine if the idea is liked by the current user
  useEffect(() => {
    if (likes && tokens?.user?.id) {
      const userLiked = likes.some(
        (like) => like.object_id === idea.id && like.user === tokens.user.id
      );
      setLiked(userLiked);
    }
  }, [likes, idea.id, tokens?.user?.id]);

  const likeIdea = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/like/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens?.access}`,
        },
        body: JSON.stringify({
          user: tokens.user.id, // assuming idea.owner is the user ID
          content_type: 9, // replace with the actual content type ID for Idea
          object_id: idea.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to like the idea");
      }

      // Set liked to true to hide the button
      setLiked(true);

      // Revalidate the SWR cache for likes
      mutate(`${process.env.NEXT_PUBLIC_API_URL}/like/`);
    } catch (error) {
      console.error("Error liking idea:", error);
    }
  };

  const handleLinkClick = () => {
    if (!tokens) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to view this idea's details.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } else {
      router.push(`/routes/idea?id=${idea.id}`);
    }
  };

  return (
    <div className="idea-card dark:!bg-gray-900 dark:!text-white dark:!border-[transparent]">
      <i className="ri-lightbulb-flash-line light dark:after:!bg-[#0b4661]"></i>

      <div className="info">
        <p>
          <strong>Title:</strong> {idea.name}
        </p>
        <p>
          <strong>Category:</strong> {idea.category}
        </p>
        <p>
          <strong>Cost:</strong> ${idea.cost}
        </p>
        <p>
          <strong>Location:</strong> {idea.location}
        </p>
      </div>

      <span onClick={handleLinkClick}>
          More Details <i className="ri-arrow-right-line"></i>
        </span>

      {!tokens ? (
        ""
      ) : !liked ? (
        <i className="ri-thumb-up-fill abs" onClick={likeIdea}></i>
      ) : (
        <i className="ri-thumb-up-line abs"></i>
      )}
    </div>
  );
};

export default IdeaCard;
