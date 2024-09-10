// app/layout.js

import { Inter } from "next/font/google";
import { Roboto } from 'next/font/google';
import { Cairo } from 'next/font/google';
import { Courgette } from 'next/font/google';
import { Itim } from 'next/font/google';

import { ChakraProvider } from "@chakra-ui/react";
import AuthProvider from "./context/Auth";
import ThemeWrapper from "./context/Theme";
import 'remixicon/fonts/remixicon.css';
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import "./globals.css";

const inter = Inter({ subsets: ["latin"]});
 
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

const cairo = Cairo({
  weight: '400',
  subsets: ['latin'],
  variable: '--sevillana-font'
})

const courgette = Courgette({
  weight: '400',
  subsets: ['latin'],
  variable: '--sevillana-font'
})

const itim = Itim({
  weight: '400',
  subsets: ['latin'],
  variable: '--sevillana-font'
})

export const metadata = {
  title: 'Invest-era',  
  icons: {
    icon: '/images/logo2.png', 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`dark:!bg-gray-900 ${cairo.className}`}>
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
