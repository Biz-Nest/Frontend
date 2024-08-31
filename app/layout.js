'use client';
import Test from "./components/test";
import ThemeWrapper from "./context/Theme";
import "./globals.css";

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <body>
        <ThemeWrapper>
          <Test />
      <main>{children}</main>
      </ThemeWrapper>
      </body>
    </html>
  );
}
