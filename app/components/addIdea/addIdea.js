"use client";
import { AuthContext } from "@/app/context/Auth";
import useResource from "@/app/hooks/useResource";
import React, { useContext, useState } from "react";

function AddIdea() {
  const { tokens } = useContext(AuthContext);
  const { createResource } = useResource();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "TECH", // Default value
    cost: "",
    location: "",
    expenses: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      owner: tokens.user.id,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      cost: formData.cost,
      location: formData.location,
      expenses: formData.expenses,
    };
    const url = "http://localhost:8000/idea/";
    createResource(url, data, tokens);
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
      <div className="flex flex-col items-stretch w-full max-w-4xl bg-white rounded-full shadow-lg md:flex-row">
        {/* Left Column */}
        <div className="flex flex-col justify-center w-full p-8 bg-blue-200 rounded-l-full md:w-1/2">
          <h1 className="mb-2 text-3xl font-bold text-center text-gray-800 md:text-left">
            Add New Idea
          </h1>
          <p className="mb-6 text-center text-gray-600 md:text-left">
            Let's make something cool
          </p>
          <h2 className="mb-4 text-xl font-semibold text-center text-gray-800 md:text-left">
            Get started by adding your idea
          </h2>
        </div>

        {/* Right Column with Form */}
        <div className="w-full p-8 md:w-1/2">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="w-full px-4 py-3 text-gray-700 border rounded-full focus:outline-none focus:ring focus:ring-blue-200"
                id="name"
                type="text"
                placeholder="Idea Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
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
                className="w-full px-4 py-3 text-gray-700 border rounded-full focus:outline-none focus:ring focus:ring-blue-200"
                id="description"
                placeholder="Idea Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="category"
              >
                Category
              </label>
              <select
                className="w-full px-4 py-3 text-gray-700 border rounded-full focus:outline-none focus:ring focus:ring-blue-200"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="TECH">Tech</option>
                <option value="FIN">Finance</option>
                <option value="EDU">Education</option>
                <option value="HEALTH">Health</option>
                <option value="AGR">Agriculture</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="cost"
              >
                Cost
              </label>
              <input
                className="w-full px-4 py-3 text-gray-700 border rounded-full focus:outline-none focus:ring focus:ring-blue-200"
                id="cost"
                type="number"
                placeholder="Estimated Cost"
                name="cost"
                value={formData.cost}
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
                className="w-full px-4 py-3 text-gray-700 border rounded-full focus:outline-none focus:ring focus:ring-blue-200"
                id="location"
                type="text"
                placeholder="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="expenses"
              >
                Expenses
              </label>
              <input
                className="w-full px-4 py-3 text-gray-700 border rounded-full focus:outline-none focus:ring focus:ring-blue-200"
                id="expenses"
                type="number"
                placeholder="Estimated Expenses"
                name="expenses"
                value={formData.expenses}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                className="w-full px-4 py-2 font-semibold text-black rounded-full bg-gradient-to-r from-blue-100 to-pink-100 hover:from-pink-100 hover:to-blue-100 focus:outline-none focus:ring focus:ring-blue-200"
                type="submit"
              >
                Add Idea
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddIdea;
