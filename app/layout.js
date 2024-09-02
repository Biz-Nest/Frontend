"use client";
import { ChakraProvider } from "@chakra-ui/react";
import AuthProvider from "./context/Auth";
import ThemeWrapper from "./context/Theme";
import 'remixicon/fonts/remixicon.css';
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Head from 'next/head'; 
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <AuthProvider>
            <ThemeWrapper>
              <Header/>
              <main>{children}</main>
              <Footer/>
            </ThemeWrapper>
          </AuthProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
