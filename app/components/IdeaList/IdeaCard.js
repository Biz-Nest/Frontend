import React, { useContext, useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { AuthContext } from "@/app/context/Auth";
import "./Idea.css";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

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

  // Fetch likes without token
  const { data: likes, error } = useSWR(
    "http://127.0.0.1:8000/like/", // No token needed here
    (url) => fetcher(url, null) // Pass null for token
  );

  // Determine if the idea is liked
  useEffect(() => {
    if (likes) {
      const userLiked = likes.some((like) => like.object_id === idea.id);
      setLiked(userLiked);
    }
  }, [likes, idea.id]);

  const likeIdea = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/like/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens?.access}`,
        },
        body: JSON.stringify({
          user: idea.owner, // assuming idea.owner is the user ID
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
      mutate("http://127.0.0.1:8000/like/");
    } catch (error) {
      console.error("Error liking idea:", error);
    }
  };

  return (
    <div className="idea-card dark:!bg-gray-900 dark:!text-white dark:!border-[transparent]">
      <i class="ri-lightbulb-flash-line light dark:after:!bg-[#0b4661]"></i>

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

        <span onClick={() => router.push(`/routes/idea?id=${idea.id}`)}>
          More Details <i class="ri-arrow-right-line"></i>
        </span>
      </div>

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
