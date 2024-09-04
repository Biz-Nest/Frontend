"use client";
import Link from "next/link";
import Image from "next/image";
import "./Header.css";
import React, { useContext, useState } from "react";
import { ThemeContext } from "@/app/context/Theme";
import { AuthContext } from "@/app/context/Auth";

export default function Header() {
  const { isDarktheme, toggleThemeHandler } = useContext(ThemeContext);
  const { tokens, logout } = useContext(AuthContext);
  console.log(tokens)

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const [isDarkIcon, setIsDarkIcon] = useState(false);
  const toggleDarkIcon = () => {
    setIsDarkIcon(!isDarkIcon);
  };

  // to handle sign out
  function handleSignOut() {
    logout();
    console.log("sign out");
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />

      <nav className="bg-white border-gray-200 dark:bg-gray-900 header">
        <div className="container flex flex-wrap items-center justify-between p-4 mx-auto">
          <Image
            className="w-auto h-8"
            src="/images/logo.png"
            width={1000}
            height={1000}
            alt="logo"
          />

          <div
            className="flex items-center space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse"
            id="user-dropdown-parent"
          >
            <div onClick={() => { toggleThemeHandler(); toggleDarkIcon(); }} className="dark-toggle-parent">
              <div id="dark-toggle">
                <i
                  className={`${isDarkIcon ? '' : 'active'} ri-sun-line dark:text-white`}
                  id="sun"
                ></i>
                <i className={`${isDarkIcon ? 'active' : ''} fa-solid fa-moon dark:text-white`} id="moon"></i>
              </div>
            </div>

            <button
              onClick={toggleUserMenu}
              type="button"
              className="flex text-sm bg-blue-700 rounded-full md:me-0 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom"
            >
              <Image
                className="w-8 h-8 rounded-full"
                src="/images/user.png"
                width={50}
                height={50}
                alt="User Avatar"
              />
            </button>
            <div
              className={`${
                isUserMenuOpen ? "" : "hidden"
              } z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600`}
              id="user-dropdown"
            >
              <div className="px-4 py-3 cursor-default">
                <span className="block text-sm text-gray-900 dark:text-white">
                  {!tokens ? 'Guest': tokens.user.username}
                </span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                  {!tokens ? '': tokens.user.email}
                  
                </span>
              </div>
              <ul className="py-2" aria-labelledby="user-menu-button">
                <li>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 dark:hover:bg-blue-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 dark:hover:bg-blue-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Settings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/earnings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 dark:hover:bg-blue-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Earnings
                  </Link>
                </li>
                <li>
                  <a
                    onClick={handleSignOut}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 dark:hover:bg-blue-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
            <button
              onClick={toggleMenu}
              id="side_menu_button"
              data-collapse-toggle="navbar-user"
              type="button"
              className="inline-flex items-center justify-center w-10 h-10 p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:text-gray-400 dark:hover:bg-blue-700 dark:focus:ring-blue-600"
              aria-controls="navbar-user"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className={`${
              isMenuOpen ? "" : "hidden"
            } items-center justify-between w-full md:flex md:w-auto md:order-1`}
            id="navbar-user"
          >
            <ul className="flex flex-col p-4 mt-4 font-medium border border-gray-100 rounded-lg md:p-0 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li className="text-[18px]">
                <Link
                  href="/"
                  className="block px-3 py-2 text-gray-900 rounded hover:bg-blue-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Home
                </Link>
              </li>
              <li className="text-[18px]">
                <Link
                  href="/routes/about"
                  className="block px-3 py-2 text-gray-900 rounded hover:bg-blue-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  About
                </Link>
              </li>
              <li className="text-[18px]">
                <Link
                  href="/routes/Ideas"
                  className="block px-3 py-2 text-gray-900 rounded hover:bg-blue-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Ideas
                </Link>
              </li>
              <li className="text-[18px]">
                <Link
                  href="/routes/"
                  className="block px-3 py-2 text-gray-900 rounded hover:bg-blue-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Stores
                </Link>
              </li>
              <li className="text-[18px]">
                <Link
                  href="/contact"
                  className="block px-3 py-2 text-gray-900 rounded hover:bg-blue-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <script src="/scripts/header.js" defer></script>
      </nav>
    </>
  );
}
