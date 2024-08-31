"use client";

import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export default function ThemeWrapper({ children }) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  function initialThemeHandler() {
    if (!localStorage.getItem("isDarkTheme")) {
      localStorage.setItem("isDarkTheme", "false");
      document.querySelector("body").classList.add("dark");
      setIsDarkTheme(true);
    } else {
      const isDarkTheme = JSON.parse(localStorage.getItem("isDarkTheme"));
      isDarkTheme && document.querySelector("body").classList.add("dark");
      setIsDarkTheme(isDarkTheme);
    }
  }

  function toggleThemeHandler() {
    const isDarkTheme = JSON.parse(localStorage.getItem("isDarkTheme"));
    setIsDarkTheme(!isDarkTheme);
    document.querySelector("body").classList.toggle("dark");
    localStorage.setItem("isDarkTheme", `${!isDarkTheme}`);
  }

  const globalState = {
    isDarkTheme,
    toggleThemeHandler,
  };

  useEffect(() => initialThemeHandler(), []);

  return (
    <ThemeContext.Provider value={globalState}>
      {children}
    </ThemeContext.Provider>
  );
}
