import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/v1/admin/users", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      setUsers(res.data?.users || []);
    } catch (error) {
      console.error(
        "Error fetching users:",
        error.response?.data || error.message
      );
      setErrorMsg(
        error.response?.data?.message ||
          `Failed to fetch users (Status: ${error.response?.status || "Network"})`
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Promote user to courier
  const promoteToCourier = async (id) => {
    if (!window.confirm("Promote this user to courier?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:8000/api/v1/admin/users/${id}/promote`,
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      alert(res.data?.message || "User promoted successfully");
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: "courier" } : u))
      );
    } catch (error) {
      console.error(
        "Error promoting user:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Failed to promote user");
    }
  };

  // Fetch all orders (Admin)
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:8000/api/v1/orders/all",
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      setOrders(res.data?.data || []);
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error.response?.data || error.message
      );
      setErrorMsg(
        error.response?.data?.message ||
          `Failed to fetch orders (Status: ${error.response?.status || "Network"})`
      );
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel</h1>

      {/* DaisyUI Tabs */}
      <div className="tabs justify-center mb-6">
        <a
          className={`tab tab-bordered ${activeTab === "users" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </a>
        <a
          className={`tab tab-bordered ${activeTab === "orders" ? "tab-active" : ""}`}
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
        <div className="overflow-x-auto bg-base-100 shadow rounded-lg">
          {users.length === 0 ? (
            <p className="text-center p-6">No users found.</p>
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
                          user.role === "courier"
                            ? "badge-success"
                            : "badge-info"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      {user.role === "courier" ? (
                        <button className="btn btn-disabled btn-sm">
                          Courier
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
        <div className="overflow-x-auto bg-base-100 shadow rounded-lg">
          {orders.length === 0 ? (
            <p className="text-center p-6">No orders found.</p>
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
