import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/v1/admin/users", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      setUsers(res.data?.users || []);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const promoteToCourier = async (id) => {
    if (!window.confirm("Promote this user to courier?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:8000/api/v1/admin/users/${id}/promote`,
        {},
        { headers: { Authorization: token ? `Bearer ${token}` : "" } }
      );
      alert(res.data?.message || "User promoted successfully");
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: "courier" } : u))
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to promote user");
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:8000/api/v1/orders/all",
        {},
        { headers: { Authorization: token ? `Bearer ${token}` : "" } }
      );
      setOrders(res.data?.data || []);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Failed to fetch orders");
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (activeTab === "orders") fetchOrders();
  }, [activeTab]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 bg-base-200 rounded-xl shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">
          <span className="text-white">Admin</span>{" "}
          <span className="text-blue-500">Panel</span>
        </h1>
        <p className="text-gray-400 mt-2">
          Manage users, orders, and courier assignments from one place.
        </p>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed justify-center mb-8">
        <a
          className={`tab ${activeTab === "users" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </a>
        <a
          className={`tab ${activeTab === "orders" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </a>
      </div>

      {errorMsg && (
        <div className="alert alert-error shadow-lg mb-4">
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow-md p-4">
          {users.length === 0 ? (
            <p className="text-center text-gray-400 py-6">No users found.</p>
          ) : (
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.fullname}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          user.role === "admin"
                            ? "badge-error"
                            : user.role === "courier"
                              ? "badge-success"
                              : user.role === "partner"
                                ? "badge-warning"
                                : "badge-info"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      {user.role === "courier" || user.role === "admin" ? (
                        <button className="btn btn-disabled btn-sm">
                          {user.role}
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => promoteToCourier(user._id)}
                        >
                          Promote
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow-md p-4">
          {orders.length === 0 ? (
            <p className="text-center text-gray-400 py-6">No orders found.</p>
          ) : (
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Courier</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1}</td>
                    <td>{order.customerName}</td>
                    <td>{order.customerPhone || "N/A"}</td>
                    <td>₹{order.totalAmount}</td>
                    <td>
                      <span className="badge badge-info">{order.status}</span>
                    </td>
                    <td>
                      {order.paymentType} {order.isPaid && "✔"}
                    </td>
                    <td>
                      {order.assignedCourier
                        ? order.assignedCourier.fullname
                        : "Not Assigned"}
                    </td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
