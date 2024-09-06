"use client";
import { useEffect, useState } from "react";
import DashStore from "@/app/components/dashboard/dash_store";
import DashIdea from "@/app/components/dashboard/dash_idea";
import DashProducts from "@/app/components/dashboard/dash_products";
import DashMarket from "@/app/components/dashboard/dash_market";
import { Spinner } from "@chakra-ui/react";

export default function Dashboard() {
    const [tokens, setTokens] = useState(null);
    const [activeTab, setActiveTab] = useState("store"); // State to control which component to show
    
    useEffect(() => {
        const storedTokens = localStorage.getItem('tokens');
        if (storedTokens) {
            setTokens(JSON.parse(storedTokens));
        }
    }, []);

    if (!tokens) {
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
        </div>; // Or some other loading state
    }

    return (
        <>
            <div className="bg-gray-100 p-8">
                <div className="bg-white shadow-lg rounded-lg p-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to your Dashboard!</h1>
                    <p className="text-gray-700 text-2xl mb-4">Hello, {tokens.user.username}</p>
                    <p className="text-gray-700 text-2xl">We are glad to see you here, enjoy exploring the dashboard.</p>
                </div>
                
                {/* Navigation buttons to switch between components */}
                <div className="mt-8 flex space-x-4">
                    <button 
                        className={`px-4 py-2 font-semibold ${activeTab === "store" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                        onClick={() => setActiveTab("store")}
                    >
                        Store
                    </button>
                    <button 
                        className={`px-4 py-2 font-semibold ${activeTab === "products" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                        onClick={() => setActiveTab("products")}
                    >
                        Products
                    </button>
                    <button 
                        className={`px-4 py-2 font-semibold ${activeTab === "idea" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                        onClick={() => setActiveTab("idea")}
                    >
                        Ideas
                    </button>
                    <button 
                        className={`px-4 py-2 font-semibold ${activeTab === "market" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                        onClick={() => setActiveTab("market")}
                    >
                        Market
                    </button>
                </div>
            </div>

            {/* Conditionally render the component based on activeTab */}
            {activeTab === "store" && <DashStore tokens={tokens} />}
            {activeTab === "products" && <DashProducts tokens={tokens} />}
            {activeTab === "idea" && <DashIdea tokens={tokens} />}
            {activeTab === "market" && <DashMarket tokens={tokens} />}
        </>
    );
}
