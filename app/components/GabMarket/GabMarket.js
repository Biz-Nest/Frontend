"use client";
import React, { useContext, useState } from "react";
import { AuthContext } from "@/app/context/Auth";
import useResource from "@/app/hooks/useResource";

export default function GabMarket() {
  const { tokens } = useContext(AuthContext);
  const baseUrl = 'http://127.0.0.1:8000/reports/';
  const { createResource } = useResource(baseUrl);

  const [formData, setFormData] = useState({
    title: "", // New field
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
      owner: tokens.user.id, 
      title: formData.title, // Include the title field
      description: formData.description,
      reasons: formData.reasons,
      funding_required: formData.funding_required,
      location: formData.location,
      termsAccepted: formData.termsAccepted,
    };

    await createResource(data);

    setIsSubmitting(false);
    setFormData({
      title: "", // Reset title field
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
      <div className="flex flex-col items-stretch w-full max-w-4xl bg-white shadow-lg md:flex-row rounded-3xl">
        <div className="flex flex-col justify-center w-full p-8 bg-blue-200 md:w-1/2 rounded-3xl">
          <h1 className="mb-2 text-3xl font-bold text-center text-gray-800 md:text-left">
            Get Started
          </h1>
          <p className="mb-6 text-center text-gray-600 md:text-left">
            Lets make something cool
          </p>
          <h2 className="mb-4 text-xl font-semibold text-center text-gray-800 md:text-left">
            Get started with a free quotation
          </h2>
        </div>

        <div className="w-full p-8 md:w-1/2">
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="title"
              >
                Title
              </label>
              <input
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                id="title"
                name="title"
                type="text"
                placeholder="Enter the title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
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
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="reasons"
              >
                Reasons
              </label>
              <textarea
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
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
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="funding_required"
              >
                Funding Required
              </label>
              <input
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
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
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="location"
              >
                Location
              </label>
              <input
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
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
