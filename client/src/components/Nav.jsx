import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
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

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLoginRedirect = () => {
    localStorage.setItem("prevPage", window.location.pathname);
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("profilePicture");
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-10 w-full py-4 px-8 flex justify-between items-center transition-all duration-300 ${
        isBookingPage || isBookTicketsPage || isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <h1
        className={`text-3xl font-bold ${
          isBookingPage || isBookTicketsPage || isScrolled ? "text-black" : "text-white"
        }`}
      >
        Event<span className="text-red-500">U</span>p
      </h1>
      <ul className="flex space-x-6">
        <li>
          <a
            href="#"
            className={`hover:text-blue-500 ${
              isBookingPage || isBookTicketsPage || isScrolled ? "text-gray-800" : "text-white"
            }`}
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#"
            className={`hover:text-blue-500 ${
              isBookingPage || isBookTicketsPage || isScrolled ? "text-gray-800" : "text-white"
            }`}
          >
            About
          </a>
        </li>
        <li>
          <a
            href="#"
            className={`hover:text-blue-500 ${
              isBookingPage || isBookTicketsPage || isScrolled ? "text-gray-800" : "text-white"
            }`}
          >
            Events
          </a>
        </li>
        <li>
          <a
            href="#"
            className={`hover:text-blue-500 ${
              isBookingPage || isBookTicketsPage || isScrolled ? "text-gray-800" : "text-white"
            }`}
          >
            Contact
          </a>
        </li>
        <li>
          {isLoggedIn ? (
            <div className="relative">
              <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={toggleDropdown}
              >
                {profilePicture && (
                  <img
                    src={profilePicture}
                    alt="User Profile"
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                )}
              </div>
              {dropdownVisible && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md p-2">
                  <span className="block text-gray-700">{userName}</span>
                  <Link
                    to="/my-bookings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Bookings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-500 hover:bg-gray-100 p-2 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className={`font-bold ${
                isBookingPage || isBookTicketsPage || isScrolled ? "text-blue-500" : "text-blue-300"
              }`}
              onClick={handleLoginRedirect}
            >
              Login/Register
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Nav;