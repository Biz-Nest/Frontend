import "./About.css";
import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <>
      <div className="about-us">
        <div className="team-members">
          <h2 className="main-title dark:text-white">
            Team Members<span></span>
          </h2>

          <div className="container">
            <div className="member">
              <div className="pic">
                <Image
                  src="/images/assad.jpg"
                  width={100}
                  height={100}
                  alt="img"
                />
                <div className="helper">
                  <Link href="/" className="one">
                    <i className="ri-linkedin-box-fill one"></i>
                  </Link>

                  <Link href="/" className="two">
                    <i className="ri-github-fill two"></i>
                  </Link>

                  <Link href="/" className="three">
                    <i className="ri-facebook-circle-fill three"></i>
                  </Link>

                  <Link href="/" className="four">
                    <i className="ri-slack-line four"></i>
                  </Link>
                </div>
              </div>
              <div className="info">
                <h3>Assad Almughrabi</h3>
                <p>Full-Stack Web Developer</p>
              </div>
            </div>
            <div className="member">
              <div className="pic">
                <Image
                  src="/images/yaman.png"
                  width={100}
                  height={100}
                  alt="img"
                />
                <div className="helper">
                  <Link href="/" className="one">
                    <i className="ri-linkedin-box-fill one"></i>
                  </Link>

                  <Link href="/" className="two">
                    <i className="ri-github-fill two"></i>
                  </Link>

                  <Link href="/" className="three">
                    <i className="ri-facebook-circle-fill three"></i>
                  </Link>

                  <Link href="/" className="four">
                    <i className="ri-slack-line four"></i>
                  </Link>
                </div>
              </div>
              <div className="info">
                <h3>Yaman Katalan</h3>
                <p>Full-Stack Web Developer</p>
              </div>
            </div>
            <div className="member">
              <div className="pic">
                <Image
                  src="/images/bird.png"
                  width={100}
                  height={100}
                  alt="img"
                />
                <div className="helper">
                  <Link href="/" className="one">
                    <i className="ri-linkedin-box-fill one"></i>
                  </Link>

                  <Link href="/" className="two">
                    <i className="ri-github-fill two"></i>
                  </Link>

                  <Link href="/" className="three">
                    <i className="ri-facebook-circle-fill three"></i>
                  </Link>

                  <Link href="/" className="four">
                    <i className="ri-slack-line four"></i>
                  </Link>
                </div>
              </div>

              <div className="info">
                <h3>Abdelrahman Saleh</h3>
                <p>Full-Stack Web Developer</p>
              </div>
            </div>
            <div className="member">
              <div className="pic">
                <Image
                  src="/images/soud.png"
                  width={100}
                  height={100}
                  alt="img"
                />
                <div className="helper">
                  <Link href="/" className="one">
                    <i className="ri-linkedin-box-fill one"></i>
                  </Link>

                  <Link href="/" className="two">
                    <i className="ri-github-fill two"></i>
                  </Link>

                  <Link href="/" className="three">
                    <i className="ri-facebook-circle-fill three"></i>
                  </Link>

                  <Link href="/" className="four">
                    <i className="ri-slack-line four"></i>
                  </Link>
                </div>
              </div>

              <div className="info">
                <h3>Abdelrahman Aboalsoud</h3>
                <p>Full-Stack Web Developer</p>
              </div>
            </div>
            <div className="member">
              <div className="pic">
                <Image
                  src="/images/qdad.png"
                  width={100}
                  height={100}
                  alt="img"
                />
                <div className="helper">
                  <Link href="/" className="one">
                    <i className="ri-linkedin-box-fill one"></i>
                  </Link>

                  <Link href="/" className="two">
                    <i className="ri-github-fill two"></i>
                  </Link>

                  <Link href="/" className="three">
                    <i className="ri-facebook-circle-fill three"></i>
                  </Link>

                  <Link href="/" className="four">
                    <i className="ri-slack-line four"></i>
                  </Link>
                </div>
              </div>
              <div className="info">
                <h3>Abdullah Qdad</h3>
                <p>Full-Stack Web Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="infinite-line">
        <div className="container">
          <div class="content">
            <ul>
              <li>Business Dev...</li>
              <li>Venture Capital</li>
              <li>Private Equity</li>
              <li>Financial Markets</li>
              <li>Investment Banking</li>
              <li>Wealth Management</li>
              <li>Asset Management</li>
              <li>Business Valuation</li>
              <li>Economic Growth</li>
            </ul>

            <ul>
              <li>Business Dev...</li>
              <li>Venture Capital</li>
              <li>Private Equity</li>
              <li>Financial Markets</li>
              <li>Investment Banking</li>
              <li>Wealth Management</li>
              <li>Asset Management</li>
              <li>Business Valuation</li>
              <li>Economic Growth</li>
            </ul>
          </div>

          <div class="content middle">
            <ul>
              <li>Business Strategy</li>
              <li>Market Analysis</li>
              <li>Financial Planning</li>
              <li>Risk Management</li>
              <li>Investment Portfolio</li>
              <li>Stock Market</li>
              <li>Capital Allocation</li>
              <li>Corporate Governance</li>
              <li>Entrepreneurship</li>
            </ul>

            <ul>
              <li>Business Strategy</li>
              <li>Market Analysis</li>
              <li>Financial Planning</li>
              <li>Risk Management</li>
              <li>Investment Portfolio</li>
              <li>Stock Market</li>
              <li>Capital Allocation</li>
              <li>Corporate Governance</li>
              <li>Entrepreneurship</li>
            </ul>
          </div>

          <div class="content">
            <ul>
              <li>Business Dev...</li>
              <li>Venture Capital</li>
              <li>Private Equity</li>
              <li>Financial Markets</li>
              <li>Investment Banking</li>
              <li>Wealth Management</li>
              <li>Asset Management</li>
              <li>Business Valuation</li>
              <li>Economic Growth</li>
            </ul>

            <ul>
              <li>Business Dev...</li>
              <li>Venture Capital</li>
              <li>Private Equity</li>
              <li>Financial Markets</li>
              <li>Investment Banking</li>
              <li>Wealth Management</li>
              <li>Asset Management</li>
              <li>Business Valuation</li>
              <li>Economic Growth</li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
