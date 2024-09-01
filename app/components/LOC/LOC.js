import React from "react";

export default function LOC() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-pink-100">
      <div className="flex flex-col md:flex-row items-stretch bg-white rounded-lg shadow-lg max-w-4xl w-full">
        {/* Left Column with Full Background */}
        <div className="md:w-1/2 w-full bg-blue-200 p-8 rounded-l-lg flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center md:text-left">
            Get Started
          </h1>
          <p className="text-gray-600 mb-6 text-center md:text-left">
            Let's make something cool
          </p>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center md:text-left">
            Get started with a free quotation
          </h2>
        </div>

        {/* Right Column with Form */}
        <div className="md:w-1/2 w-full p-8">
          <form>
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
                rows="3"
                placeholder="Enter your description"
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
                rows="3"
                placeholder="Enter your reasons"
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
                type="number"
                placeholder="Enter the required funding"
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
                type="text"
                placeholder="Enter your location"
              />
            </div>

            <div className="mb-6">
              <label className="inline-flex items-center text-gray-700">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2">I accept the Terms of Service</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-100 to-pink-100 text-black font-semibold py-2 px-4 rounded-lg hover:from-pink-100 hover:to-blue-100 focus:outline-none focus:ring focus:ring-blue-200"
            >
              Submit your request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
