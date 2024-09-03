'use client';
import { AuthContext } from '@/app/context/Auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useState, useEffect } from 'react';
import { useToast, Spinner } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';

function MarketGabDetails() {
  const { tokens } = useContext(AuthContext);
  const [report, setReport] = useState(null);
  const [nearbyReports, setNearbyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const toast = useToast();

  useEffect(() => {
    if (!tokens || !tokens.access) {
      toast({
        title: 'Not Signed In',
        description: 'You need to sign in to access this page.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      router.push('/');
      return;
    }

    fetchReport();
  }, [id, tokens, router, toast]);

  const fetchReport = async () => {
    if (!id || !tokens || !tokens.access) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/reports/${id}/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokens.access}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch the report');
      }

      const data = await response.json();
      setReport(data);
      fetchNearbyReports(data.location); // Fetch nearby reports with the same location
    } catch (error) {
      console.error('Error fetching report:', error);
      toast({
        title: 'Error Fetching Report',
        description: 'There was an issue fetching the report data.',
        status: 'error',
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
      const response = await fetch(`http://127.0.0.1:8000/reports/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokens.access}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const allReports = await response.json();

      // Filter reports based on the same location
      const filteredReports = allReports.filter(report => report.location === location);
      setNearbyReports(filteredReports);
    } catch (error) {
      console.error('Error fetching nearby reports:', error);
      toast({
        title: 'Error Fetching Nearby Reports',
        description: 'There was an issue fetching nearby report data.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Spinner
          color='red.500'
          size='xl'
          style={{
            width: '100px',  // Adjust size as needed
            height: '100px', // Adjust size as needed
            borderWidth: '12px', // Make the spinner thicker
          }}
        />
      </div>
    );
  }

  if (!report) {
    return <div>No report data available</div>;
  }

  // Ensure tokens is not null and user is defined
  const username = tokens?.user?.username || 'No Owner Information Available';

  return (
    <>
      <div className="flex items-center justify-center h-screen dark:bg-gray-800">
        <section className="grid w-full max-w-5xl gap-6 p-4 mx-auto md:grid-cols-2 md:p-8">
          <div className="p-6 bg-white shadow rounded-2xl dark:bg-gray-900">
            <dl className="space-y-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Title:
              </dt>
              <dd className="text-3xl font-light md:text-4xl dark:text-white">
                {report.title || 'No Title Available'}
              </dd>

              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Description:
              </dt>
              <dd className="text-xl font-light md:text-2xl dark:text-white">
                {report.description || 'No Description Available'}
              </dd>

              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Reasons:
              </dt>
              <dd className="text-xl font-light md:text-2xl dark:text-white">
                {report.reasons || 'No Reasons Available'}
              </dd>

              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Funding Required:
              </dt>
              <dd className="text-2xl font-light md:text-3xl dark:text-white">
                {report.funding_required || 'No Funding Information Available'}
              </dd>

              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Location:
              </dt>
              <dd className="text-xl font-light md:text-2xl dark:text-white">
                {report.location || 'No Location Information Available'}
              </dd>

              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Owner:
              </dt>
              <dd className="text-xl font-light md:text-2xl dark:text-white">
                {username}
              </dd>
            </dl>

            <div className="flex mt-6 space-x-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} className="text-2xl text-blue-400" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebook} className="text-2xl text-blue-600" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} className="text-2xl text-blue-700" />
              </a>
            </div>
          </div>
        </section>

        {/* Nearby Reports Section */}
        <section className="w-full max-w-5xl p-4 mx-auto">
          <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">Nearby Reports</h2>
          {nearbyReports.length === 0 ? (
            <div>No nearby reports available</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {nearbyReports.map((nearbyReport) => (
                <div key={nearbyReport.id} className="p-4 bg-white shadow rounded-2xl dark:bg-gray-900">
                  <h3 className="text-xl font-semibold text-black dark:text-white">{nearbyReport.title}</h3>
                  <p className='text-black dark:text-white'>{nearbyReport.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default MarketGabDetails;
