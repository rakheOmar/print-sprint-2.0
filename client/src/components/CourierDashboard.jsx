import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CourierDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pickingOrderId, setPickingOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/orders/available', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setOrders(res.data.orders);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const pickOrder = async (orderId) => {
    try {
      setPickingOrderId(orderId);
      await axios.put(`/api/orders/pick/${orderId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchOrders();
    } catch (err) {
      console.error('Failed to pick order:', err);
    } finally {
      setPickingOrderId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">📦 Available Orders</h2>

      {loading ? (
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-lg">No orders available right now.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order._id} className="card bg-base-100 shadow-md border">
              <div className="card-body">
                <h3 className="card-title text-lg">Order ID: {order._id}</h3>
                <p><b>User:</b> {order.user?.name} ({order.user?.email})</p>
                <p><b>Status:</b> {order.status}</p>
                <div className="card-actions justify-end">
                  <button
                    className={`btn btn-primary btn-sm ${pickingOrderId === order._id ? 'loading' : ''}`}
                    onClick={() => pickOrder(order._id)}
                    disabled={pickingOrderId === order._id}
                  >
                    {pickingOrderId === order._id ? 'Picking...' : 'Pick Order'}
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

export default CourierDashboard;
