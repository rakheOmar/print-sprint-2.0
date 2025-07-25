import React, { useEffect, useState } from 'react';
import {
  PackageCheck,
  IndianRupee,
  CalendarDays,
  CreditCard,
  MapPin,
  Eye,
  User as UserIcon,
  Clock,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons not showing up in Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const markerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [30, 30],
});

// Move marker slightly towards target (speed based on ETA)
// KEEPING THIS FUNCTIONALITY EXACTLY AS PROVIDED
const moveTowards = (current, target, eta) => {
  const [lat, lon] = current;
  const [tLat, tLon] = target;
  const dLat = tLat - lat;
  const dLon = tLon - lon;
  const distance = Math.sqrt(dLat * dLat + dLon * dLon);

  if (distance < 0.0001) return target;

  const speed = 0.0005 / (eta || 1); // smaller eta → faster
  return [lat + (dLat / distance) * speed, lon + (dLon / distance) * speed];
};

// Delivery person names
const deliveryPersons = [
  'Ramesh Kumar',
  'Suresh Patil',
  'Amit Sharma',
  'Pooja Iyer',
  'Karan Singh',
  'Rajesh Verma',
  'Meena Nair',
  'Vikram Joshi',
  'Sunita Desai',
  'Anil Gupta',
  'Priya Rao',
  'Manish Choudhary',
  'Neha Kulkarni',
  'Ajay Mehta',
  'Ravi Yadav',
];

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [openMapId, setOpenMapId] = useState(null);
  const [orderExtras, setOrderExtras] = useState({});
  const coords = [19.0647384721062, 72.8357421770366]; // Fixed location

  // KEEPING THIS FUNCTIONALITY EXACTLY AS PROVIDED
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/orders/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (response.ok) {
        setOrders(result.data);
        const extras = {};
        result.data.forEach((order) => {
          const randomDistance = 0.5 + Math.random() * 1.5; // 0.5km - 2km
          const bearing = Math.random() * 2 * Math.PI;
          const R = 6378.1; // Earth's radius in kilometers
          const newLat = Math.asin(
            Math.sin(coords[0] * Math.PI / 180) * Math.cos(randomDistance / R) +
              Math.cos(coords[0] * Math.PI / 180) *
                Math.sin(randomDistance / R) *
                Math.cos(bearing)
          );
          const newLon =
            coords[1] * Math.PI / 180 +
            Math.atan2(
              Math.sin(bearing) *
                Math.sin(randomDistance / R) *
                Math.cos(coords[0] * Math.PI / 180),
              Math.cos(randomDistance / R) -
                Math.sin(coords[0] * Math.PI / 180) * Math.sin(newLat)
            );
          extras[order._id] = {
            marker: [newLat * 180 / Math.PI, newLon * 180 / Math.PI],
            deliveryPerson:
              deliveryPersons[Math.floor(Math.random() * deliveryPersons.length)],
            eta: Math.floor(Math.random() * 15) + 1, // ETA between 1 and 15 minutes
            reached: false,
          };
        });
        setOrderExtras(extras);
      } else {
        console.error('Failed to fetch orders:', result.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // animate markers with speed proportional to ETA
  // KEEPING THIS FUNCTIONALITY EXACTLY AS PROVIDED
  useEffect(() => {
    const interval = setInterval(() => {
      setOrderExtras((prev) => {
        const updated = { ...prev };
        for (const id in updated) {
          if (!updated[id].reached) {
            const newPos = moveTowards(updated[id].marker, coords, updated[id].eta);
            // Check if reached based on coordinates being identical (or very close due to floating point)
            const reached = Math.abs(newPos[0] - coords[0]) < 0.00001 && Math.abs(newPos[1] - coords[1]) < 0.00001; // Using a small threshold for comparison

            updated[id] = {
              ...updated[id],
              marker: reached ? coords : newPos,
              reached,
              eta: reached ? 0 : Math.max(0, updated[id].eta - 0.01), // decrease ETA slowly
            };
          }
        }
        return updated;
      });
    }, 100); // Update every 100ms
    return () => clearInterval(interval);
  }, [coords]); // Added coords as dependency to useEffect to ensure re-run if coords change, though fixed here.

  // KEEPING THIS FUNCTIONALITY EXACTLY AS PROVIDED
  useEffect(() => {
    fetchOrders();
    setLocation('Mumbai, Maharashtra');
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <span className="loading loading-spinner loading-lg text-blue-500"></span>
        <p className="ml-3 text-lg text-gray-700">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">📦 My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            const extras = orderExtras[order._id] || {};
            const isDelivered = extras.reached || order.status === 'delivered';

            return (
              <div
                key={order._id}
                className="card bg-white text-gray-800 shadow-xl border border-gray-200 rounded-lg overflow-hidden" // Added rounded-lg, overflow-hidden
              >
                <div className="card-body p-6"> {/* Added padding */}
                  <h2 className="card-title text-xl font-bold text-blue-600 mb-2 flex items-center gap-2"> {/* Larger title, blue color */}
                    <PackageCheck className="w-6 h-6 text-blue-500" /> {/* Larger icon, matching blue */}
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h2>

                  <div
                    className={`badge ${isDelivered ? 'badge-success bg-green-500 text-white' : 'badge-primary bg-blue-500 text-white'} mt-2 px-3 py-1 rounded-full text-xs font-semibold uppercase`} // More defined badge
                  >
                    {isDelivered ? 'delivered' : order.status}
                  </div>

                  <div className="mt-5 space-y-3 text-sm text-gray-700"> {/* Increased spacing */}
                    <p className="flex items-center gap-3"> {/* Increased gap for icons */}
                      <MapPin className="w-5 h-5 text-purple-500" /> {/* Larger, distinct color */}
                      <span className="font-semibold">Address:</span>{' '}
                      {location || order.deliveryAddress}
                    </p>
                    <p className="flex items-center gap-3">
                      <IndianRupee className="w-5 h-5 text-green-600" />
                      <span className="font-semibold">Total:</span> ₹
                      {order.totalAmount}
                    </p>
                    <p className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-indigo-500" />
                      <span className="font-semibold">Payment:</span>{' '}
                      {order.paymentType} {order.isPaid && '(Paid)'}
                    </p>
                    <p className="flex items-center gap-3">
                      <CalendarDays className="w-5 h-5 text-orange-500" />
                      <span className="font-semibold">Date:</span>{' '}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    {extras.deliveryPerson && (
                      <p className="flex items-center gap-3">
                        <UserIcon className="w-5 h-5 text-teal-500" />
                        <span className="font-semibold">Delivery By:</span>{' '}
                        {extras.deliveryPerson}
                      </p>
                    )}
                    {/* Conditional rendering for ETA / Delivered message */}
                    {!isDelivered ? (
                      <p className="flex items-center gap-3 text-red-500 font-bold"> {/* Highlight ETA */}
                        <Clock className="w-5 h-5" />
                        <span className="font-semibold">ETA:</span>{' '}
                        {extras.eta !== undefined && extras.eta > 0.1 // Using a small threshold for display
                          ? `${extras.eta.toFixed(0)} min`
                          : 'Arriving soon...'}
                      </p>
                    ) : (
                        <p className="flex items-center gap-3 text-green-600 font-bold">
                            <PackageCheck className="w-5 h-5" />
                            Order Delivered!
                        </p>
                    )}
                  </div>

                  <div className="card-actions mt-6 justify-end"> {/* Increased margin */}
                    <button
                      className="btn btn-sm btn-outline btn-primary flex items-center gap-2 px-4 py-2 rounded-md transition duration-200 hover:bg-blue-50 hover:text-blue-700 border-blue-500 text-blue-500" // More custom button styling
                      onClick={() =>
                        setOpenMapId(openMapId === order._id ? null : order._id)
                      }
                    >
                      <Eye className="w-4 h-4" />
                      {openMapId === order._id ? 'Hide Map' : 'View Details'}
                    </button>
                  </div>

                  {openMapId === order._id && extras.marker && (
                    <div className="mt-4 flex justify-center">
                      <div className="w-full max-w-md">
                        <MapContainer
                          center={coords}
                          zoom={15}
                          style={{ height: '250px', width: '100%', borderRadius: '12px', overflow: 'hidden' }} // Rounded corners for map
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker position={coords} icon={markerIcon}>
                            <Popup>Your Delivery Location</Popup>
                          </Marker>
                          {!isDelivered && (
                            <>
                              <Marker position={extras.marker} icon={markerIcon}>
                                <Popup>
                                  Delivery Person: {extras.deliveryPerson} <br />
                                  ETA: {extras.eta.toFixed(0)} min
                                </Popup>
                              </Marker>
                              <Polyline positions={[coords, extras.marker]} color="blue" weight={3} />
                            </>
                          )}
                        </MapContainer>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;