import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className=" bg-gray-800 rounded-lg shadow-sm m-4 dark:bg-gray-800 text-center">
        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            &copy; 2025 &nbsp;
            <a href="/" className="hover:underline">
              CouponHub
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
