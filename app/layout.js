'use client';
import ThemeWrapper from "./context/Theme";
import "./globals.css";

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <body>
      <ThemeWrapper>
      <main>{children}</main>
      </ThemeWrapper>
      </body>
    </html>
  );
}
