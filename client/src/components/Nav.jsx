import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userName = localStorage.getItem("userName");
  const profilePicture = localStorage.getItem("profilePicture");

  const isBookingPage = location.pathname.includes("booking");
  const isBookTicketsPage = location.pathname.includes("book-tickets");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginRedirect = () => {
    localStorage.setItem("prevPage", window.location.pathname);
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("profilePicture");
    setDropdownVisible(false);
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const navTextColor = isBookingPage || isBookTicketsPage || isScrolled ? "text-gray-800" : "text-white";
  const navBg = isBookingPage || isBookTicketsPage || isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 w-full py-4 px-4 sm:px-8 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <h1 className={`text-2xl font-bold ${navTextColor}`}>
            Event<span className="text-blue-600">Hub</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`hover:text-blue-600 transition-colors font-medium ${navTextColor}`}>
            Home
          </Link>
          <a href="#events" className={`hover:text-blue-600 transition-colors font-medium ${navTextColor}`}>
            Events
          </a>
          <a href="#categories" className={`hover:text-blue-600 transition-colors font-medium ${navTextColor}`}>
            Categories
          </a>
          <a href="#contact" className={`hover:text-blue-600 transition-colors font-medium ${navTextColor}`}>
            Contact
          </a>
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-blue-500"
                />
                <span className={`hidden sm:block font-medium ${navTextColor}`}>{userName}</span>
                <svg className={`w-4 h-4 transition-transform ${dropdownVisible ? 'rotate-180' : ''} ${navTextColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {dropdownVisible && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500">Manage your account</p>
                  </div>
                  <Link
                    to="/my-bookings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setDropdownVisible(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    My Bookings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleLoginRedirect}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg ${navTextColor}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="space-y-3">
            <Link to="/" className="block py-2 text-gray-800 hover:text-blue-600 font-medium">Home</Link>
            <a href="#events" className="block py-2 text-gray-800 hover:text-blue-600 font-medium">Events</a>
            <a href="#categories" className="block py-2 text-gray-800 hover:text-blue-600 font-medium">Categories</a>
            <a href="#contact" className="block py-2 text-gray-800 hover:text-blue-600 font-medium">Contact</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;