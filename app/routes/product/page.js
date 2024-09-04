'use client';
import { useEffect, useState, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthContext } from '@/app/context/Auth';

export default function StoreDetail() {
    const searchParams = useSearchParams();
    const identifier = searchParams.get('id') || '10';
    const { tokens } = useContext(AuthContext)

    const [store, setStore] = useState({});
    const [products, setProducts] = useState([])
    const [id, setId] = useState(null)
    const router = useRouter();

    const fetcher = async (url, token, method = 'GET', body = null) => {
        const options = {
            method: method,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: body ? JSON.stringify(body) : null,
        };
        const res = await fetch(url, options);
        if (!res.ok) {
            const error = await res.text();
            return Promise.reject(error || 'Failed to fetch');
        }
        return res.json();
    };

    useEffect(() => {
        setId(identifier)
        const fetchStore = async () => {
            try {
                const data = await fetcher(`http://127.0.0.1:8000/store/${id}/`, tokens.access);
                setStore(data)
                const relatedData = await fetcher('http://127.0.0.1:8000/product/', tokens.access);
                const filteredRelated = relatedData
                    .filter(currentIdea => currentIdea.store == id);
                setProducts(filteredRelated)
            } catch (error) {
                console.error('Error fetching idea:', error);
            }
        };
        fetchStore();
    }, [id, store, products]);
    return (
        <div>
            <section>
                <div class="relative bg-gradient-to-r from-purple-600 to-blue-600 h-screen text-white overflow-hidden">
                    <div class="absolute inset-0">
                        <img src={store.logo} alt="Store Logo" class="object-cover object-center w-full h-full" />
                        <div class="absolute inset-0 bg-black opacity-50"></div>
                    </div>
                    <div class="relative z-10 flex flex-col justify-center items-center h-full text-center">
                        <h1 class="text-5xl font-bold leading-tight mb-4">Welcome to Our Awesome {store.name} store</h1>
                        <p class="text-lg text-gray-300 mb-8">  {store.description} </p>
                        <a href="#Projects" class="bg-yellow-400 text-gray-900 hover:bg-yellow-300 py-2 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">Get Started</a>
                    </div>
                </div>
            </section>
            <section id="Projects"
                class="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
                {products.map(product => (
                    <div key={product.id} className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
                        <a  onClick={() => router.push(`/routes/productDetails?id=${product.id}`)}>
                            <img
                                src={product.product_image}
                                alt="Product"
                                className="h-80 w-72 object-cover rounded-t-xl"
                            />
                            <div className="px-4 py-3 w-72">
                                <span className="text-gray-400 mr-3 uppercase text-xs">{store.name}</span>
                                <p className="text-lg font-bold text-black truncate block capitalize">{product.name}</p>
                                <div className="flex items-center">
                                    <p className="text-lg font-semibold text-black cursor-auto my-3">${product.price}</p>
                                    <del>
                                        <p className="text-sm text-gray-600 cursor-auto ml-2">
                                            ${(parseFloat(product.price) * 1.3).toFixed(2)}
                                        </p>
                                    </del>
                                    <div className="ml-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-bag-plus" viewBox="0 0 16 16">
                                            <path fillRule="evenodd"
                                                d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"
                                            />
                                            <path
                                                d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                ))}
            </section>
        </div>
    );
}