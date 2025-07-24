import React, { useEffect, useState } from 'react';
import { PackageCheck, IndianRupee, CalendarDays, CreditCard, MapPin, Eye } from 'lucide-react';


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

  if (loading) {
    return <div className="flex justify-center items-center h-40">Loading orders...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">📦 My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="card bg-color-300 text-white shadow-xl border border-base-300">
              <div className="card-body">
                <h2 className="card-title text-lg font-bold">
                  <PackageCheck className="w-5 h-5 text-primary" />
                  Order #{order._id.slice(-6).toUpperCase()}
                </h2>

                <div className={`badge badge-${order.status === 'delivered' ? 'success' : 'info'} mt-2 capitalize`}>
                  {order.status}
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="font-semibold">Address:</span> {order.deliveryAddress}
                  </p>
                  <p className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    <span className="font-semibold">Total:</span> ₹{order.totalAmount}
                  </p>
                  <p className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span className="font-semibold">Payment:</span> {order.paymentType} {order.isPaid && '(Paid)'}
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    <span className="font-semibold">Date:</span> {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="card-actions mt-4 justify-end">
                  <button className="btn btn-sm btn-outline btn-primary flex items-center gap-2">
                    <Eye className="w-4 h-4" />
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
