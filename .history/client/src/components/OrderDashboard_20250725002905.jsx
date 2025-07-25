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
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom marker icon for delivery person/user location
const markerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Your custom marker
  iconSize: [30, 30],
});

/**
 * Calculates the new position of a marker moving towards a target based on remaining distance and ETA.
 * This ensures the marker arrives at the target when the ETA reaches zero (approximately).
 *
 * @param {Array<number>} current - [latitude, longitude] of the current marker position.
 * @param {Array<number>} target - [latitude, longitude] of the target destination.
 * @param {number} currentDistanceMeters - The current distance between current and target in meters.
 * @param {number} remainingEtaMinutes - The estimated time of arrival remaining in minutes.
 * @param {number} intervalMs - The interval (in milliseconds) at which this function is called (e.g., 100).
 * @returns {Array<number>} The new [latitude, longitude] for the marker.
 */
const moveTowards = (current, target, currentDistanceMeters, remainingEtaMinutes, intervalMs) => {
  const [lat, lon] = current;
  const [tLat, tLon] = target;

  // Snap to target if already very close (e.g., within 1 meter)
  if (currentDistanceMeters < 1) {
    return target;
  }

  // Calculate total remaining time in milliseconds
  const remainingEtaMs = remainingEtaMinutes * 60 * 1000;

  // Determine how many animation frames are left
  // Ensure we don't divide by zero or negative frames
  const framesLeft = remainingEtaMs > 0 ? remainingEtaMs / intervalMs : 1; // At least 1 frame if ETA is 0 or negative

  // Calculate the distance to cover in this single frame
  const distanceToMoveThisFrame = currentDistanceMeters / framesLeft;

  // Ensure we don't overshoot or move more than the remaining distance
  const actualDistanceToMove = Math.min(distanceToMoveThisFrame, currentDistanceMeters);

  // Calculate the fraction of the total distance to move in this frame
  // This fraction is applied to the latitude and longitude difference
  const fraction = actualDistanceToMove / currentDistanceMeters;

  const newLat = lat + (tLat - lat) * fraction;
  const newLon = lon + (tLon - lon) * fraction;

  return [newLat, newLon];
};

