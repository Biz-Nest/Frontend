"use client";
import { useEffect, useState, useContext } from "react";
import DashStore from "@/app/components/dashboard/dash_store";
import DashIdea from "@/app/components/dashboard/dash_idea";
import DashProducts from "@/app/components/dashboard/dash_products";
import DashMarket from "@/app/components/dashboard/dash_market";

export default function Dashboard() {
    const [tokens, setTokens] = useState(null);
    
    useEffect(() => {
        const storedTokens = localStorage.getItem('tokens');
        if (storedTokens) {
            setTokens(JSON.parse(storedTokens));
        }
    }, []);

    if (!tokens) {
        return <div>Loading...</div>; // Or some other loading state
    }

    return (
        <>
            <div className="bg-gray-100 p-8">
                <div className="bg-white shadow-lg rounded-lg p-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to your Dashboard!</h1>
                    <p className="text-gray-700 text-2xl mb-4">Hello, {tokens.user.username}</p>
                    <p className="text-gray-700 text-2xl">We are glad to see you here, enjoy exploring the dashboard.</p>
                </div>
            </div>
            <DashStore tokens={tokens} />
            <DashProducts tokens={tokens}/>
            <DashIdea tokens={tokens}/>
            <DashMarket tokens={tokens}/>
        </>
    );
}
