import React, { useEffect, useState } from 'react';
import {
  PackageCheck,
  IndianRupee,
  CalendarDays,
  CreditCard,
  MapPin,
  Eye,
  User as UserIcon,
  Clock, // Import Clock icon
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons not showing up in Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


const markerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Your custom marker
  iconSize: [30, 30],
});

// Move marker slightly towards target (speed based on ETA)
const moveTowards = (current, target, eta) => {
  const [lat, lon] = current;
  const [tLat, tLon] = target;
  const dLat = tLat - lat;
  const dLon = tLon - lon;
  const distance = Math.sqrt(dLat * dLat + dLon * dLon);

  // If very close to target, snap to target
  if (distance < 0.0001) return target;

  // Smaller ETA implies closer or faster movement
  // Adjust speed multiplier as needed for visual effect
  // Ensure eta is not zero or negative to avoid division by zero or large speed
  const speed = 0.00005 * (1 / (eta > 0.1 ? eta : 0.1)); // Adjusted speed factor

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
  const [location, setLocation] = useState(null); // This seems to be fixed later, might be redundant
  const [openMapId, setOpenMapId] = useState(null);
  const [orderExtras, setOrderExtras] = useState({});
  const coords = [19.0647384721062, 72.8357421770366]; // Fixed delivery target location (e.g., user's address)

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
          // Initialize extras only if order is not delivered from backend
          // OR if the animation 'reached' status isn't set yet.
          // This prevents re-initializing 'reached' to false for delivered orders.
          const isOrderDeliveredBackend = order.status === 'delivered';

          // Only generate random marker and ETA if the order is not delivered
          if (!isOrderDeliveredBackend) {
            const randomDistance = 0.5 + Math.random() * 1.5; // 0.5km - 2km
            const bearing = Math.random() * 2 * Math.PI; // Random direction
            const R = 6378.1; // Earth's radius in km

            // Calculate random starting point for delivery person
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
              marker: [newLat * 180 / Math.PI, newLon * 180 / Math.PI], // Convert back to degrees
              deliveryPerson:
                deliveryPersons[Math.floor(Math.random() * deliveryPersons.length)],
              eta: Math.floor(Math.random() * 15) + 1, // Random ETA between 1 and 15 mins
              reached: false, // Initial state for animation
            };
          } else {
             // For already delivered orders, explicitly set reached to true and ETA to 0
             extras[order._id] = {
                marker: coords, // Marker is at destination
                deliveryPerson: deliveryPersons[Math.floor(Math.random() * deliveryPersons.length)], // Still assign a person
                eta: 0,
                reached: true,
             };
          }
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

  // Animate markers with speed proportional to ETA
  useEffect(() => {
    const interval = setInterval(() => {
      setOrderExtras((prev) => {
        const updated = { ...prev };
        for (const id in updated) {
          // Only animate if not already reached
          if (!updated[id].reached) {
            const newPos = moveTowards(updated[id].marker, coords, updated[id].eta);
            // Check if very close to target to consider it "reached"
            const currentDistance = L.latLng(newPos).distanceTo(L.latLng(coords));
            const reached = currentDistance < 10; // 10 meters threshold for "reached"

            updated[id] = {
              ...updated[id],
              marker: reached ? coords : newPos, // Snap to target if reached
              reached: reached, // Update reached status
              eta: reached ? 0 : Math.max(0, updated[id].eta - (100 / 60000)), // Decrease ETA slowly (100ms interval / 60000ms per minute)
            };
          }
        }
        return updated;
      });
    }, 100); // Update every 100ms
    return () => clearInterval(interval);
  }, []); // Run only once on mount

  useEffect(() => {
    fetchOrders();
    setLocation('Mumbai, Maharashtra'); // Set a fixed displayed location
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="ml-3 text-lg">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">📦 My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            const extras = orderExtras[order._id] || {};
            // Determine delivered status based on backend data OR animation 'reached' status
            const isDelivered = extras.reached || order.status === 'delivered';
            return (
              <div
                key={order._id}
                className="card bg-base-100 text-base-content shadow-xl border border-base-300"
              >
                <div className="card-body">
                  <h2 className="card-title text-lg font-bold">
                    <PackageCheck className="w-5 h-5 text-primary" />
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h2>

                  <div
                    className={`badge badge-${isDelivered ? 'success' : 'primary'} mt-2 capitalize`}
                  >
                    {isDelivered ? 'delivered' : order.status}
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="font-semibold">Address:</span>{' '}
                      {location || order.deliveryAddress}
                    </p>
                    <p className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4" />
                      <span className="font-semibold">Total:</span> ₹
                      {order.totalAmount}
                    </p>
                    <p className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span className="font-semibold">Payment:</span>{' '}
                      {order.paymentType} {order.isPaid && '(Paid)'}
                    </p>
                    <p className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      <span className="font-semibold">Date:</span>{' '}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    {extras.deliveryPerson && (
                      <p className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        <span className="font-semibold">Delivery By:</span>{' '}
                        {extras.deliveryPerson}
                      </p>
                    )}
                    {/* CONDITIONAL RENDERING OF ETA: */}
                    {!isDelivered && ( // Only show ETA if the order is NOT delivered
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">ETA:</span>{' '}
                        {extras.eta !== undefined && extras.eta > 0 // Check if eta exists and is positive
                          ? `${extras.eta.toFixed(0)} min` // Fixed to 0 decimal places for cleaner display
                          : 'Calculating...'} {/* Or 'Arriving Soon'/'--' if eta is 0 or undefined */}
                      </p>
                    )}
                    {/* You can optionally add a "Delivered" message here if you want: */}
                    {isDelivered && (
                        <p className="flex items-center gap-2 text-success font-semibold">
                            <PackageCheck className="w-4 h-4" />
                            Delivered!
                        </p>
                    )}
                  </div>

                  <div className="card-actions mt-4 justify-end">
                    <button
                      className="btn btn-sm btn-outline btn-primary flex items-center gap-2"
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
                          center={coords} // Center the map on the delivery address
                          zoom={15}
                          style={{ height: '250px', width: '100%', borderRadius: '12px' }}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker position={coords} icon={markerIcon}>
                            <Popup>Your Delivery Location</Popup>
                          </Marker>
                          {/* Only show delivery person marker and polyline if not delivered */}
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