"use client";
import React, { useContext, useState } from "react";
import { AuthContext } from "@/app/context/Auth";
import useResource from "@/app/hooks/useResource";

export default function GabMarket() {
  const { tokens } = useContext(AuthContext);
    const baseUrl = 'http://127.0.0.1:8000/reports/';
    const { createResource } = useResource(baseUrl);

  const [formData, setFormData] = useState({
    description: "",
    reasons: "",
    funding_required: "",
    location: "",
    termsAccepted: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = {
      owner: tokens.user.id, // Hardcoded owner ID
      description: formData.description,
      reasons: formData.reasons,
      funding_required: formData.funding_required,
      location: formData.location,
      termsAccepted: formData.termsAccepted,
    };

    
    await createResource(data);

    setIsSubmitting(false);
    setFormData({
      description: "",
      reasons: "",
      funding_required: "",
      location: "",
      termsAccepted: false,
    });
  };

  if (!tokens) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-pink-100">
        <div className="flex flex-col items-stretch w-full max-w-4xl bg-white rounded-full shadow-lg md:flex-row">
          <div className="flex flex-col justify-center w-full p-8 bg-blue-200 rounded-l-full md:w-1/2">
            <h1 className="mb-2 text-3xl font-bold text-center text-gray-800 md:text-left">
              Error: No Token Found
            </h1>
            <p className="mb-6 text-center text-gray-600 md:text-left">
              Please log in to add a new idea.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-pink-100">
      <div className="flex flex-col md:flex-row items-stretch bg-white rounded-3xl shadow-lg max-w-4xl w-full">
        <div className="md:w-1/2 w-full bg-blue-200 p-8 rounded-3xl flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center md:text-left">
            Get Started
          </h1>
          <p className="text-gray-600 mb-6 text-center md:text-left">
            Lets make something cool
          </p>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center md:text-left">
            Get started with a free quotation
          </h2>
        </div>

        <div className="md:w-1/2 w-full p-8">
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-blue-200"
                id="description"
                name="description"
                rows="3"
                placeholder="Enter your description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="reasons"
              >
                Reasons
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-blue-200"
                id="reasons"
                name="reasons"
                rows="3"
                placeholder="Enter your reasons"
                value={formData.reasons}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="funding_required"
              >
                Funding Required
              </label>
              <input
                className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-blue-200"
                id="funding_required"
                name="funding_required"
                type="number"
                placeholder="Enter the required funding"
                value={formData.funding_required}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="location"
              >
                Location
              </label>
              <input
                className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-blue-200"
                id="location"
                name="location"
                type="text"
                placeholder="Enter your location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="mb-6">
              <label className="inline-flex items-center text-gray-700">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                />
                <span className="ml-2">I accept the Terms of Service</span>
              </label>
            </div>

            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-blue-100 to-pink-100 text-black font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 
              ${
                isSubmitting
                  ? "animate-bounce"
                  : "hover:from-pink-100 hover:to-blue-100"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit your request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
