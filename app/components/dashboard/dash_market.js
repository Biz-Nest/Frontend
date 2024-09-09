"use client";
import useSWR from "swr";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Spinner } from "@chakra-ui/react";

export default function DashMarket({ tokens }) {
    // Fetcher function for SWR
    const fetcher = (url) => fetch(url).then((response) => response.json());

    // Fetch reports data
    const { data: reportsData, error: reportsError, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/reports/`, fetcher);

    const router = useRouter();

    const [selectedReport, setSelectedReport] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [file, setFile] = useState(null);

    // Handle loading and error states for reports
    if (!reportsData) return <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        width: '100%',
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
      </div>;
    if (reportsError) return <div className="p-8 container">Error loading reports.</div>;

    // Filter reports based on the user's ID
    const userReports = reportsData.filter(report => report.owner === tokens.user.id);

    const handleReportClick = (report) => {
        setSelectedReport(report);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedReport(null);
        setFile(null);
    };

    const handleDelete = async () => {
        if (!selectedReport) return;
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/${selectedReport.id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${tokens.access}`,
                },
            });

            // Update the report list after deletion
            const updatedReports = userReports.filter(report => report.id !== selectedReport.id);
            mutate(updatedReports, false); // Optimistically update the state

            handleClosePopup();
        } catch (error) {
            console.error('Error deleting report:', error);
        }
    };

    const handleUpdate = async () => {
        if (!selectedReport) return;
        try {
            const formData = new FormData();
            formData.append('title', selectedReport.title);
            formData.append('description', selectedReport.description);
            formData.append('reasons', selectedReport.reasons);
            formData.append('funding_required', selectedReport.funding_required);
            formData.append('location', selectedReport.location);
            if (file) formData.append('report_image', file);

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/${selectedReport.id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${tokens.access}`,
                },
                body: formData,
            });

            // Update the report list after update
            const updatedReports = userReports.map(report =>
                report.id === selectedReport.id ? { ...selectedReport } : report
            );
            mutate(updatedReports, false); // Optimistically update the state

            handleClosePopup();
        } catch (error) {
            console.error('Error updating report:', error);
        }
    };

    if (userReports.length === 0) {
        return (
            <div className="container">
                <div className="p-8 bg-gray-100 flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">You don&apos;t have any reports yet.</h1>
                    <button
                        onClick={() => router.push('/routes/MarketGap')}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
                    >
                        Add Report
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="p-8 bg-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Market Gaps</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userReports.map((report) => (
                        <div
                            key={report.id}
                            className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 cursor-pointer hover:bg-gray-50 transition duration-300"
                            onClick={() => handleReportClick(report)}
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Title: {report.title || "No title available"}</h2>
                            <p className="text-gray-600 mb-2">Description: {report.description || "No description available"}</p>
                            <p className="text-gray-600 mb-2">Reasons: {report.reasons || "Not specified"}</p>
                            <p className="text-gray-600 mb-2">Funding Required: ${parseFloat(report.funding_required).toFixed(2)}</p>
                            <p className="text-gray-600 mb-2">Location: {report.location || "Not specified"}</p>
                        </div>
                    ))}
                </div>
            </div>

            {isPopupOpen && selectedReport && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
                        <button
                            onClick={handleClosePopup}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition duration-300"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Report</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700">Title:</label>
                                <input
                                    type="text"
                                    value={selectedReport.title}
                                    onChange={(e) => setSelectedReport({ ...selectedReport, title: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Description:</label>
                                <textarea
                                    value={selectedReport.description}
                                    onChange={(e) => setSelectedReport({ ...selectedReport, description: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Reasons:</label>
                                <input
                                    type="text"
                                    value={selectedReport.reasons}
                                    onChange={(e) => setSelectedReport({ ...selectedReport, reasons: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Funding Required:</label>
                                <input
                                    type="number"
                                    value={selectedReport.funding_required}
                                    onChange={(e) => setSelectedReport({ ...selectedReport, funding_required: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Location:</label>
                                <input
                                    type="text"
                                    value={selectedReport.location}
                                    onChange={(e) => setSelectedReport({ ...selectedReport, location: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Report Image:</label>
                                <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    className="mt-1 block w-full"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
                            >
                                Delete
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
