"use client";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/Auth";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Link from "next/link";

function StoreList() {
  const { tokens } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8001/store/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokens.access}`,
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
        <section className="bg-white dark:bg-gray-900">
          <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
            <div className="mr-auto place-self-center lg:col-span-7">
              <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
              Discover the Best Local Stores with Us
              </h1>
              <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              Explore a curated selection of stores offering unique products, all in one place. Whether you are looking for the latest trends, artisanal goods, or everyday essentials, 
              we have got you covered. Shop with confidence, knowing you are supporting local businesses.
              </p>
              <Link
                href="/StoreList"
                className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                // className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
              >
                Explore Our Local Stores
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
              </Link>
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              >
                Add Your Own Store
              </a>
            </div>
            <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
              <img
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/phone-mockup.png"
                alt="mockup"
              />
            </div>
          </div>
        </section>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300">
        <div className="store-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center items-center p-4">
          {stores.map((store) => (
            <div
              key={store.id}
              className="block rounded-lg bg-white shadow-lg hover:shadow-xl dark:bg-surface-dark overflow-hidden h-[600px] flex flex-col"
            >
              <div className="relative">
                <img
                  className="w-full h-72 object-cover"
                  src={
                    store.logo ||
                    "https://tecdn.b-cdn.net/img/new/standard/nature/184.jpg"
                  }
                  alt={`${store.name} logo`}
                  width={500}
                  height={300}
                />
              </div>
              <div className="p-6 text-surface dark:text-white flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{store.name}</h2>
                  </div>
                  <div className="bg-gray-100 text-gray-900 rounded-full px-3 py-1 text-xs font-semibold">
                    {store.views}
                  </div>
                </div>
                <div className="text-gray-700 text-base mt-4 max-h-14 overflow-y-auto">
                  {store.description}
                </div>
              </div>
              <div className="px-6 pt-4 pb-6 flex justify-between">
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
          ))}
        </div>
      </div>
    </>
  );
}

export default StoreList;
