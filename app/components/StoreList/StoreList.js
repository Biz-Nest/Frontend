import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/Auth";
import { useToast,Spinner } from "@chakra-ui/react";  // Add Toast for user feedback
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";  // Import useRouter for navigation
import Image from "next/image";
import "./StoreList.css";


function StoreList() {
  const { tokens } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();  // Initialize toast
  const router = useRouter();  // Initialize router

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/`, {
          method: "GET",
          headers: {
            Authorization: tokens?.access ? `Bearer ${tokens.access}` : undefined,  // Check if the user is authenticated
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStores(data);
        } else {
          setError(`Error fetching stores: ${response.statusText}`);
        }
      } catch (err) {
        setError(`Error fetching stores: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [tokens]);

  if (loading) {
    return <div style={{
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
  </div>;
  }

  // Display error if any
  if (error) {
    return <div>{error}</div>;
  }

  // Handle store click and views logic
  const handleStoreClick = async (storeId) => {
    if (!tokens?.access) {
      toast({
        title: "Authentication required",
        description: "Please log in to view store details.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Optimistic UI update: increment views locally
      setStores((prevStores) =>
        prevStores.map((store) =>
          store.id === storeId ? { ...store, views: (store.views || 0) + 1 } : store
        )
      );

      // Fetch the store details to get the current views count
      const storeResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${storeId}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokens.access}`,
        },
      });

      if (!storeResponse.ok) {
        throw new Error("Failed to fetch store details");
      }

      const storeData = await storeResponse.json();
      const updatedViews = storeData.views + 1;

      // Update views on the server
      const patchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${storeId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${tokens.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ views: updatedViews }),
      });

      if (!patchResponse.ok) {
        throw new Error("Failed to update views");
      }

      // Navigate to the store's product page
      router.push(`/routes/product?id=${storeId}`);
    } catch (err) {
      console.error("Error updating views:", err);
      setError("Failed to update views. Please try again.");
      // Revert the optimistic UI update in case of error
      setStores((prevStores) =>
        prevStores.map((store) =>
          store.id === storeId ? { ...store, views: (store.views || 0) - 1 } : store
        )
      );
    }
  };

  return (
    <>
      {/* Start Landing */}
      <section className="dark:bg-gray-800">
        <div className="container grid px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white">
              Discover the Best Local Stores with Us
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              Explore a curated selection of stores offering unique products,
              all in one place. Whether you are looking for the latest trends,
              artisanal goods, or everyday essentials, we have got you covered. 
              Shop with confidence, knowing you are supporting local businesses.
            </p>
            <div>
              <Link
                href="#stores-section"
                className="w-[200px] inline-flex items-center justify-center py-3 text-base font-medium text-center text-gray-900 transition-transform transform bg-[cadetblue] !font-bold text-white rounded-lg shadow-md hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700"
              >
                Explore Stores
              </Link>
            </div>

            {!tokens?.access && (
              <div>
                <Link
                  href="/login"
                  className="w-[200px] mt-[10px] inline-flex items-center justify-center py-3 text-base font-medium text-center text-white !font-bold transition-transform transform bg-blue-500 rounded-lg shadow-md hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700"
                >
                  Log In to Add Store
                </Link>
              </div>
            )}

            {tokens?.access && (
              <div>
                <Link
                  href="/routes/CreateStore/"
                  className="w-[200px] mt-[10px] inline-flex items-center justify-center py-3 text-base font-medium text-center text-white !font-bold transition-transform transform bg-blue-500 rounded-lg shadow-md hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700"
                >
                  Add Store
                </Link>
              </div>
            )}
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex overflow-hidden rounded-[50%]">
            <Image
              width={1000}
              height={1000}
              src="/images/store_landing.png"
              alt="mockup"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>
      {/* End Landing */}
      <div
        id="stores-section"
        className="flex items-center justify-center min-h-screen"
      >
        <div className="container mt-20 mb-20 store-list">
          {stores.length > 0 ? (
            stores.map((store) => (
              <div
                key={store.id}
                onClick={() => handleStoreClick(store.id)}  // Handle click
                className="dark:!bg-[radial-gradient(circle,_rgba(24,_32,_45,_1)_20%,_rgba(10,_15,_20,_1)_80%)] cursor-pointer block rounded-lg bg-white shadow-lg hover:shadow-xl dark:bg-surface-dark overflow-hidden flex flex-col"
              >
                <div className="relative">
                  <Image
                    className="object-cover w-full h-[250px]"
                    src={
                      store.logo ||
                      "https://tecdn.b-cdn.net/img/new/standard/nature/184.jpg"
                    }
                    alt={`${store.name} logo`}
                    width={500}
                    height={300}
                  />
                </div>
                <div className="flex-1 p-6 text-black text-surface dark:text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-black dark:text-white">{store.name}</h2>
                    </div>
                    <div className="flex justify-center content-center gap-[10px] px-3 py-1 text-xs font-semibold text-gray-900 bg-gray-100 rounded-full">
                    <i className="ri-eye-line text-[15px]"></i> {store.views}
                    </div>
                  </div>
                  <div className="dark:text-[#ddd] mt-4 text-base text-gray-700">
                    {store.description.length > 75
                      ? store.description.substring(0, 40) + "..."
                      : store.description}
                  </div>
                </div>
                <div className="flex justify-center gap-[20px] px-6 pb-4">
                  {store.social_links?.facebook && (
                    <a
                      href={store.social_links.facebook}
                      className="text-blue-500"
                    >
                      <FaFacebook size={24} />
                    </a>
                  )}
                  {store.social_links?.twitter && (
                    <a
                      href={store.social_links.twitter}
                      className="text-blue-400"
                    >
                      <FaTwitter size={24} />
                    </a>
                  )}
                  {store.social_links?.instagram && (
                    <a
                      href={store.social_links.instagram}
                      className="text-pink-500"
                    >
                      <FaInstagram size={24} />
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400">No stores available</div>
          )}
        </div>
      </div>
    </>
  );
}

export default StoreList;
