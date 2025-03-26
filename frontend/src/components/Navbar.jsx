import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp > Date.now() / 1000) {
          setIsAuthenticated(true); // Valid token
        } else {
          localStorage.removeItem("accessToken"); // Expired token
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div>
      <nav className="bg-gray-900 border-gray-200">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img
              src="https://i.ibb.co/jPPPt4rh/coupon-svgrepo-com.png"
              className="h-9"
              alt="Logo"
            />
            <span className="self-center text-2xl font-semibold text-white">
              CouponHub
            </span>
          </Link>

          {/* Hamburger button for mobile */}
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={toggleMenu}
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

          {/* Menu items */}
          <div className={`${isMenuOpen ? "block" : "hidden"} w-full md:block md:w-auto`}>
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-gray-900">
              
              {/* Conditional Buttons */}
              {isAuthenticated ? (
                <li className="w-full md:w-auto flex justify-center space-x-4">
                  <Link
                    to="/dashboard"
                    className="bg-green-500 text-white border border-green-500 px-4 py-2 rounded-md hover:bg-white hover:text-green-500 transition"
                  >
                    Dashboard
                  </Link>
                </li>
              ) : (
                <>
                  <li className="w-full md:w-auto flex justify-center space-x-4">
                    <button
                      className="bg-blue-500 text-white border border-blue-500 px-4 py-2 rounded-md hover:bg-white hover:text-blue-500 transition"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </button>
                  </li>

                  <li className="w-full md:w-auto flex justify-center space-x-4">
                    <button
                      className="bg-blue-500 text-white border border-blue-500 px-4 py-2 rounded-md hover:bg-white hover:text-blue-500 transition"
                      onClick={() => navigate("/register")}
                    >
                      Register
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