// Delivery person names for random assignment
const deliveryPersons = [
  'Ramesh Kumar', 'Suresh Patil', 'Amit Sharma', 'Pooja Iyer',
  'Karan Singh', 'Rajesh Verma', 'Meena Nair', 'Vikram Joshi',
  'Sunita Desai', 'Anil Gupta', 'Priya Rao', 'Manish Choudhary',
  'Neha Kulkarni', 'Ajay Mehta', 'Ravi Yadav',
];

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [openMapId, setOpenMapId] = useState(null);
  const [orderExtras, setOrderExtras] = useState({});
  // Fixed user's (delivery target) coordinates (e.g., Mumbai, Maharashtra)
  const coords = [19.0647384721062, 72.8357421770366]; // Approx Bandra Kurla Complex

  // Interval for animation updates (100ms = 10 updates per second)
  const ANIMATION_INTERVAL_MS = 100;

  // Function to fetch orders from the backend
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/orders/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (response.ok) {
        setOrders(result.data);
        const initialExtras = {};
        result.data.forEach((order) => {
          const isOrderDeliveredBackend = order.status === 'delivered';

          if (!isOrderDeliveredBackend) {
            let initialMarkerPos;
            let currentEtaMinutes;
            let initialDistanceMeters;

            // Loop to ensure the randomly generated starting point is not too close
            do {
              const randomDistanceKm = 0.5 + Math.random() * 5; // Distance from 0.5km to 5km
              const bearing = Math.random() * 2 * Math.PI; // Random direction in radians

              const latRad = coords[0] * Math.PI / 180;
              const lonRad = coords[1] * Math.PI / 180;

              const newLatRad = Math.asin(
                Math.sin(latRad) * Math.cos(randomDistanceKm / 6378.1) +
                Math.cos(latRad) * Math.sin(randomDistanceKm / 6378.1) * Math.cos(bearing)
              );
              const newLonRad =
                lonRad +
                Math.atan2(
                  Math.sin(bearing) * Math.sin(randomDistanceKm / 6378.1) * Math.cos(latRad),
                  Math.cos(randomDistanceKm / 6378.1) - Math.sin(latRad) * Math.sin(newLatRad)
                );
              initialMarkerPos = [newLatRad * 180 / Math.PI, newLonRad * 180 / Math.PI];

              // Calculate initial distance in meters for the ETA estimation
              initialDistanceMeters = L.latLng(initialMarkerPos).distanceTo(L.latLng(coords));

              // Estimate ETA based on distance, e.g., 5 minutes per km, plus a base time
              // Ensure minimum ETA for realistic tracking duration
              currentEtaMinutes = Math.max(2, Math.round(initialDistanceMeters / 1000 * 5)); // Min 2 mins, 5 min/km

            } while (initialDistanceMeters < 100); // Ensure initial distance is at least 100 meters

            initialExtras[order._id] = {
              marker: initialMarkerPos,
              deliveryPerson: deliveryPersons[Math.floor(Math.random() * deliveryPersons.length)],
              eta: currentEtaMinutes,
              reached: false,
            };
          } else {
            // For orders already delivered by the backend
            initialExtras[order._id] = {
              marker: coords, // Marker is at the destination
              deliveryPerson: deliveryPersons[Math.floor(Math.random() * deliveryPersons.length)],
              eta: 0,
              reached: true,
            };
          }
        });
        setOrderExtras(initialExtras);
      } else {
        console.error('Failed to fetch orders:', result.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effect for animating the markers using setInterval
  useEffect(() => {
    // Only start interval if orders are loaded and there's at least one order
    if (loading || orders.length === 0) return;

    const interval = setInterval(() => {
      setOrderExtras((prev) => {
        const updated = { ...prev };
        let anyOrderStillTracking = false;

        for (const id in updated) {
          const order = orders.find(o => o._id === id);
          const isDeliveredBackend = order?.status === 'delivered';

          // Only animate if the order is not yet delivered by the backend AND not reached by the animation
          if (!isDeliveredBackend && !updated[id].reached) {
            const currentLatLng = L.latLng(updated[id].marker);
            const targetLatLng = L.latLng(coords); // User's fixed location
            const currentDistanceMeters = currentLatLng.distanceTo(targetLatLng);

            const newPos = moveTowards(
              updated[id].marker,
              coords,
              currentDistanceMeters,
              updated[id].eta,
              ANIMATION_INTERVAL_MS
            );

            // Re-calculate distance after moving to check if reached
            const newDistanceMeters = L.latLng(newPos).distanceTo(targetLatLng);
            const reached = newDistanceMeters < 5; // 5 meters threshold for "reached"

            updated[id] = {
              ...updated[id],
              marker: reached ? coords : newPos, // Snap to target if reached
              reached: reached,
              // Decrease ETA by the fraction of a minute that passed (ANIMATION_INTERVAL_MS / 60000 ms per minute)
              eta: reached ? 0 : Math.max(0, updated[id].eta - (ANIMATION_INTERVAL_MS / 60000)),
            };

            if (!reached) { // If this order is still animating
                anyOrderStillTracking = true;
            }
          }
        }

        // If no orders are tracking anymore (all delivered/reached), clear the interval
        if (!anyOrderStillTracking && orders.length > 0) { // Add orders.length > 0 to prevent clearing on initial empty state
             clearInterval(interval);
        }

        return updated;
      });
    }, ANIMATION_INTERVAL_MS); // Update every 100 milliseconds

    // Cleanup function: important to clear the interval when the component unmounts or dependencies change
    return () => clearInterval(interval);
  }, [orders, loading, coords]); // Dependencies: orders state, loading state, and fixed coords

  // Initial data fetch and set fixed location display
  useEffect(() => {
    fetchOrders();
    setLocation('Mumbai, Maharashtra'); // This sets the displayed address text in the cards
  }, []); // Empty dependency array means this runs once on component mount

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="ml-3 text-lg text-gray-700">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-base-200 min-h-screen">
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
                        {extras.eta !== undefined && extras.eta > 0.1 // Use 0.1 as a small threshold for display
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