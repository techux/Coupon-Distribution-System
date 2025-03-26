import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/login" replace={true} />;
  }

  // Token validation
  const decoded = jwtDecode(token);
  if (decoded.exp < Date.now() / 1000) {
    localStorage.removeItem("accessToken");
    return <Navigate to="/login" replace={true} />;
  }
  if (decoded.role !== 'admin') {
    return <Navigate to="/" replace={true} />;
  }

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponHistory, setCouponHistory] = useState([]);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Fetch Coupons
  const fetchCoupons = async () => {
    try {
      const response = await fetch(`${baseUrl}/coupon/`, {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch coupons");
      const data = await response.json();
      setCoupons(data.data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    status: "Unclaimed",
    description: "",
    enabled: true,
  });

  // Open Modals
  const openCreateModal = () => setIsCreateOpen(true);

  const openEditModal = (coupon) => {
    setSelectedCoupon(coupon);
    setNewCoupon({
      code: coupon.code,
      description: coupon.description || "",
      enabled: coupon.available,
    });
    setIsEditOpen(true);
  };

  const openHistoryModal = async (coupon) => {
    setSelectedCoupon(coupon);
    setIsHistoryOpen(true);
    await fetchCouponHistory(coupon._id);
  };

  // Close Modals
  const closeModal = () => {
    setIsCreateOpen(false);
    setIsEditOpen(false);
    setIsHistoryOpen(false);
    setSelectedCoupon(null);
    setNewCoupon({
      code: "",
      status: "Unclaimed",
      description: "",
      enabled: true,
    });
  };

  // Add Coupon
  const handleAddCoupon = async () => {
    try {
      const response = await fetch(`${baseUrl}/coupon/add`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: newCoupon.code,
          description: newCoupon.description,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        alert(data.message);
        throw new Error("Failed to fetch coupon history");
      }

      fetchCoupons();
      closeModal();
    } catch (error) {
      console.error("Error adding coupon:", error);
    }
  };

  // Modify Coupon
  const handleModifyCoupon = async () => {
    if (!selectedCoupon) return;
    try {
      const response = await fetch(
        `${baseUrl}/coupon/update/${selectedCoupon._id}`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newCoupon.status,
            description: newCoupon.description,
            available: newCoupon.enabled,
          }),
        }
      );
      
      if (!response.ok) {
        const data = await response.json();
        alert(data.message);
        throw new Error("Failed to fetch coupon history");
      }

      fetchCoupons();
      closeModal();
    } catch (error) {
      console.error("Error updating coupon:", error);
    }
  };

  // Fetch Coupon History
  const fetchCouponHistory = async (couponId) => {
    try {
      const response = await fetch(`${baseUrl}/coupon/history/${couponId}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message);
        throw new Error("Failed to fetch coupon history");
      }

      const data = await response.json();
      setCouponHistory(data.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  return (
    <section className="bg-gray-900 p-3 sm:p-5">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="p-4 flex justify-end">
            <button
              className="bg-blue-700 text-white px-4 py-2 rounded-lg"
              onClick={openCreateModal}
            >
              Add Coupon
            </button>
          </div>

          {/* Coupons Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-400">
              <thead className="text-xs text-white bg-gray-700">
                <tr>
                  <th className="px-4 py-3">Coupon Code</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Enabled/Diabled</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="border-b border-gray-700">
                    <td className="px-4 py-3 text-white">{coupon.code}</td>
                    <td className="px-4 py-3">{coupon.status}</td>
                    <td className="px-4 py-3 max-w-[12rem] truncate">
                      {coupon.description}
                    </td>
                    <td className="px-4 py-3">
                      {coupon.available ? "Enabled" : "Disabled"}
                    </td>
                    <td className="px-4 py-3 flex gap-1">
                      <button
                        className="bg-yellow-500 text-white px-3 py-2 rounded-lg"
                        onClick={() => openEditModal(coupon)}
                      >
                        Modify
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-2 rounded-lg"
                        onClick={() => openHistoryModal(coupon)}
                      >
                        History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isCreateOpen || isEditOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold text-gray-900">
              {isCreateOpen ? "Add Coupon" : "Edit Coupon"}
            </h3>
            <input
              type="text"
              placeholder="Coupon Code"
              value={newCoupon.code}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, code: e.target.value })
              }
              className="w-full p-2 border rounded mt-2 text-gray-900"
            />
            <textarea
              placeholder="Description"
              value={newCoupon.description}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, description: e.target.value })
              }
              className="w-full p-2 border rounded mt-2 text-gray-900"
            />
            <select
              value={newCoupon.enabled}
              onChange={(e) =>
                setNewCoupon({
                  ...newCoupon,
                  enabled: e.target.value === "true",
                })
              }
              className="w-full p-2 border rounded mt-2 text-gray-900"
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={isCreateOpen ? handleAddCoupon : handleModifyCoupon}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {isCreateOpen ? "Add" : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold text-gray-900">
              Coupon History
            </h3>
            <ul className="mt-3 max-h-40 overflow-y-auto text-gray-900">
              {[couponHistory].length > 0 ? (
                [couponHistory].map((entry, index) => (
                  <li key={index} className="p-2 border-b">
                    <p>
                      <strong>Status:</strong> {entry.status}
                    </p>
                    <p>
                      <strong>Enabled :</strong>{" "}
                      {entry.available ? "Yes" : "No"}
                    </p>
                    <p>
                      <strong>Claimed By:</strong>{" "}
                      {entry.claimedBy || "Not Claimed"}
                    </p>
                    <p>
                      <strong>Claimed At:</strong>{" "}
                      {entry.claimedAt
                        ? new Date(entry.claimedAt).toLocaleString()
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Created At:</strong>{" "}
                      {new Date(entry.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>Description:</strong>{" "}
                      {entry.description || "No description"}
                    </p>
                  </li>
                ))
              ) : (
                <p>No history available</p>
              )}
            </ul>

            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-400 text-white rounded mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
