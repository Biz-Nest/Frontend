import "./About.css";
import Image from "next/image";

export default function About() {
  return (
    <>
      <div className="about-us">
        <h2 className="main-title dark:text-white">
          Team Members<span></span>
        </h2>
        <div className="team-members">
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
                  <i className="ri-linkedin-box-fill one"></i>
                  <i className="ri-github-fill two"></i>
                  <i className="ri-facebook-circle-fill three"></i>
                  <i className="ri-slack-line four"></i>
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
                  <i className="ri-linkedin-box-fill one"></i>
                  <i className="ri-github-fill two"></i>
                  <i className="ri-facebook-circle-fill three"></i>
                  <i className="ri-slack-line four"></i>
                </div>
              </div>
              <div className="info">
                <h3>Member Name</h3>
                <p>Full-Stack</p>
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
                  <i className="ri-linkedin-box-fill one"></i>
                  <i className="ri-github-fill two"></i>
                  <i className="ri-facebook-circle-fill three"></i>
                  <i className="ri-slack-line four"></i>
                </div>
              </div>
              <div className="info">
                <h3>Member Name</h3>
                <p>Full-Stack</p>
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
                  <i className="ri-linkedin-box-fill one"></i>
                  <i className="ri-github-fill two"></i>
                  <i className="ri-facebook-circle-fill three"></i>
                  <i className="ri-slack-line four"></i>
                </div>
              </div>
              <div className="info">
                <h3>Member Name</h3>
                <p>Full-Stack</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
