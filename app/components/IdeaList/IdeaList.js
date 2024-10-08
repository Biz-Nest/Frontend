import React, { useContext } from "react";
import useSWR from "swr";
import { AuthContext } from "@/app/context/Auth";
import IdeaCard from "./IdeaCard";
import Image from "next/image";
import "./Idea.css";

import { Spinner } from "@chakra-ui/react";

// Fetcher function for SWR (without authorization)
const fetcher = (url) =>
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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
  if (!ideas)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner
          color="red.500"
          size="xl"
          style={{
            width: "100px", // Adjust size as needed
            height: "100px", // Adjust size as needed
            borderWidth: "12px", // Make the spinner thicker
          }}
        />
      </div>
    );

  return (
    <div className="ideas-section">
      <div className="landing relative bg-gradient-to-r from-purple-600 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/ideas-sec.jpg"
            alt="Background Image"
            className="object-cover object-center w-full h-full"
            width={1000}
            height={1000}
          />

          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center">
          <h1 className="text-5xl font-bold leading-tight mb-4">
            Step Into a World of Innovation
          </h1>

          <p className="text-lg text-gray-300 mb-8">
            Discover a world of groundbreaking ideas designed to inspire and
            engage investors. This platform showcases creative solutions,
            innovative business ideas, and unique opportunities, all carefully
            curated to help you find your next big investment. Start exploring
            and be part of a future filled with possibilities.
          </p>

          <a
            href="#"
            className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 py-2 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            Start Exploring
          </a>
        </div>
      </div>

      <div className="idea-list">
        <div className="container">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IdeaList;
