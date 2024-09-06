"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/Auth";
import { useToast } from "@chakra-ui/react"; // Import useToast from Chakra UI

export default function AddStore() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { tokens } = useContext(AuthContext);
  const router = useRouter();
  const toast = useToast(); // Initialize useToast
  const [formData, setFormData] = useState({
    name: "",
    logo: null,
    description: "",
    social_links: {
      facebook: "",
      twitter: "",
      instagram: "",
    },
    views: 0,
    owner: tokens.user.id,
  });
  const [file, setFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSocialLinksChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      social_links: {
        ...prevData.social_links,
        [name]: value,
      },
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const submitData = new FormData();
    submitData.append("owner", formData.owner);
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("views", formData.views.toString());
    if (file) {
      submitData.append("logo", file);
    }
    submitData.append("social_links", JSON.stringify(formData.social_links));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokens.access}`,
        },
        body: submitData,
      });

      if (response.ok) {
        toast({
          title: "Store added successfully.",
          description: "Your store has been added!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.push("/routes/Store_List");
      } else {
        const errorData = await response.json();
        console.error("Error adding store:", errorData);
        toast({
          title: "Error adding store.",
          description: errorData.detail || "An error occurred while adding the store.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error adding store:", error);
      toast({
        title: "Error adding store.",
        description: "An unexpected error occurred. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false); // Reset submission status
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-pink-100">
      <div className="flex flex-col items-stretch w-full max-w-4xl bg-white shadow-lg md:flex-row rounded-3xl">
        <div className="flex flex-col justify-center w-full p-8 bg-blue-200 md:w-1/2 rounded-3xl">
          <h1 className="mb-2 text-3xl font-bold text-center text-gray-800 md:text-left">
            Add Store
          </h1>
          <p className="mb-6 text-center text-gray-600 md:text-left">
            Start by providing your store details
          </p>
          <h2 className="mb-4 text-xl font-semibold text-center text-gray-800 md:text-left">
            Add your store information to get started
          </h2>
        </div>

        <div className="w-full p-8 md:w-1/2">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Enter store name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="description">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Enter store description"
                rows="3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="logo">
                Logo
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="facebook">
                Facebook URL
              </label>
              <input
                type="text"
                name="facebook"
                value={formData.social_links.facebook}
                onChange={handleSocialLinksChange}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Enter Facebook URL"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="twitter">
                Twitter URL
              </label>
              <input
                type="text"
                name="twitter"
                value={formData.social_links.twitter}
                onChange={handleSocialLinksChange}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Enter Twitter URL"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="instagram">
                Instagram URL
              </label>
              <input
                type="text"
                name="instagram"
                value={formData.social_links.instagram}
                onChange={handleSocialLinksChange}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Enter Instagram URL"
              />
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
              {isSubmitting ? "Submitting..." : "Add Store"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
