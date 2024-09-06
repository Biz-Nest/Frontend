"use client";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import useSWR, { mutate } from "swr";
import { AuthContext } from "@/app/context/Auth";
import { useRouter } from "next/navigation"; // Added import for navigation
import Image from "next/image";
import "./GabMarketList.css";
import Link from "next/link";

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
  const [reports, setReports] = useState([]);
  const { tokens } = useContext(AuthContext);
  const [likedReports, setLikedReports] = useState({});
  const router = useRouter(); // Initialize router

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("http://localhost:8000/reports/", {
          headers: {
            "Content-Type": "application/json",
          },
        });

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
  const { data: likes, error } = useSWR("http://127.0.0.1:8000/like/", (url) =>
    fetcher(url, null)
  );

  // Update likedReports state when likes data is available
  useEffect(() => {
    if (likes) {
      const updatedLikedReports = {};
      reports.forEach((report) => {
        const userLiked = likes.some((like) => like.object_id === report.id);
        updatedLikedReports[report.id] = userLiked;
      });
      setLikedReports(updatedLikedReports);
    }
  }, [likes, reports]);

  const likeReport = async (reportId) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/like/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens?.access}`,
        },
        body: JSON.stringify({
          user: tokens.user.id, // Use tokens to get the user ID
          content_type: 10, // Replace with the actual content type ID for Report
          object_id: reportId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to like the report");
      }

      // Revalidate the SWR cache for likes
      mutate("http://127.0.0.1:8000/like/");
    } catch (error) {
      console.error("Error liking report:", error);
    }
  };

  if (!reports) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="gab-market-section">
      {/* Start Landing */}
      <div class="landing relative bg-gradient-to-r from-purple-600 to-blue-600 text-white overflow-hidden">
        <div class="absolute inset-0">
          <Image
            src="/images/marketgap-sec.jpg"
            alt="Background Image"
            class="object-cover object-center w-full h-full"
            width={1000}
            height={1000}
          />

          <div class="absolute inset-0 bg-black opacity-50"></div>
        </div>

        <div class="relative z-10 flex flex-col justify-center items-center h-full text-center">
          <p class="text-lg text-gray-300 mb-8">Why Invest in Our Market</p>

          <h1 class="text-5xl font-bold leading-tight mb-4">
            Uncover Untapped Opportunities in Your Area
          </h1>

          <p class="text-lg text-gray-300 mb-8">
            Gap Market provides insights into the missing markets in your
            location, helping you identify lucrative opportunities for
            investment. Explore our platform to find the gaps and invest where
            it matters most.
          </p>

          <Link
            className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 py-2 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            href="#"
          >
            Start Exploring
          </Link>
        </div>
      </div>
      {/* End Landing */}

      {/* Reports List Section */}

      {/* Start Market List */}
      <div className="market-list">
        {/* Start Container of ML */}
        <div className="container">
          {reports.length > 0 ? (
            reports.map((report) => (
              // Start Card
              <div
                className="idea-card dark:!bg-gray-900 dark:!text-white dark:!border-[transparent]"
                key={report.id}
              >
                {/* <i class="ri-lightbulb-flash-line light dark:after:!bg-[#0b4661]"></i> */}
                <i class="ri-store-2-line light dark:after:!bg-[#0b4661]"></i>

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

                  <span
                    onClick={() =>
                      router.push(`/routes/MarketGabDetails?id=${report.id}`)
                    }
                  >
                    {" "}
                    More Details <i class="ri-arrow-right-line"></i>
                  </span>
                </div>

                {!tokens ? null : !likedReports[report.id] ? (
                  <i
                    className="ri-thumb-up-fill abs"
                    onClick={() => likeReport(report.id)}
                  ></i>
                ) : (
                  <i
                    className="ri-thumb-up-line abs"
                    onClick={() => likeReport(report.id)}
                  ></i>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-400">No reports available</div>
          )}
        </div>
        {/* End Container of ML */}
      </div>
      {/* End Market List */}
    </div>
  );
}

export default GabMarketList;
