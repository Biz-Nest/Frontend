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
                  src="/images/team_member.jpeg"
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
                  src="/images/team_member.jpeg"
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
                  src="/images/team_member.jpeg"
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
                  src="/images/team_member.jpeg"
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
          </div>
        </div>
      </div>

      <div class="infinite-line">
        <div className="container">
          <div class="content">
            <ul>
              <li>HTML Table</li>
              <li>HTML Form</li>
              <li>HTML Class</li>
              <li>HTML ID</li>
              <li>HTML Tag</li>
              <li>HTML Property</li>
              <li>HTML Attribute</li>
              <li>HTML Element</li>
              <li>Placeholder</li>
            </ul>

            <ul>
              <li>HTML Table</li>
              <li>HTML Form</li>
              <li>HTML Class</li>
              <li>HTML ID</li>
              <li>HTML Tag</li>
              <li>HTML Property</li>
              <li>HTML Attribute</li>
              <li>HTML Element</li>
              <li>Placeholder</li>
            </ul>
          </div>

          <div class="content middle">
            <ul>
              <li>HTML Table</li>
              <li>HTML Form</li>
              <li>HTML Class</li>
              <li>HTML ID</li>
              <li>HTML Tag</li>
              <li>HTML Property</li>
              <li>HTML Attribute</li>
              <li>HTML Element</li>
              <li>Placeholder</li>
            </ul>

            <ul>
              <li>HTML Table</li>
              <li>HTML Form</li>
              <li>HTML Class</li>
              <li>HTML ID</li>
              <li>HTML Tag</li>
              <li>HTML Property</li>
              <li>HTML Attribute</li>
              <li>HTML Element</li>
              <li>Placeholder</li>
            </ul>
          </div>

          <div class="content">
            <ul>
              <li>HTML Table</li>
              <li>HTML Form</li>
              <li>HTML Class</li>
              <li>HTML ID</li>
              <li>HTML Tag</li>
              <li>HTML Property</li>
              <li>HTML Attribute</li>
              <li>HTML Element</li>
              <li>Placeholder</li>
            </ul>

            <ul>
              <li>HTML Table</li>
              <li>HTML Form</li>
              <li>HTML Class</li>
              <li>HTML ID</li>
              <li>HTML Tag</li>
              <li>HTML Property</li>
              <li>HTML Attribute</li>
              <li>HTML Element</li>
              <li>Placeholder</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
