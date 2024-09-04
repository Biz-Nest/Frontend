"use client";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import About from "./components/About/About";
import HomePage from "./components/HomePage/HomePage";
import LoginPage from "./components/Authantication/Login";
import { useContext } from "react";
import { AuthContext } from "./context/Auth";
import { DragCards } from "./components/cards/DragCards";

export default function Home() {
  const { tokens } = useContext(AuthContext);
  return (
    <>
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" 
        integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" 
        crossOrigin="anonymous" 
        referrerPolicy="no-referrer" 
      />
      <DragCards />
      {tokens ? <HomePage /> : <LoginPage />}
    </>
  );
}