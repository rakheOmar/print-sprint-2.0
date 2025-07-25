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
// This is crucial for Leaflet to find its default marker images.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom marker icon for delivery person/user location
const markerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Your custom marker
  iconSize: [30, 30],
  // You might need to adjust iconAnchor and popupAnchor based on your custom icon's design
  // iconAnchor: [15, 30], // point of the icon which will correspond to marker's location
  // popupAnchor: [0, -28] // point from which the popup should open relative to the iconAnchor
});

// Function to move the marker slightly towards the target
const moveTowards = (current, target, eta) => {
  const [lat, lon] = current;
  const [tLat, tLon] = target;
  const dLat = tLat - lat;
  const dLon = tLon - lon;
  const distance = Math.sqrt(dLat * dLat + dLon * dLon); // Distance in degrees (not meters)

  // If already very close, snap to target to prevent tiny oscillations
  if (distance < 0.000001) { // Very small threshold for snapping
    return target;
  }

  // Calculate speed. Smaller eta means faster movement.
  // The '0.000001' is a fine-tuning factor. Adjust this value to control overall animation speed.
  // Smaller value = slower animation.
  // We use Math.max(0.1, eta) to prevent division by zero or very large speeds if eta becomes tiny.
  const speed = 0.000001 * (1 / Math.max(0.1, eta));

  return [lat + (dLat / distance) * speed, lon + (dLon / distance) * speed];
};

