import LoginPage from "./components/Authantication/Login";
import ThemeWrapper from "./context/Theme";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeWrapper>
          <main>
            <LoginPage />{" "}
            {/* Make sure you include the LoginPage component here */}
            {children}
          </main>
        </ThemeWrapper>
      </body>
    </html>
  );
}
