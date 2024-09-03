"use client";
import { ChakraProvider } from "@chakra-ui/react";
import AuthProvider from "./context/Auth";
import ThemeWrapper from "./context/Theme";
import 'remixicon/fonts/remixicon.css';
import Head from 'next/head'; 
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <AuthProvider>
            <ThemeWrapper>
              <main>{children}</main>
            </ThemeWrapper>
          </AuthProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
