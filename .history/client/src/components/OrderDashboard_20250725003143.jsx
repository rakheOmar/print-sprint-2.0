import React, { useEffect, useState, useRef } from 'react';
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

  if (currentDistanceMeters < 1) {
    return target;
  }

  const remainingEtaMs = remainingEtaMinutes * 60 * 1000;
  const framesLeft = Math.max(1, Math.ceil(remainingEtaMs / intervalMs));

  const distanceToMoveThisFrame = currentDistanceMeters / framesLeft;
  const actualDistanceToMove = Math.min(distanceToMoveThisFrame, currentDistanceMeters);
  const fraction = actualDistanceToMove / currentDistanceMeters;

  const newLat = lat + (tLat - lat) * fraction;
  const newLon = lon + (tLon - lon) * fraction;

  return [newLat, newLon];
};

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
  const intervalRef = useRef(null);
  
  const coords = [19.0647384721062, 72.8357421770366]; // Approx Bandra Kurla Complex
  const ANIMATION_INTERVAL_MS = 100;

  // --- Start of fetchOrders function ---
  const fetchOrders = async () => {
    console.log("DEBUG: fetchOrders started. Setting loading to TRUE.");
    setLoading(true); // Ensure loading is true right at the start of the fetch process
    try {
      const token = localStorage.getItem('token');
      if (!token) {
          console.error("DEBUG: Authentication token not found in localStorage. Cannot fetch orders.");
          // You might want to redirect to login here or show a user-friendly error
          setLoading(false); // Make sure loading is false even if no token
          return;
      }
      console.log("DEBUG: Attempting to fetch from http://localhost:8000/api/v1/orders/my");
      const response = await fetch('http://localhost:8000/api/v1/orders/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("DEBUG: Fetch response received. Status:", response.status);

      // Check for non-OK responses (e.g., 401, 403, 404, 500)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        console.error(`DEBUG: Failed to fetch orders. Status: ${response.status}. Message:`, errorData.message || response.statusText);
        // You could handle specific errors here, e.g., if (response.status === 401) logoutUser();
        setOrders([]); // Ensure orders is an empty array on error
        setOrderExtras({}); // Clear any previous extras
        return; // Exit the function on error
      }

      const result = await response.json();
      console.log("DEBUG: Fetch result parsed successfully. Data:", result.data);

      setOrders(result.data); // Update orders state
      console.log("DEBUG: Orders state set. New orders.length:", result.data.length);

      const initialExtras = {};
      if (result.data && result.data.length > 0) {
        result.data.forEach((order) => {
          const isOrderDeliveredBackend = order.status === 'delivered';

          if (!isDeliveredBackend) {
            let initialMarkerPos;
            let currentEtaMinutes;
            let initialDistanceMeters;
            let attempts = 0;

            do {
              attempts++;
              const randomDistanceKm = 0.5 + Math.random() * 8;
              const bearing = Math.random() * 2 * Math.PI;

              const latRad = coords[0] * Math.PI / 180;
              const lonRad = coords[1] * Math.PI / 180;

              const newLatRad = Math.asin(
                Math.sin(latRad) * Math.cos(randomDistanceKm / 6378.1) +
                Math.cos(latRad) * Math.sin(randomLatRad) * Math.sin(randomDistanceKm / 6378.1) * Math.cos(bearing) // Fixed potential bug here: should be cos(latRad) not sin(randomLatRad)
              );
              const newLonRad =
                lonRad +
                Math.atan2(
                  Math.sin(bearing) * Math.sin(randomDistanceKm / 6378.1) * Math.cos(latRad),
                  Math.cos(randomDistanceKm / 6378.1) - Math.sin(latRad) * Math.sin(newLatRad)
                );
              initialMarkerPos = [newLatRad * 180 / Math.PI, newLonRad * 180 / Math.PI];

              initialDistanceMeters = L.latLng(initialMarkerPos).distanceTo(L.latLng(coords));
              currentEtaMinutes = Math.max(1, Math.round(initialDistanceMeters / 1000 * 5));

            } while (initialDistanceMeters < 200 && attempts < 100);

            if (attempts >= 100) {
              console.warn(`DEBUG: Could not generate sufficient initial distance for order ${order._id}, defaulting.`);
              initialMarkerPos = [coords[0] + 0.005, coords[1] + 0.005];
              initialDistanceMeters = L.latLng(initialMarkerPos).distanceTo(L.latLng(coords));
              currentEtaMinutes = Math.max(1, Math.round(initialDistanceMeters / 1000 * 5));
            }

            initialExtras[order._id] = {
              marker: initialMarkerPos,
              deliveryPerson: deliveryPersons[Math.floor(Math.random() * deliveryPersons.length)],
              eta: currentEtaMinutes,
              reached: false,
            };
            console.log(`DEBUG: Order ${order._id}: Initializing tracking. Dist: ${initialDistanceMeters.toFixed(2)}m, ETA: ${currentEtaMinutes.toFixed(2)}min`);

          } else {
            initialExtras[order._id] = {
              marker: coords,
              deliveryPerson: deliveryPersons[Math.floor(Math.random() * deliveryPersons.length)],
              eta: 0,
              reached: true,
            };
            console.log(`DEBUG: Order ${order._id}: Marked as Delivered by backend.`);
          }
        });
      } else {
          console.log("DEBUG: No data received for orders from backend.");
      }
      setOrderExtras(initialExtras);
      console.log("DEBUG: Initial orderExtras set:", initialExtras);

    } catch (error) {
      console.error('DEBUG: Critical error in fetchOrders:', error);
      setOrders([]); // Clear orders on critical error
      setOrderExtras({}); // Clear extras on critical error
    } finally {
      setLoading(false); // ALWAYS set loading to false in finally block
      console.log("DEBUG: fetchOrders finished. Setting loading to FALSE.");
    }
  };
  // --- End of fetchOrders function ---

  // --- Start of animation useEffect ---
  useEffect(() => {
    console.log(`DEBUG (Animation useEffect): Triggered. Current loading=${loading}, orders.length=${orders.length}`);

    // Clear any existing interval to prevent multiple intervals running
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      console.log(`DEBUG (Animation useEffect): Cleared previous interval ID: ${intervalRef.current}`);
    }

    // This is the CRITICAL guard check
    if (loading || orders.length === 0) {
        console.log(`DEBUG (Animation useEffect): Interval NOT started because loading is ${loading} or orders.length is ${orders.length}.`);
        return; // Prevents setInterval from being created
    }

    // Check if all orders are already delivered on load, no need to animate
    const allOrdersInitiallyDeliveredOrReached = orders.every(order => {
        const extras = orderExtras[order._id];
        return order.status === 'delivered' || (extras && extras.reached);
    });

    if (allOrdersInitiallyDeliveredOrReached) {
        console.log("DEBUG (Animation useEffect): All orders are initially delivered or reached. No tracking interval will be started.");
        return;
    }

    console.log("DEBUG (Animation useEffect): All conditions met. Starting new interval.");
    intervalRef.current = setInterval(() => {
      setOrderExtras((prev) => {
        const updated = { ...prev };
        let trackingInProgress = false; // Flag to indicate if ANY order is still being tracked

        for (const order of orders) { // Iterate over the original orders state
            const id = order._id;
            const extras = updated[id];

            if (!extras) { // This can happen if orderExtras isn't fully synced yet, or an order was removed
                // console.warn(`DEBUG (Animation Loop): No extras found for order ID ${id}. Skipping.`);
                continue;
            }

            const isDeliveredBackend = order.status === 'delivered';

            if (!isDeliveredBackend && !extras.reached) {
              const currentLatLng = L.latLng(extras.marker);
              const targetLatLng = L.latLng(coords);
              const currentDistanceMeters = currentLatLng.distanceTo(targetLatLng);

              const newPos = moveTowards(
                extras.marker,
                coords,
                currentDistanceMeters,
                extras.eta,
                ANIMATION_INTERVAL_MS
              );

              const newDistanceMeters = L.latLng(newPos).distanceTo(targetLatLng);
              const reached = newDistanceMeters < 5; // 5 meters threshold for "reached"

              updated[id] = {
                ...extras,
                marker: reached ? coords : newPos,
                reached: reached,
                eta: reached ? 0 : Math.max(0, extras.eta - (ANIMATION_INTERVAL_MS / 60000)),
              };

              // Log animation progress for actively moving orders
              // console.log(`DEBUG (Animation Loop): Order ${id} - Dist: ${currentDistanceMeters.toFixed(2)}m -> ${newDistanceMeters.toFixed(2)}m, ETA: ${updated[id].eta.toFixed(2)}min, Reached: ${reached}`);

              if (!reached) {
                  trackingInProgress = true; // At least one order is still moving
              }
            } else {
                // console.log(`DEBUG (Animation Loop): Order ${id} - Not animating. Backend delivered: ${isDeliveredBackend}, Already reached: ${extras.reached}`);
            }
        }

        if (!trackingInProgress) {
            console.log("DEBUG (Animation Loop): No active orders left to track. Clearing interval.");
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
        return updated;
      });
    }, ANIMATION_INTERVAL_MS);

    // Cleanup function for useEffect
    return () => {
        console.log("DEBUG (Animation useEffect Cleanup): Running. Clearing interval.");
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };
  }, [orders, loading, coords, orderExtras]); // Added orderExtras as dependency for safety, although orders/loading should be sufficient if state updates are fast enough

  // Initial data fetch on component mount
  useEffect(() => {
    console.log("DEBUG: Initial useEffect for data fetch triggered.");
    fetchOrders();
    setLocation('Mumbai, Maharashtra');
  }, []);

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
                    {!isDelivered && (
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-error" />
                        <span className="font-semibold">ETA:</span>{' '}
                        {extras.eta !== undefined && extras.eta > 0.1
                          ? `${extras.eta.toFixed(0)} min`
                          : 'Arriving soon...'}
                      </p>
                    )}
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
                          center={coords}
                          zoom={15}
                          style={{ height: '250px', width: '100%', borderRadius: '12px' }}
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