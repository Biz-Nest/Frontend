"use client";
import useSWR from "swr";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DashStore({ tokens, onAddStore }) {
    const fetcher = (url) => fetch(url).then((response) => response.json());
    const { data, error } = useSWR("http://localhost:8000/store/", fetcher);
    const router = useRouter();
    const [selectedStore, setSelectedStore] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [userStores, setUserStores] = useState([]);

    useEffect(() => {
        if (data) {
            const filteredStores = data.filter(store => store.owner === tokens.user.id);
            setUserStores(filteredStores);
            console.log(data[0].logo)
        }
    }, [data, tokens.user.id]);

    if (!data) return <div className="p-8 bg-gray-100">Loading...</div>;
    if (error) return <div className="p-8 bg-gray-100">Error loading stores.</div>;

    if (!userStores.length) {
        return (
            <div className="container">
                <div className="p-8 bg-gray-100 flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">You don&apos;t have any stores yet.</h1>
                    <button
                        onClick={() => router.push('/routes/addIdea/')}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
                    >
                        Add Store
                    </button>
                </div>
            </div>
        );
    }

    const handleStoreClick = (store) => {
        setSelectedStore(store);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedStore(null);
        setFile(null);
    };

    const handleDelete = async () => {
        if (!selectedStore) return;
        try {
            await fetch(`http://localhost:8000/store/${selectedStore.id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${tokens.access}`,
                },
            });
            setUserStores(prevStores => prevStores.filter(store => store.id !== selectedStore.id));
            setIsPopupOpen(false);
        } catch (error) {
            console.error('Error deleting store:', error);
        }
    };

    const handleUpdate = async () => {
        if (!selectedStore) return;
        try {
            const formData = new FormData();
            formData.append('name', selectedStore.name);
            formData.append('description', selectedStore.description);
            formData.append('views', selectedStore.views.toString()); // Convert to string
            if (file) formData.append('logo', file);
            Object.keys(selectedStore.social_links).forEach(key => {
                formData.append(`social_links[${key}]`, selectedStore.social_links[key] || '');
            });

            await fetch(`http://localhost:8000/store/${selectedStore.id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${tokens.access}`,
                },
                body: formData,
            });

            setUserStores(prevStores => 
                prevStores.map(store =>
                    store.id === selectedStore.id ? { ...store, ...selectedStore } : store
                )
            );
            
            setIsPopupOpen(false);
        } catch (error) {
            console.error('Error updating store:', error);
        }
    };

    return (
        <div className="container">
            <div className="p-8 bg-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Stores</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userStores.map((store) => (
                        <div
                            key={store.id}
                            className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 cursor-pointer hover:bg-gray-50 transition duration-300"
                            onClick={() => handleStoreClick(store)}
                        >
                            <div className="flex flex-col items-center">
                                {/* Uncomment to display store logo */}
                                {store.logo && (
                                    <Image
                                        width={200}
                                        height={200}
                                        src={store.logo}
                                        alt={`${store.name} logo`}
                                        className="w-32 h-32 mb-4 rounded-full border border-gray-300"
                                    />
                                )}
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">{store.name}</h2>
                                <p className="text-gray-600 mb-2">{store.description || "No description available"}</p>
                                <p className="text-gray-600 mb-4">Views: {store.views}</p>

                                {store.social_links && (
                                    <div className="flex space-x-4 mt-2">
                                        {store.social_links.facebook && (
                                            <a
                                                href={store.social_links.facebook}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:text-blue-600 transition duration-300"
                                            >
                                                <i className="fab fa-facebook-f"></i>
                                            </a>
                                        )}
                                        {store.social_links.twitter && (
                                            <a
                                                href={store.social_links.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-500 transition duration-300"
                                            >
                                                <i className="fab fa-twitter"></i>
                                            </a>
                                        )}
                                        {store.social_links.instagram && (
                                            <a
                                                href={store.social_links.instagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-pink-600 hover:text-pink-700 transition duration-300"
                                            >
                                                <i className="fab fa-instagram"></i>
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Popup Component */}
            {isPopupOpen && selectedStore && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
                        <button
                            onClick={handleClosePopup}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition duration-300"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Store</h2>
                        <div className="mb-4">
                            {/* Uncomment to display store logo */}
                            {selectedStore.logo && (
                                <Image
                                    width={200}
                                    height={200}
                                    src={selectedStore.logo}
                                    alt={`${selectedStore.name} logo`}
                                    className="w-32 h-32 mb-4 rounded-full border border-gray-300"
                                />
                            )}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700">Name:</label>
                                    <input
                                        type="text"
                                        value={selectedStore.name}
                                        onChange={(e) => setSelectedStore({ ...selectedStore, name: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Description:</label>
                                    <textarea
                                        value={selectedStore.description}
                                        onChange={(e) => setSelectedStore({ ...selectedStore, description: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Views:</label>
                                    <input
                                        disabled
                                        type="number"
                                        value={selectedStore.views}
                                        onChange={(e) => setSelectedStore({ ...selectedStore, views: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Logo:</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className="mt-1 block w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Facebook URL:</label>
                                    <input
                                        type="text"
                                        value={selectedStore.social_links.facebook || ''}
                                        onChange={(e) => setSelectedStore({
                                            ...selectedStore,
                                            social_links: {
                                                ...selectedStore.social_links,
                                                facebook: e.target.value
                                            }
                                        })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Twitter URL:</label>
                                    <input
                                        type="text"
                                        value={selectedStore.social_links.twitter || ''}
                                        onChange={(e) => setSelectedStore({
                                            ...selectedStore,
                                            social_links: {
                                                ...selectedStore.social_links,
                                                twitter: e.target.value
                                            }
                                        })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Instagram URL:</label>
                                    <input
                                        type="text"
                                        value={selectedStore.social_links.instagram || ''}
                                        onChange={(e) => setSelectedStore({
                                            ...selectedStore,
                                            social_links: {
                                                ...selectedStore.social_links,
                                                instagram: e.target.value
                                            }
                                        })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4">
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
