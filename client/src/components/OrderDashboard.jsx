import React, { useEffect, useState } from 'react';

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/orders/my', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setOrders(result.data);
      } else {
        console.error('Failed to fetch orders:', result.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-10">Loading orders...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📦 My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="card shadow-md border border-gray-200"
            >
              <div className="card-body">
                <h2 className="card-title text-xl font-semibold">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h2>
                <div className="badge badge-info capitalize">
                  {order.status}
                </div>

                <div className="mt-4 space-y-2">
                  <p><span className="font-semibold">📍 Address:</span> {order.deliveryAddress}</p>
                  <p><span className="font-semibold">💵 Total:</span> ₹{order.totalAmount}</p>
                  <p><span className="font-semibold">💳 Payment:</span> {order.paymentType} {order.isPaid && '(Paid)'}</p>
                  <p><span className="font-semibold">📅 Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <div className="mt-4">
                  <button className="btn btn-sm btn-outline btn-primary">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
