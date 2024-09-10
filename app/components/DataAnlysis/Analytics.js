'use client';
import useSWR from 'swr';
import { fetchStores, fetchIdeas, fetchLikes, fetchReports, fetchCartItems } from './fetchData';
import { findMostViewedStore, findMostLikedIdea, findMostLikedReport, findMostRepeatedProduct } from './Analysis';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { useEffect, useState } from 'react';

// Register required elements for Pie charts
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const AnalyticsPage = () => {
  const { data: stores, error: storesError } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/store/`, fetchStores);
  const { data: ideas, error: ideasError } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/idea/`, fetchIdeas);
  const { data: likes, error: likesError } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/like/`, fetchLikes);
  const { data: reports, error: reportsError } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/reports/`, fetchReports);
  const { data: cartItems, error: cartItemsError } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/cart/`, fetchCartItems);

  const [mostLikedIdea, setMostLikedIdea] = useState(null);
  const [mostViewedStore, setMostViewedStore] = useState(null);
  const [mostLikedReport, setMostLikedReport] = useState(null);
  const [mostRepeatedProduct, setMostRepeatedProduct] = useState([]);

  useEffect(() => {
    if (ideas && likes) {
      setMostLikedIdea(findMostLikedIdea(ideas, likes));
    }
    if (stores) {
      setMostViewedStore(findMostViewedStore(stores));
    }
    if (reports && likes) {
      setMostLikedReport(findMostLikedReport(reports, likes));
    }
    if (cartItems) {
      const productData = findMostRepeatedProduct(cartItems);
      setMostRepeatedProduct(productData);
    }
  }, [ideas, likes, stores, reports, cartItems]);

  if (storesError || ideasError || likesError || reportsError || cartItemsError) {
    return <div>Error loading data. Please try again later.</div>;
  }
  if (!stores || !ideas || !likes || !reports || !cartItems) return <div>Loading...</div>;

  // Modern color palette
  const modernColors = [
    '#ff6b6b', '#feca57', '#1dd1a1', '#5f27cd', '#54a0ff', '#ff9f43', '#0abde3', '#ee5253'
  ];

  // Pie chart data for stores
  const storeChartData = {
    labels: stores.map(store => store.name),
    datasets: [
      {
        label: 'Store Views',
        data: stores.map(store => store.views),
        backgroundColor: stores.map((_, index) => modernColors[index % modernColors.length]),
        borderColor: stores.map((_, index) => modernColors[index % modernColors.length]),
        borderWidth: 1,
      },
    ],
  };

  // Pie chart data for ideas
  const ideaChartData = {
    labels: ideas.map(idea => idea.name),
    datasets: [
      {
        label: 'Idea Likes',
        data: ideas.map(idea =>
          likes.filter(like => like.object_id === idea.id && like.content_type === 9).length
        ),
        backgroundColor: ideas.map((_, index) => modernColors[index % modernColors.length]),
        borderColor: ideas.map((_, index) => modernColors[index % modernColors.length]),
        borderWidth: 1,
      },
    ],
  };

  // Pie chart data for reports
  const reportChartData = {
    labels: reports.map(report => report.title),
    datasets: [
      {
        label: 'Report Likes',
        data: reports.map(report =>
          likes.filter(like => like.object_id === report.id && like.content_type === 11).length
        ),
        backgroundColor: reports.map((_, index) => modernColors[index % modernColors.length]),
        borderColor: reports.map((_, index) => modernColors[index % modernColors.length]),
        borderWidth: 1,
      },
    ],
  };

  // Pie chart data for most repeated product
  const productChartData = {
    labels: mostRepeatedProduct.map(product => product.name),
    datasets: [
      {
        label: 'Product Frequency',
        data: mostRepeatedProduct.map(product => product.count),
        backgroundColor: mostRepeatedProduct.map((_, index) => modernColors[index % modernColors.length]),
        borderColor: mostRepeatedProduct.map((_, index) => modernColors[index % modernColors.length]),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="main-title !w-[fit-content] !pb-[15px] !mb-[50px] text-3xl font-bold text-center !ml-auto !mr-auto dark:text-gray-200">Analytics Dashboard<span className="!left-2/4 !-translate-x-1/2"></span></h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Store Views */}
        <div className="p-6 bg-white rounded-lg shadow-lg dark:!bg-[radial-gradient(circle,_rgba(24,_32,_45,_1)_20%,_rgba(10,_15,_20,_1)_80%)]">
          <h2 className="mb-4 text-xl font-semibold text-center dark:text-gray-200">Most Store Views</h2>
          <div style={{ width: '300px', height: '300px', margin: 'auto' }}>
            <Pie data={storeChartData} options={{ responsive: true, plugins: { legend: { position: 'left' }}}} />
          </div>
        </div>

        {/* Ideas */}
        <div className="p-6 bg-white rounded-lg shadow-lg dark:!bg-[radial-gradient(circle,_rgba(24,_32,_45,_1)_20%,_rgba(10,_15,_20,_1)_80%)]">
          <h2 className="mb-4 text-xl font-semibold text-center dark:text-gray-200">Most Liked Ideas</h2>
          <div style={{ width: '300px', height: '300px', margin: 'auto' }}>
            <Pie data={ideaChartData} options={{ responsive: true, plugins: { legend: { position: 'left' }}}} />
          </div>
        </div>

        {/* Reports */}
        <div className="p-6 bg-white rounded-lg shadow-lg dark:!bg-[radial-gradient(circle,_rgba(24,_32,_45,_1)_20%,_rgba(10,_15,_20,_1)_80%)]">
          <h2 className="mb-4 text-xl font-semibold text-center dark:text-gray-200">Most Liked Market Gap</h2>
          <div style={{ width: '300px', height: '300px', margin: 'auto' }}>
            <Pie data={reportChartData} options={{ responsive: true, plugins: { legend: { position: 'left' }}}} />
          </div>
        </div>

        {/* Most Repeated Product */}
        <div className="p-6 bg-white rounded-lg shadow-lg dark:!bg-[radial-gradient(circle,_rgba(24,_32,_45,_1)_20%,_rgba(10,_15,_20,_1)_80%)]">
          <h2 className="mb-4 text-xl font-semibold text-center dark:text-gray-200">Best Selling Products</h2>
          <div style={{ width: '300px', height: '300px', margin: 'auto' }}>
            {mostRepeatedProduct.length > 0 ? (
              <Pie data={productChartData} options={{ responsive: true, plugins: { legend: { position: 'left'}}}} />
            ) : (
              <p className="text-center dark:text-gray-400">No cart data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