// Delivery person names for random assignment
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
  const [location, setLocation] = useState(null); // This is likely the user's fixed delivery address text
  const [openMapId, setOpenMapId] = useState(null); // State to control which order's map is open
  const [orderExtras, setOrderExtras] = useState({}); // Stores dynamic data like marker position, ETA, delivery person
  // Fixed user's (delivery target) coordinates (e.g., Mumbai, Maharashtra)
  const coords = [19.0647384721062, 72.8357421770366];

  // Function to fetch orders from the backend
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token'); // Get auth token
      const response = await fetch('http://localhost:8000/api/v1/orders/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (response.ok) {
        setOrders(result.data);
        const extras = {};
        result.data.forEach((order) => {
          const isOrderDeliveredBackend = order.status === 'delivered';

          if (!isOrderDeliveredBackend) {
            // If order is not delivered, generate a random starting point for the delivery person
            const randomDistanceKm = 0.5 + Math.random() * 2.5; // Distance from 0.5km to 3km
            const bearing = Math.random() * 2 * Math.PI; // Random direction in radians
            const R = 6378.1; // Earth's radius in km

            // Haversine formula to calculate new coordinates given a distance and bearing
            const latRad = coords[0] * Math.PI / 180;
            const lonRad = coords[1] * Math.PI / 180;

            const newLatRad = Math.asin(
              Math.sin(latRad) * Math.cos(randomDistanceKm / R) +
              Math.cos(latRad) * Math.sin(randomDistanceKm / R) * Math.cos(bearing)
            );
            const newLonRad =
              lonRad +
              Math.atan2(
                Math.sin(bearing) * Math.sin(randomDistanceKm / R) * Math.cos(latRad),
                Math.cos(randomDistanceKm / R) - Math.sin(latRad) * Math.sin(newLatRad)
              );

            extras[order._id] = {
              marker: [newLatRad * 180 / Math.PI, newLonRad * 180 / Math.PI], // Convert back to degrees
              deliveryPerson:
                deliveryPersons[Math.floor(Math.random() * deliveryPersons.length)],
              eta: Math.floor(randomDistanceKm * 5) + 1, // Simple ETA estimation based on distance (e.g., 5 min/km)
              reached: false, // Initial animation state
            };
          } else {
            // For orders already delivered by the backend, set reached to true and ETA to 0
            extras[order._id] = {
              marker: coords, // Marker is at the destination
              deliveryPerson:
                deliveryPersons[Math.floor(Math.random() * deliveryPersons.length)],
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

  // Effect for animating the markers
  useEffect(() => {
    // Only start interval if there are orders
    if (orders.length === 0) return;

    const interval = setInterval(() => {
      setOrderExtras((prev) => {
        const updated = { ...prev };
        let anyOrderStillTracking = false; // Flag to check if any order needs animation

        for (const id in updated) {
          // Find the actual order object to get its current backend status
          const order = orders.find(o => o._id === id);
          const isDeliveredBackend = order?.status === 'delivered';

          // Only animate if the order is not yet delivered by the backend AND not reached by the animation
          if (!isDeliveredBackend && !updated[id].reached) {
            const newPos = moveTowards(updated[id].marker, coords, updated[id].eta);

            // Calculate current distance in meters using Leaflet's utility for accuracy
            const currentDistanceMeters = L.latLng(newPos).distanceTo(L.latLng(coords));

            // Define "reached" when marker is very close to the target (e.g., within 5 meters)
            const reached = currentDistanceMeters < 5;

            updated[id] = {
              ...updated[id],
              marker: reached ? coords : newPos, // Snap to target if reached
              reached: reached, // Update the reached status for the animation
              // Decrease ETA only if not reached. (100ms / 60000ms per min) makes ETA drop slowly.
              eta: reached ? 0 : Math.max(0, updated[id].eta - (100 / 60000)),
            };

            if (!reached) { // If this order is still animating
                anyOrderStillTracking = true;
            }
          }
        }

        // If no orders are tracking anymore, clear the interval
        if (!anyOrderStillTracking && orders.every(o => orderExtras[o._id]?.reached || o.status === 'delivered')) {
            clearInterval(interval);
        }

        return updated;
      });
    }, 100); // Update every 100 milliseconds

    // Cleanup function to clear the interval when the component unmounts or dependencies change
    return () => clearInterval(interval);
  }, [orders]); // Re-run effect if 'orders' state changes (e.g., after initial fetch)

  // Initial data fetch and set fixed location display
  useEffect(() => {
    fetchOrders();
    setLocation('Mumbai, Maharashtra'); // This sets the displayed address in the cards
  }, []); // Empty dependency array means this runs once on component mount

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="ml-3 text-lg text-gray-700">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">📦 My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            const extras = orderExtras[order._id] || {};
            // Determine if the order is considered "delivered" for display purposes
            const isDelivered = extras.reached || order.status === 'delivered';

            return (
              <div
                key={order._id}
                className="card bg-base-100 text-base-content shadow-xl border border-base-300"
              >
                <div className="card-body">
                  <h2 className="card-title text-lg font-bold text-primary">
                    <PackageCheck className="w-5 h-5 text-primary" />
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h2>

                  <div
                    className={`badge badge-${isDelivered ? 'success' : 'primary'} mt-2 capitalize`}
                  >
                    {isDelivered ? 'delivered' : order.status}
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-gray-700">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent" />
                      <span className="font-semibold">Address:</span>{' '}
                      {location || order.deliveryAddress}
                    </p>
                    <p className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-success" />
                      <span className="font-semibold">Total:</span> ₹
                      {order.totalAmount}
                    </p>
                    <p className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-info" />
                      <span className="font-semibold">Payment:</span>{' '}
                      {order.paymentType} {order.isPaid && '(Paid)'}
                    </p>
                    <p className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-warning" />
                      <span className="font-semibold">Date:</span>{' '}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    {extras.deliveryPerson && (
                      <p className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-secondary" />
                        <span className="font-semibold">Delivery By:</span>{' '}
                        {extras.deliveryPerson}
                      </p>
                    )}
                    {/* Conditional rendering for ETA: only show if NOT delivered */}
                    {!isDelivered && (
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-error" />
                        <span className="font-semibold">ETA:</span>{' '}
                        {extras.eta !== undefined && extras.eta > 0
                          ? `${extras.eta.toFixed(0)} min`
                          : 'Arriving soon...'}
                      </p>
                    )}
                    {/* Optional: Show a "Delivered!" message when applicable */}
                    {isDelivered && (
                        <p className="flex items-center gap-2 text-success font-semibold">
                            <PackageCheck className="w-4 h-4" />
                            Order Delivered!
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
                          {/* User's fixed location marker */}
                          <Marker position={coords} icon={markerIcon}>
                            <Popup>Your Delivery Location</Popup>
                          </Marker>
                          {/* Delivery person's marker and polyline only if not delivered */}
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