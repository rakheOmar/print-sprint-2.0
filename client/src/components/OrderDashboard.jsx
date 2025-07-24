import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/orders/my-orders', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setOrders(response.data.orders || []);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="px-6 md:px-16 py-10 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">My Orders</h2>

            {loading ? (
                <div className="text-center py-10">
                    <span className="loading loading-spinner text-primary"></span>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center text-gray-500 py-20">
                    <p>No orders found. Upload a document to get started!</p>
                    <a href="/print-section" className="btn btn-primary mt-4">Upload Document</a>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Document</th>
                                <th>Status</th>
                                <th>Total Price</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, i) => (
                                <tr key={order._id}>
                                    <td>{i + 1}</td>
                                    <td>{order.document?.name || 'N/A'}</td>
                                    <td>
                                        <span className={`badge ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>₹{order.totalPrice.toFixed(2)}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// Helper to color code order statuses
function getStatusColor(status) {
    switch (status) {
        case 'pending':
            return 'badge-warning';
        case 'processing':
            return 'badge-info';
        case 'delivered':
            return 'badge-success';
        case 'cancelled':
            return 'badge-error';
        default:
            return 'badge-neutral';
    }
}

export default UserDashboard;
