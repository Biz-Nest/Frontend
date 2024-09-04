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
           
        }
    }, [data, tokens.user.id]);

    if (!data) return <div className="p-8 bg-gray-100">Loading...</div>;
    if (error) return <div className="p-8 bg-gray-100">Error loading stores.</div>;

    if (!userStores.length) {
        return (
            <div className="container">
                <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
                    <h1 className="mb-6 text-3xl font-bold text-gray-900">You don&apos;t have any stores yet.</h1>
                    <button
                        onClick={() => router.push('/routes/addIdea/')}
                        className="px-6 py-3 text-white transition duration-300 bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600"
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
                <h1 className="mb-6 text-3xl font-bold text-gray-900">Your Stores</h1>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {userStores.map((store) => (
                        <div
                            key={store.id}
                            className="p-6 transition duration-300 bg-white border border-gray-200 rounded-lg shadow-lg cursor-pointer hover:bg-gray-50"
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
                                        className="w-32 h-32 mb-4 border border-gray-300 rounded-full"
                                    />
                                )}
                                <h2 className="mb-2 text-2xl font-bold text-gray-800">{store.name}</h2>
                                <p className="mb-2 text-gray-600">{store.description || "No description available"}</p>
                                <p className="mb-4 text-gray-600">Views: {store.views}</p>

                                {store.social_links && (
                                    <div className="flex mt-2 space-x-4">
                                        {store.social_links.facebook && (
                                            <a
                                                href={store.social_links.facebook}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 transition duration-300 hover:text-blue-600"
                                            >
                                                <i className="fab fa-facebook-f"></i>
                                            </a>
                                        )}
                                        {store.social_links.twitter && (
                                            <a
                                                href={store.social_links.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 transition duration-300 hover:text-blue-500"
                                            >
                                                <i className="fab fa-twitter"></i>
                                            </a>
                                        )}
                                        {store.social_links.instagram && (
                                            <a
                                                href={store.social_links.instagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-pink-600 transition duration-300 hover:text-pink-700"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="relative w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
                        <button
                            onClick={handleClosePopup}
                            className="absolute text-gray-500 transition duration-300 top-2 right-2 hover:text-gray-700"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                        <h2 className="mb-4 text-2xl font-bold text-gray-800">Edit Store</h2>
                        <div className="mb-4">
                            {/* Uncomment to display store logo */}
                            {selectedStore.logo && (
                                <Image
                                    width={200}
                                    height={200}
                                    src={selectedStore.logo}
                                    alt={`${selectedStore.name} logo`}
                                    className="w-32 h-32 mb-4 border border-gray-300 rounded-full"
                                />
                            )}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700">Name:</label>
                                    <input
                                        type="text"
                                        value={selectedStore.name}
                                        onChange={(e) => setSelectedStore({ ...selectedStore, name: e.target.value })}
                                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Description:</label>
                                    <textarea
                                        value={selectedStore.description}
                                        onChange={(e) => setSelectedStore({ ...selectedStore, description: e.target.value })}
                                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Views:</label>
                                    <input
                                        disabled
                                        type="number"
                                        value={selectedStore.views}
                                        onChange={(e) => setSelectedStore({ ...selectedStore, views: e.target.value })}
                                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Logo:</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className="block w-full mt-1"
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
                                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
