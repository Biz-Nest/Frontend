'use client';
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import { AuthContext } from '@/app/context/Auth';
import { useRouter } from 'next/navigation';  // Added import for navigation

// Fetcher function for SWR
const fetcher = (url, token) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  }).then((res) => res.json());

function GabMarketList() {
  const [reports, setReports] = useState([]);
  const { tokens } = useContext(AuthContext);
  const [likedReports, setLikedReports] = useState({});
  const router = useRouter();  // Initialize router

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:8000/reports/', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (Array.isArray(response.data)) {
          setReports(response.data);
        } else {
          console.error('Unexpected data format:', response.data);
          setReports([]);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
        setReports([]);
      }
    };

    fetchReports();
  }, []);

  // Fetch likes without token
  const { data: likes, error } = useSWR(
    'http://127.0.0.1:8000/like/',
    (url) => fetcher(url, null)
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
      const response = await fetch('http://127.0.0.1:8000/like/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens?.access}`,
        },
        body: JSON.stringify({
          "user": tokens.user.id,  // Use tokens to get the user ID
          "content_type": 10,  // Replace with the actual content type ID for Report
          "object_id": reportId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to like the report');
      }

      // Revalidate the SWR cache for likes
      mutate('http://127.0.0.1:8000/like/');
    } catch (error) {
      console.error('Error liking report:', error);
    }
  };

  if (!reports) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {/* Intro Section */}
      <div className="bg-black">
        <section
          id="features"
          className="relative block px-6 py-10 border-t border-b md:py-20 md:px-10 border-neutral-900 bg-neutral-900/30"
        >
          <div className="relative max-w-5xl mx-auto text-center">
            <span className="flex items-center justify-center my-3 font-medium tracking-wider text-gray-400 uppercase">
              Why Invest in Our Market
            </span>
            <h2 className="block w-full text-3xl font-bold text-transparent bg-gradient-to-b from-white to-gray-400 bg-clip-text sm:text-4xl">
              Uncover Untapped Opportunities in Your Area
            </h2>
            <p className="w-full max-w-xl mx-auto my-4 font-medium leading-relaxed tracking-wide text-center text-gray-400 bg-transparent">
              Gap Market provides insights into the missing markets in your
              location, helping you identify lucrative opportunities for
              investment. Explore our platform to find the gaps and invest where
              it matters most.
            </p>
          </div>
        </section>
      </div>

      {/* Reports List Section */}
      <div className="relative z-10 grid grid-cols-1 gap-10 mx-auto mb-32 max-w-7xl pt-14 sm:grid-cols-2 lg:grid-cols-3">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div
              key={report.id}
              className="p-8 text-center border rounded-md shadow border-neutral-800 bg-neutral-900/50"
            >
              <div
                className="flex items-center justify-center w-12 h-12 mx-auto border rounded-md button-text"
                style={{
                  backgroundImage:
                    'linear-gradient(rgb(80, 70, 229) 0%, rgb(43, 49, 203) 100%)',
                  borderColor: 'rgb(93, 79, 240)',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-color-swatch"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M19 3h-4a2 2 0 0 0 -2 2v12a4 4 0 0 0 8 0v-12a2 2 0 0 0 -2 -2"></path>
                  <path d="M13 7.35l-2 -2a2 2 0 0 0 -2.828 0l-2.828 2.828a2 2 0 0 0 0 2.828l9 9"></path>
                  <path d="M7.3 13h-2.3a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h12"></path>
                  <line x1="17" y1="17" x2="17" y2="17.01"></line>
                </svg>
              </div>
              <h3 className="mt-6 text-gray-400">Title: {report.title}</h3>
              <p className="my-4 mb-0 font-normal leading-relaxed tracking-wide text-gray-400">
                Description: {report.description}
              </p>
              {!likedReports[report.id] && tokens && (
                <button
                  onClick={() => likeReport(report.id)}
                  className="px-4 py-2 mt-4 font-semibold "
                >
                  ❤️ 
                </button>
              )}
              <a
                onClick={() =>
                  router.push(`/routes/MarketGabDetails?id=${report.id}`)
                }
                className="text-blue-500 cursor-pointer hover:underline"
              >
                More Details
              </a>
            </div>
          ))
        ) : (
          <div className="text-gray-400">No reports available</div>
        )}
      </div>
    </div>
  );
}

export default GabMarketList;
