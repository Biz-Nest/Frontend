// lib/api.js
import axios from 'axios';


export const fetchIdeas = async () => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/idea/`);
  return response.data;
};

export const fetchStores = async () => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/store/`);
  return response.data;
};

export const fetchLikes = async () => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/like/`);
  return response.data;
};

export const fetchReports = async () => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reports/`);
  return response.data;
};

export const fetchCartItems = async () => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart/`);
  return response.data;
};
  
