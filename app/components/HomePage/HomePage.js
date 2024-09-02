import "./HomePage.css";
import Link from "next/link";
import Image from "next/image";
// import Head from "next/head";


export default function HomePage() {
  return (
    <>

      <div className="home-page">
        <div className="container">
          <div className="home-section">
            <div className="info">
              <h2 className="main-title  dark:!text-white">
                Explore Ideas<span></span>
              </h2>
              <p className="dark:!text-[#c1c8e4]">
                lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem
                lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem
                lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem
              </p>
              <Link href="/routes/about">
                <button class="animated-button">
                  <svg
                    viewBox="0 0 24 24"
                    class="arr-2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                  </svg>
                  <span class="text">Go To Section</span>
                  <span class="circle"></span>
                  <svg
                    viewBox="0 0 24 24"
                    class="arr-1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                  </svg>
                </button>
              </Link>
            </div>

            <Image
              src="/images/explore_ideas.png"
              width={100}
              height={100}
              alt="img"
            />
            <i class="fa-brands fa-wpexplorer one"></i>
          </div>

          <div className="home-section">
            <div className="info">
              <h2 className="main-title  dark:!text-white">
                Explore Stores<span></span>
              </h2>
              <p className="dark:!text-[#c1c8e4]">
                lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem
                lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem
                lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem
              </p>
              <Link href="/routes/about">
                <button class="animated-button">
                  <svg
                    viewBox="0 0 24 24"
                    class="arr-2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                  </svg>
                  <span class="text">Go To Section</span>
                  <span class="circle"></span>
                  <svg
                    viewBox="0 0 24 24"
                    class="arr-1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                  </svg>
                </button>
              </Link>
            </div>
            <Image src="/images/store.png" width={100} height={100} alt="img" />
            <i class="fa-solid fa-store two"></i>
          </div>

          <div className="home-section">
            <div className="info">
              <h2 className="main-title  dark:!text-white">
                New Ideas<span></span>
              </h2>
              <p className="dark:!text-[#c1c8e4]">
                lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem
                lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem
                lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem
              </p>
              <Link href="/routes/about">
                <button class="animated-button">
                  <svg
                    viewBox="0 0 24 24"
                    class="arr-2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                  </svg>
                  <span class="text">Go To Section</span>
                  <span class="circle"></span>
                  <svg
                    viewBox="0 0 24 24"
                    class="arr-1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                  </svg>
                </button>
              </Link>
            </div>
            <Image
              src="/images/new_ideas.png"
              width={100}
              height={100}
              alt="img"
            />
            <i class="fa-solid fa-lightbulb three"></i>
          </div>

          <div className="home-section">
            <div className="info">
              <h2 className="main-title  dark:!text-white">
                Market Gap<span></span>
              </h2>
              <p className="dark:!text-[#c1c8e4]">
                lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem
                lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem
                lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem
              </p>
              <Link href="/routes/about">
                <button class="animated-button">
                  <svg
                    viewBox="0 0 24 24"
                    class="arr-2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                  </svg>
                  <span class="text">Go To Section</span>
                  <span class="circle"></span>
                  <svg
                    viewBox="0 0 24 24"
                    class="arr-1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                  </svg>
                </button>
              </Link>
            </div>
            <Image
              src="/images/market_gap.png"
              width={100}
              height={100}
              alt="img"
            />
            <i class="fa-solid fa-shop-slash four"></i>
          </div>
        </div>
      </div>
    </>
  );
}
