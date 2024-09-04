"use client";
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast, Spinner } from "@chakra-ui/react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const router = useRouter();
    const toast = useToast();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api/";
    const [loading, setLoading] = useState(false);
    const [globalState, setGlobalState] = useState({
        tokens: null,
        username: null,
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
        toast({
            title: customMessage,
            description: "Please try again later.",
            status: "error",
            duration: 9000,
            isClosable: true,
        });
    }

    async function register(userinfo) {
        setLoading(true);
        try {
            const url = process.env.NEXT_PUBLIC_REGISTER_URL || "http://localhost:8001/account/api/register/";
            const res = await axios.post(url, userinfo);
            const tokens = res.data;
            // setGlobalState((prevState) => ({
            //     ...prevState,
            //     tokens,
            //     username: userinfo.username,
            // }));
            toast({
                title: "Registration Successful",
                description: "You have successfully registered.",
                status: "success",
                duration: 1000,
                isClosable: true,
            });
            // Optional: Navigate to another page if needed
            // router.push("/");
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast({
                    title: "Registration Error",
                    description: "Username already exists. Please choose a different username.",
                    status: "error",
                    duration: 1000,
                    isClosable: true,
                });
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
                username: userinfo.username,
            }));
            toast({
                title: "Login Successful",
                description: "You have successfully logged in.",
                status: "success",
                duration: 1000,
                isClosable: true,
            });
            router.push("/");
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast({
                    title: "Login Error",
                    description: "Invalid username or password. Please try again.",
                    status: "error",
                    duration: 1000,
                    isClosable: true,
                });
            }
        } finally {
            setLoading(false);
        }
    }

    function logout() {
        localStorage.removeItem("tokens");
        setGlobalState((prevState) => ({
            ...prevState,
            tokens: null,
            username: null,
        }));
    router.push('/')
    }

    return (
        <AuthContext.Provider value={{ ...globalState, login, logout, register, loading }}>
            {loading ? <LoadingSpinner /> : children}
        </AuthContext.Provider>
    );
}

function LoadingSpinner() {
    return (
        <div style={{
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
        </div>
    );
}