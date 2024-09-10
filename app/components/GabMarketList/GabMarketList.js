"use client";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import useSWR, { mutate } from "swr";
import { AuthContext } from "@/app/context/Auth";
import { useRouter } from "next/navigation"; // Added import for navigation
import Image from "next/image";
import "./GabMarketList.css";
import Link from "next/link";
import { useToast, Spinner } from "@chakra-ui/react";

// Fetcher function for SWR
const fetcher = (url, token) =>
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  }).then((res) => res.json());

function GabMarketList() {
  const toast = useToast();
  const [reports, setReports] = useState([]);
  const { tokens } = useContext(AuthContext);
  const [likedReports, setLikedReports] = useState({});
  const router = useRouter(); // Initialize router

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/reports/`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (Array.isArray(response.data)) {
          setReports(response.data);
        } else {
          console.error("Unexpected data format:", response.data);
          setReports([]);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
        setReports([]);
      }
    };

    fetchReports();
  }, []);

  // Fetch likes without token
  const { data: likes, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/like/`,
    (url) => fetcher(url, null)
  );

  // Update likedReports state when likes data is available
  useEffect(() => {
    if (likes) {
      const updatedLikedReports = {};
      reports.forEach((report) => {
        const userLiked = likes.some(
          (like) =>
            like.object_id === report.id &&
            like.user === tokens?.user?.id &&
            like.content_type === 11
        );
        updatedLikedReports[report.id] = userLiked;
      });
      setLikedReports(updatedLikedReports);
    }
  }, [likes, reports]);

  const likeReport = async (reportId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/like/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens?.access}`,
        },
        body: JSON.stringify({
          user: tokens.user.id, // Use tokens to get the user ID
          content_type: 11, // Replace with the actual content type ID for Report
          object_id: reportId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to like the report");
      }

      // Revalidate the SWR cache for likes
      mutate(`${process.env.NEXT_PUBLIC_API_URL}/like/`);
    } catch (error) {
      console.error("Error liking report:", error);
    }
  };

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

  if (!reports) {
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
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="gab-market-section">
      {/* Start Landing */}
      <div className="relative overflow-hidden text-white landing bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="absolute inset-0">
          <Image
            src="/images/marketgap-sec.jpg"
            alt="Background Image"
            className="object-cover object-center w-full h-full"
            width={1000}
            height={1000}
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          <p className="mb-8 text-lg text-gray-300">Why Invest in Our Market</p>
          <h1 className="mb-4 text-5xl font-bold leading-tight">
            Uncover Untapped Opportunities in Your Area
          </h1>
          <p className="mb-8 text-lg text-gray-300">
            Gap Market provides insights into the missing markets in your
            location, helping you identify lucrative opportunities for
            investment. Explore our platform to find the gaps and invest where
            it matters most.
          </p>
          <Link
            className="px-6 py-2 text-lg font-semibold text-gray-900 transition duration-300 ease-in-out transform bg-yellow-400 rounded-full hover:bg-yellow-300 hover:scale-105 hover:shadow-lg"
            href="#"
          >
            Start Exploring
          </Link>
        </div>
      </div>
      {/* End Landing */}

      {/* Reports List Section */}
      <div className="market-list">
        <div className="container">
          {reports.length > 0 ? (
            reports.map((report) => (
              // Start Card
              <div
                className="idea-card dark:!bg-[radial-gradient(circle,_rgba(24,_32,_45,_1)_20%,_rgba(10,_15,_20,_1)_80%)] dark:!text-white dark:!border-[transparent]"
                key={report.id}
              >
                <i className="ri-store-2-line light dark:after:!bg-[#0b4661]"></i>

                <div className="info">
                  <p>
                    <strong>Title: </strong>
                    {report.title}
                  </p>
                  <p>
                    <strong>Funding: </strong>
                    {report.funding_required}
                  </p>
                  <p>
                    <strong>Location: </strong>
                    {report.location}
                  </p>
                </div>

                <span
                  onClick={() => handleDetailsClick(report.id)} // Use the new handler
                >
                  {" "}
                  More Details <i className="ri-arrow-right-line"></i>
                </span>

                {!tokens ? null : !likedReports[report.id] ? (
                  <i
                    className="ri-thumb-up-line abs"
                    onClick={() => likeReport(report.id)}
                  ></i>
                ) : (
                  <i className="ri-thumb-up-fill abs"></i>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-400">No reports available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GabMarketList;
