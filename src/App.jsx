import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import { useState, useEffect } from "react";

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true" || false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    const htmlEl = document.documentElement;
    if (darkMode) {
      htmlEl.classList.add('dark');
    } else {
      htmlEl.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 transition-all duration-500">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>

        <footer className="mt-16 pt-8 pb-6 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mx-auto">
                <span className="text-white font-bold text-xl">TF</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                © 2024 TaskForge. Built with ❤️ using React & Tailwind CSS
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Forge your path to productivity excellence.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}