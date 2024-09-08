import "./HomePage.css";
import Link from "next/link";
import Image from "next/image";
import { Itim } from "next/font/google";
import { Lemon } from "next/font/google";
import { AuthContext } from "@/app/context/Auth";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";

const itim = Itim({
  weight: "400",
  subsets: ["latin"],
  variable: "--itim-font",
});
const lemon = Lemon({
  weight: "400",
  subsets: ["latin"],
  variable: "--lemon-font",
});

export default function HomePage() {
  const { tokens } = useContext(AuthContext);
  const router = useRouter();
  const toast = useToast();

  const handleLog = (url) => {
    if (!tokens || !tokens.access) {
      toast({
        title: "Not Signed In",
        description: "You need to sign in to access this page.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      router.push("/routes/LogIn");
    } else {
      router.push(url);
    }
  };

  return (
    <>
      <div className="home-page">
        <div className="landing">
          <div className="container">
            <div className={`info ${lemon.className}`}>
              Creative & <br />
              Sophisticated
            </div>

            <div className="icon">
              <i className="ri-lightbulb-flash-line"></i>
            </div>
          </div>
        </div>

        <div className="routing-section">
          <div className="container">
            <div className="home-section">
              <div className="info">
                <h2 className="main-title dark:!text-white">Explore Ideas <span></span></h2>
                <p className="dark:!text-[#c1c8e4]">
                  Unlock a world of creativity and forward-thinking solutions.
                  Browse through a collection of groundbreaking ideas designed
                  to inspire innovation and push boundaries across industries.
                </p>
                <Link href="/routes/Ideas">
                  <button className="animated-button">
                    <svg
                      viewBox="0 0 24 24"
                      className="arr-2"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                    </svg>
                    <span className="text">Go To Section</span>
                    <span className="circle"></span>
                    <svg
                      viewBox="0 0 24 24"
                      className="arr-1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                    </svg>
                  </button>
                </Link>
              </div>
              <Image
                src="/images/explore_idea.png"
                width={1000}
                height={1000}
                alt="Explore Ideas"
              />
              <i className="fa-brands fa-wpexplorer one"></i>
            </div>

            <div className="home-section">
              <div className="info">
                <h2 className="main-title dark:!text-white">Explore Stores  <span></span></h2>
                <p className="dark:!text-[#c1c8e4]">
                  Discover a diverse array of stores offering tailored products
                  and services. Explore high-quality solutions that cater to
                  both personal and professional needs, all in one place.
                </p>
                <Link href="/routes/Store_List/">
                  <button className="animated-button">
                    <svg
                      viewBox="0 0 24 24"
                      className="arr-2"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                    </svg>
                    <span className="text">Go To Section</span>
                    <span className="circle"></span>
                    <svg
                      viewBox="0 0 24 24"
                      className="arr-1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                    </svg>
                  </button>
                </Link>
              </div>
              <Image
                src="/images/store.png"
                width={1000}
                height={1000}
                alt="Explore Stores"
              />
              <i className="fa-solid fa-store two"></i>
            </div>

            <div className="home-section">
              <div className="info">
                <h2 className="main-title dark:!text-white">New Ideas  <span></span></h2>
                <p className="dark:!text-[#c1c8e4]">
                  Contribute your own innovative ideas to the platform. Share
                  your unique perspective, collaborate with like-minded
                  professionals, and help drive progress by submitting new
                  concepts for others to explore.
                </p>
                <button
                  className="animated-button"
                  onClick={() => handleLog("/routes/addIdea")}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="arr-2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                  </svg>
                  <span className="text">Go To Section</span>
                  <span className="circle"></span>
                  <svg
                    viewBox="0 0 24 24"
                    className="arr-1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                  </svg>
                </button>
              </div>
              <Image
                src="/images/new_ideas.png"
                width={1000}
                height={1000}
                alt="New Ideas"
              />
              <i className="fa-solid fa-lightbulb three"></i>
            </div>

            <div className="home-section">
              <div className="info">
                <h2 className="main-title dark:!text-white">Market Gap  <span></span></h2>
                <p className="dark:!text-[#c1c8e4]">
                  Identify and bridge gaps in the market by sharing your
                  observations. Submit insights into unmet needs, emerging
                  trends, and opportunities for innovation that can lead to
                  impactful business solutions.
                </p>
                <button
                  className="animated-button"
                  onClick={() => handleLog("/routes/MarketGap")}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="arr-2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                  </svg>
                  <span className="text">Go To Section</span>
                  <span className="circle"></span>
                  <svg
                    viewBox="0 0 24 24"
                    className="arr-1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                  </svg>
                </button>
              </div>
              <Image
                src="/images/market_gap.png"
                width={1000}
                height={1000}
                alt="Market Gap"
              />
              <i className="fa-solid fa-magnifying-glass-location four"></i>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
