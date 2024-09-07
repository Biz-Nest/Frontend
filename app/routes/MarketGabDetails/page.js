"use client";
import { AuthContext } from "@/app/context/Auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import { useToast, Spinner } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faFacebook,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import "./page.css";

function MarketGabDetails() {
  const { tokens } = useContext(AuthContext);
  const [report, setReport] = useState(null);
  const [nearbyReports, setNearbyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const toast = useToast();

  useEffect(() => {
    if (!tokens || !tokens.access) {
      toast({
        title: "Not Signed In",
        description: "You need to sign in to access this page.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      router.push("/routes/Login");
      return;
    }

    fetchReport();
  }, [id, tokens, router, toast]);

  const fetchReport = async () => {
    if (!id || !tokens || !tokens.access) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/${id}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch the report");
      }

      const data = await response.json();
      setReport(data);
      fetchNearbyReports(data.location); // Fetch nearby reports with the same location
    } catch (error) {
      console.error("Error fetching report:", error);
      toast({
        title: "Error Fetching Report",
        description: "There was an issue fetching the report data.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyReports = async (location) => {
    if (!tokens || !tokens.access) return;

    try {
      // Fetch all reports
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokens.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const allReports = await response.json();

      // Filter reports based on the same location
      const filteredReports = allReports.filter(
        (report) => report.location === location
      );
      setNearbyReports(filteredReports);
    } catch (error) {
      console.error("Error fetching nearby reports:", error);
      toast({
        title: "Error Fetching Nearby Reports",
        description: "There was an issue fetching nearby report data.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner
          color="red.500"
          size="xl"
          style={{
            width: "100px", // Adjust size as needed
            height: "100px", // Adjust size as needed
            borderWidth: "12px", // Make the spinner thicker
          }}
        />
      </div>
    );
  }

  if (!report) {
    return <div>No report data available</div>;
  }

  // Ensure tokens is not null and user is defined
  const username = tokens?.user?.username || "No Owner Information Available";

  return (
    <div className="marketgab-details dark:bg-gray-800">
      <div className="container">
        <div className="content dark:text-white">
          {/* Details */}
          <section className="full-details">
            <h2 className="">Full Details</h2>
            <div className="info">
              <div className="row">
                <span>Title</span>
                <p>{report.title || "No Title Available"}</p>
              </div>

              {/* <div className="row">
                <span>Description</span>
                <p>{report.description || "No Description Available"}</p>
              </div> */}

              {/* <div className="row">
                <span>Reason</span>
                <p>{report.reasons || "No Reasons Available"}</p>
              </div> */}

              <div className="row">
                <span>Funding Required</span>
                <p>
                  {report.funding_required ||
                    "No Funding Information Available"}
                </p>
              </div>

              <div className="row">
                <span>Location</span>
                <p>{report.location || "No Location Information Available"}</p>
              </div>

              <div className="row">
                <span>Owner</span>
                <p>{username}</p>
              </div>
            </div>

            <div className="social">
              <h2>Contact Owner</h2>
              <div className="social-links">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i class="ri-twitter-fill twitter dark:bg-white"></i>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i class="ri-facebook-circle-fill facebook dark:bg-white"></i>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i class="ri-linkedin-box-fill linkedin dark:bg-white"></i>
              </a>
              </div>
            </div>
          </section>

          {/* Nearby Reports Section */}
          <section className="nearby-markets">
            <div className="description">
              <h2>Description</h2>
              <p>{ report.description || "Not Found!"}</p>
            </div>

            <div className="reason">
              <h2>Reason</h2>
              <p>{ report.reasons || "Not Found!"}</p>
            </div>

            <div className="nearby-section">
              <h2 className="">Nearby Reports</h2>
              {nearbyReports.length === 0 ? (
                <div>No nearby reports available</div>
              ) : (
                <div className="nearby-reports">
                  {nearbyReports.map((nearbyReport) => (
                    <div
                      key={nearbyReport.id}
                      className="report dark:text-[#333]"
                    >
                      <p><strong>Title:</strong>{nearbyReport.title}</p>
                      <p><strong>Funding:</strong>{nearbyReport.funding_required}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default MarketGabDetails;
