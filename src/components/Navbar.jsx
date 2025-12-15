import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Navbar({ darkMode, setDarkMode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home", emoji: "🏠" },
    { path: "/dashboard", label: "Dashboard", emoji: "📊" },
    { path: "/about", label: "About", emoji: "ℹ️" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between h-20">
          <div className="flex items-center justify-center sm:justify-start w-full sm:w-auto mb-4 sm:mb-0">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-bold text-xl">TF</span>
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  TaskForge
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Forge Your Productivity</p>
              </div>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800/50 rounded-xl p-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="relative p-3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 group"
                aria-label="Toggle theme"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl transition-transform duration-300">
                    {darkMode ? "☀️" : "🌙"}
                  </span>
                  <span className="text-sm font-medium hidden sm:block">
                    {darkMode ? "Light" : "Dark"}
                  </span>
                </div>
              </button>

              {user ? (
                <div className="relative group">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold cursor-pointer shadow-lg hover:scale-105 transition-transform duration-300">
                    {user.name?.substring(0, 2).toUpperCase() || "U"}
                  </div>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <button className="w-full text-left px-4 py-3 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        👤 Profile Settings
                      </button>
                      <button className="w-full text-left px-4 py-3 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        ⚙️ Settings
                      </button>
                      <button 
                        onClick={() => {
                          logout();
                          navigate('/login');
                        }}
                        className="w-full text-left px-4 py-3 text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}