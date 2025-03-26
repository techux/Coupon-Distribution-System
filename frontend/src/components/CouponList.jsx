import React, { useEffect, useState } from "react";

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, message: "", coupon: "", isError: false });
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch(`${baseUrl}/coupon/available`);
        if (!response.ok) throw new Error("Failed to fetch coupons");
        const data = await response.json();
        setCoupons(data.data);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, []);

  const handleClaim = async (code) => {
    const accessToken = localStorage.getItem("accessToken");
    let headers = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    try {
      const response = await fetch(`${baseUrl}/coupon/claim`, {
        method: "POST",
        headers,
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setModal({ isOpen: true, message: data.message, coupon: "", isError: true });
        return;
      }

      setModal({ isOpen: true, message: "Coupon claimed successfully", coupon: data.coupon, isError: false });
    } catch (error) {
      console.error("Error claiming coupon:", error);
      setModal({ isOpen: true, message: "Something went wrong!", coupon: "", isError: true });
    }
  };

  return (
    <div className="flex justify-center items-center m-4 sm:m-8 px-4 bg-gray-900">
      <div className="w-full lg:w-4/5 xl:w-4/5 2xl:w-4/5 sm:w-11/12 md:w-9/12">
        <div className="space-y-6">
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700 p-6 rounded-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2 sm:mb-0">
                      {coupon.code}
                    </h3>
                    <p className="text-white">{coupon.description}</p>
                  </div>
                  <button
                    onClick={() => handleClaim(coupon.code)}
                    className="mt-2 sm:mt-0 bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Claim
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white text-center">No coupons available</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <h2 className={`text-lg font-semibold ${modal.isError ? "text-red-600" : "text-green-600"}`}>
              {modal.isError ? "Error" : "Success"}
            </h2>
            <p className="mt-2 text-gray-800">{modal.message}</p>
            {modal.coupon && <p className="mt-1 font-bold text-black">Coupon Code: {modal.coupon}</p>}
            <button
              onClick={() => setModal({ isOpen: false, message: "", coupon: "", isError: false })}
              className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponList;
