"use client";
import useSWR from "swr";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@chakra-ui/react";

export default function DashProducts({ tokens }) {
  const fetcher = (url) => fetch(url).then((response) => response.json());

  // Fetch user's stores
  const { data: storesData, error: storesError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/store/`,
    fetcher
  );

  // Fetch all products
  const {
    data: productsData,
    error: productsError,
    mutate,
  } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/product/`, fetcher);

  const router = useRouter();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [file, setFile] = useState(null);

  // Handle loading and error states for stores
  if (!storesData)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          width: "100%",
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
  if (storesError)
    return <div className="p-8 container">Error loading stores.</div>;

  // Handle loading and error states for products
  if (!productsData)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          width: "100%",
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
  if (productsError)
    return <div className="p-8 bg-gray-100">Error loading products.</div>;

  // Filter stores based on the user's ID
  const userStoreIds = storesData
    .filter((store) => store.owner === tokens.user.id)
    .map((store) => store.id);

  // Filter products based on the user's store IDs
  let userProducts = productsData.filter((product) =>
    userStoreIds.includes(product.store)
  );

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedProduct(null);
    setFile(null);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${selectedProduct.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        }
      );

      // Update the product list after deletion
      userProducts = userProducts.filter(
        (product) => product.id !== selectedProduct.id
      );
      mutate(userProducts, false); // Optimistically update the state

      handleClosePopup();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedProduct) return;
    try {
      const formData = new FormData();
      formData.append("name", selectedProduct.name);
      formData.append("price", selectedProduct.price);
      formData.append("description", selectedProduct.description);
      if (file) formData.append("product_image", file);

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${selectedProduct.id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
          body: formData,
        }
      );

      // Update the product list after update
      userProducts = userProducts.map((product) =>
        product.id === selectedProduct.id ? { ...selectedProduct } : product
      );
      mutate(userProducts, false); // Optimistically update the state

      handleClosePopup();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (userProducts.length === 0) {
    return (
      <div className="container">
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">
            You don&apos;t have any products yet.
          </h1>
          <button
            onClick={() => router.push("/routes/CreateProduct")}
            className="px-6 py-3 text-white transition duration-300 bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600"
          >
            Add Product
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="p-8">
        <h2 className="main-title ondashboard dark:text-white">
          Your Products <span></span>
        </h2>
        <button
          onClick={() => router.push("/routes/CreateProduct")}
          className="dashboard-button"
        >
          Add More Products
        </button>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {userProducts.map((product) => (
            <div
              key={product.id}
              className="dark:!bg-[radial-gradient(circle,_rgba(24,_32,_45,_1)_20%,_rgba(10,_15,_20,_1)_80%)] dark:!border-[transparent] p-6 transition duration-300 bg-white border border-gray-200 rounded-lg shadow-lg cursor-pointer hover:bg-gray-50"
              onClick={() => handleProductClick(product)}
            >
              {product.product_image && (
                <Image
                  width={1000}
                  height={1000}
                  src={product.product_image}
                  alt={`${product.name} image`}
                  className="object-cover w-full h-48 mb-4 rounded-[10px]"
                />
              )}
              <h2 className="dark:text-white mb-2 text-2xl font-bold text-gray-800">
                {product.name}
              </h2>
              <p className="dark:text-[#ddd] text-gray-600">
                Price: ${parseFloat(product.price).toFixed(2)}
              </p>
              <p className="dark:text-[#ddd] mb-4 text-gray-600">
                Description: {product.description || "No description available"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {isPopupOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="relative w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
            <button
              onClick={handleClosePopup}
              className="absolute text-gray-500 transition duration-300 top-2 right-2 hover:text-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
            <h2 className="mb-4 text-2xl font-bold text-gray-800">
              Edit Product
            </h2>
            <div className="mb-4">
              {/* {selectedProduct.product_image && (
                <Image
                  width={300}
                  height={200}
                  src={selectedProduct.product_image}
                  alt={`${selectedProduct.name} image`}
                  className="object-cover w-full h-48 mb-4"
                />
              )} */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700">Name:</label>
                  <input
                    type="text"
                    value={selectedProduct.name}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        name: e.target.value,
                      })
                    }
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Price:</label>
                  <input
                    type="number"
                    value={selectedProduct.price}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        price: e.target.value,
                      })
                    }
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Description:</label>
                  <textarea
                    value={selectedProduct.description}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        description: e.target.value,
                      })
                    }
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Product Image:</label>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="block w-full mt-1"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white transition duration-300 bg-red-500 rounded-lg shadow-lg hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 text-white transition duration-300 bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600"
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
