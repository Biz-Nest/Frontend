"use client";
import { useEffect, useState } from "react";
import DashStore from "@/app/components/dashboard/dash_store";
import DashIdea from "@/app/components/dashboard/dash_idea";
import DashProducts from "@/app/components/dashboard/dash_products";
import DashMarket from "@/app/components/dashboard/dash_market";
import { Spinner } from "@chakra-ui/react";
import Image from "next/image";

import "./page.css";

export default function Dashboard() {
  const [tokens, setTokens] = useState(null);
  const [activeTab, setActiveTab] = useState("store"); // State to control which component to show

  useEffect(() => {
    const storedTokens = localStorage.getItem("tokens");
    if (storedTokens) {
      setTokens(JSON.parse(storedTokens));
    }
  }, []);

  if (!tokens) {
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
    ); // Or some other loading state
  }

  return (
    <>
      <div className="dashboard">

        <div className="landing relative bg-gradient-to-r from-purple-600 to-blue-600 text-white overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/dashboard.jpg"
              alt="Background Image"
              className="object-cover object-center w-full h-full"
              width={1000}
              height={1000}
            />
            <div className="absolute inset-0 bg-black opacity-50"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center items-center h-full text-center">
            <h1 className="text-5xl font-bold leading-tight mb-4">Dashboard</h1>
            <p className="text-lg text-gray-300 mb-8">
            Hello, {tokens.user.username}! Welcome To Your...<br></br>
              We are glad to see you here, enjoy exploring the dashboard.
            </p>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="nav-switch container">
            <button
              className={`${activeTab === "store" ? "active" : ""}`}
              onClick={() => setActiveTab("store")}
            >
              Store
            </button>
            <button
              className={`${activeTab === "products" ? "active" : ""}`}
              onClick={() => setActiveTab("products")}
            >
              Products
            </button>
            <button
              className={`${activeTab === "idea" ? "active" : ""}`}
              onClick={() => setActiveTab("idea")}
            >
              Ideas
            </button>
            <button
              className={`${activeTab === "market" ? "active" : ""}`}
              onClick={() => setActiveTab("market")}
            >
              Market
            </button>
          </div>

          <div className="component">
            {/* Conditionally render the component based on activeTab */}
            {activeTab === "store" && <DashStore tokens={tokens} />}
            {activeTab === "products" && <DashProducts tokens={tokens} />}
            {activeTab === "idea" && <DashIdea tokens={tokens} />}
            {activeTab === "market" && <DashMarket tokens={tokens} />}
          </div>
        </div>
      </div>
    </>
  );
}
