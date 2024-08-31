"use client";
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const AuthContext = createContext();

export default function AuthWrapper({ children }) {
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/";
    const [loading, setLoading] = useState(false);
    const [globalState, setGlobalState] = useState({
        tokens: null,
        username: null,
        login,
        logout,
        register,
    });

    useEffect(() => {
        const storedTokens = localStorage.getItem("tokens");
        if (storedTokens) {
            setGlobalState((prevState) => ({
                ...prevState,
                tokens: JSON.parse(storedTokens),
            }));
        }
    }, []);

    function handleError(error, customMessage = "An error occurred.") {
        console.error(customMessage, error.response?.status, error.response?.data);
        alert(`${customMessage}\n${error.response?.data?.detail || "Please try again later."}`);
    }

    async function register(userinfo) {
        setLoading(true);
        try {
            const url = `${baseUrl}register/`;
            const res = await axios.post(url, userinfo);
            const tokens = res.data;
            localStorage.setItem("tokens", JSON.stringify(tokens));
            setGlobalState((prevState) => ({
                ...prevState,
                tokens,
                username: userinfo.username, // Store username or other details as needed
            }));
            router.push("/");  // Redirect to home or dashboard after registration
        } catch (error) {
            handleError(error, "Registration failed:");
            if (error.response && error.response.status === 400) {
                alert("Username already exists. Please choose a different username.");
            }
        } finally {
            setLoading(false);
        }
    }

    async function login(userinfo) {
        setLoading(true);
        try {
            const url = `${baseUrl}token/`;
            const res = await axios.post(url, userinfo);
            const tokens = res.data;
            localStorage.setItem("tokens", JSON.stringify(tokens));
            setGlobalState((prevState) => ({
                ...prevState,
                tokens,
                username: userinfo.username, // Store username or other details as needed
            }));
            router.push("/");  // Redirect to home or dashboard after login
        } catch (error) {
            handleError(error, "Login failed:");
            if (error.response && error.response.status === 401) {
                alert("Invalid credentials. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    async function refreshTokens() {
        try {
            const url = `${baseUrl}token/refresh/`;
            const res = await axios.post(url, { refresh: globalState.tokens.refresh });
            const tokens = res.data;
            localStorage.setItem("tokens", JSON.stringify(tokens));
            setGlobalState((prevState) => ({
                ...prevState,
                tokens,
            }));
        } catch (error) {
            console.error("Token refresh failed:", error);
            logout(); // Log the user out if the refresh fails
        }
    }

    function logout() {
        localStorage.removeItem("tokens");
        setGlobalState((prevState) => ({
            ...prevState,
            tokens: null,
            username: null,
        }));
        router.push("/login");  // Redirect to login page after logout
    }

    return (
        <ErrorBoundary>
            <AuthContext.Provider value={{ ...globalState, loading }}>
                {loading ? <LoadingSpinner /> : children}
            </AuthContext.Provider>
        </ErrorBoundary>
    );
}

function LoadingSpinner() {
    return <div>Loading...</div>; // You can customize this spinner component
}

function ErrorBoundary({ children }) {
    try {
        return children;
    } catch (error) {
        return <div>Something went wrong. Please try again later.</div>;
    }
}
