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
const moveTowards = (current, target, eta) => {
  const [lat, lon] = current;
  const [tLat, tLon] = target;
  const dLat = tLat - lat;
  const dLon = tLon - lon;
  const distance = Math.sqrt(dLat * dLat + dLon * dLon); // Distance in degrees

  if (distance < 0.0001) return target; // If very close, just return target

  // Cap eta at a minimum value for speed calculation to prevent sudden slowdown
  const effectiveEtaForSpeed = Math.max(0.01, eta); // Ensure eta is at least 0.01 for speed calculation
  const speed = 0.0005 / effectiveEtaForSpeed; // speed is in degrees per frame

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
  const coords = [19.0647384721062, 72.8357421770366]; // Fixed delivery location (Bandra Kurla Complex)

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
          const randomDistanceKm = 0.5 + Math.random() * 1.5; // 0.5km - 2km
          const bearing = Math.random() * 2 * Math.PI; // Random direction
          const R = 6378.1; // Earth's radius in kilometers

          // Calculate initial random position using Haversine formula for spherical coordinates
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
            marker: [newLatRad * 180 / Math.PI, newLonRad * 180 / Math.PI],
            deliveryPerson:
              deliveryPersons[Math.floor(Math.random() * deliveryPersons.length)],
            eta: Math.floor(Math.random() * 15) + 1, // Initial ETA between 1 and 15 minutes
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

  // Animate markers with speed proportional to ETA
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setOrderExtras((prev) => {
        const updated = { ...prev };
        let anyOrderStillTracking = false; // Flag to check if any order needs animation

        for (const id in updated) {
          if (!updated[id].reached) {
            const currentMarkerPos = updated[id].marker;
            const currentEta = updated[id].eta;

            // Calculate new position using the moveTowards function
            const newPos = moveTowards(currentMarkerPos, coords, currentEta);

            // Calculate actual distance to target in meters using Leaflet for accuracy
            const currentLatLng = L.latLng(currentMarkerPos);
            const targetLatLng = L.latLng(coords);
            const distanceToTargetMeters = currentLatLng.distanceTo(targetLatLng);

            // Determine if the marker has reached the target
            // Using a small threshold for floating point comparison and "arrived"
            const reached = distanceToTargetMeters < 10; // Consider reached if within 10 meters

            // Determine how fast ETA should decrease
            let etaDecrement = 0.05; // Default faster decrement than 0.01
            const PROXIMITY_THRESHOLD_METERS = 300; // Increase speed when within 300m
            const PROXIMITY_MULTIPLIER = 5; // Decrease ETA X times faster when very close

            if (distanceToTargetMeters < PROXIMITY_THRESHOLD_METERS) {
              etaDecrement *= PROXIMITY_MULTIPLIER; // Accelerate ETA decrease
            }
            if (distanceToTargetMeters < 50) { // Even faster closer to delivery
              etaDecrement *= 2;
            }

            // --- DEBUG LOGS ---
            // if (id === Object.keys(updated)[0]) { // Log only for the first order to avoid console spam
            //     console.log(`DEBUG: Order ${id.slice(-6).toUpperCase()}`);
            //     console.log(`  Current ETA: ${currentEta.toFixed(2)} min`);
            //     console.log(`  Distance: ${distanceToTargetMeters.toFixed(2)}m`);
            //     console.log(`  ETA Decrement: ${etaDecrement.toFixed(2)}`);
            //     console.log(`  New ETA: ${Math.max(0, currentEta - etaDecrement).toFixed(2)} min`);
            //     console.log(`  Reached: ${reached}`);
            //     console.log(`  New Position: [${newPos[0].toFixed(5)}, ${newPos[1].toFixed(5)}]`);
            // }
            // --- END DEBUG LOGS ---


            updated[id] = {
              ...updated[id],
              marker: reached ? coords : newPos,
              reached: reached,
              eta: reached ? 0 : Math.max(0, currentEta - etaDecrement), // Decrease ETA
            };

            if (!reached) {
              anyOrderStillTracking = true; // Keep track if any order is still animating
            }
          }
        }

        // Clear interval if all orders have reached their destination
        if (!anyOrderStillTracking) {
          clearInterval(animationInterval);
        }

        return updated;
      });
    }, 100); // Animation interval every 100ms

    // Cleanup function for useEffect
    return () => clearInterval(animationInterval);
  }, [coords]); // Dependency array: Re-run effect if coords change

  useEffect(() => {
    fetchOrders();
    setLocation('Mumbai, Maharashtra'); // Fixed user location name for display
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950">
        <span className="loading loading-spinner loading-lg text-gray-400"></span>
        <p className="ml-3 text-lg text-gray-400">Loading orders...</p>
      </div>
    );
  }

  return (
    // Changed the main container class from "p-6 max-w-6xl mx-auto" to "p-6 w-full"
    // The 'w-full' makes it take full width, while 'p-6' provides some padding from edges
    <div className="p-6 w-full bg-gray-950 min-h-screen text-gray-100">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">📦 My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">No orders found.</p>
      ) : (
        // To maintain card grouping within a reasonable width while allowing the section to be full width,
        // we can wrap the grid in a max-width container with auto margins.
        // This ensures cards don't stretch ridiculously wide on very large screens.
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => {
                    const extras = orderExtras[order._id] || {};
                    const isDelivered = extras.reached || order.status === 'delivered';

                    return (
                    <div
                        key={order._id}
                        className="card bg-gray-800 text-gray-100 shadow-xl border border-gray-700 rounded-lg overflow-hidden"
                    >
                        <div className="card-body p-6">
                        <h2 className="card-title text-xl font-bold text-blue-400 mb-2 flex items-center gap-2">
                            <PackageCheck className="w-6 h-6 text-blue-300" />
                            Order #{order._id.slice(-6).toUpperCase()}
                        </h2>

                        <div
                            className={`badge ${isDelivered ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'} mt-2 px-3 py-1 rounded-full text-xs font-semibold uppercase`}
                        >
                            {isDelivered ? 'delivered' : order.status}
                        </div>

                        <div className="mt-5 space-y-3 text-sm text-gray-300">
                            <p className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-purple-400" />
                            <span className="font-semibold">Address:</span>{' '}
                            {location || order.deliveryAddress}
                            </p>
                            <p className="flex items-center gap-3">
                            <IndianRupee className="w-5 h-5 text-green-500" />
                            <span className="font-semibold">Total:</span> ₹
                            {order.totalAmount}
                            </p>
                            <p className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-indigo-400" />
                            <span className="font-semibold">Payment:</span>{' '}
                            {order.paymentType} {order.isPaid && '(Paid)'}
                            </p>
                            <p className="flex items-center gap-3">
                            <CalendarDays className="w-5 h-5 text-orange-400" />
                            <span className="font-semibold">Date:</span>{' '}
                            {new Date(order.createdAt).toLocaleString()}
                            </p>
                            {extras.deliveryPerson && (
                            <p className="flex items-center gap-3">
                                <UserIcon className="w-5 h-5 text-teal-400" />
                                <span className="font-semibold">Delivery By:</span>{' '}
                                {extras.deliveryPerson}
                            </p>
                            )}
                            {!isDelivered ? (
                            <p className="flex items-center gap-3 text-red-400 font-bold">
                                <Clock className="w-5 h-5" />
                                <span className="font-semibold">ETA:</span>{' '}
                                {extras.eta !== undefined && extras.eta > 0.1
                                ? `${extras.eta.toFixed(0)} min`
                                : 'Arriving soon...'}
                            </p>
                            ) : (
                                <p className="flex items-center gap-3 text-green-500 font-bold">
                                    <PackageCheck className="w-5 h-5" />
                                    Order Delivered!
                                </p>
                            )}
                        </div>

                        <div className="card-actions mt-6 justify-end">
                            <button
                            className="btn btn-sm flex items-center gap-2 px-4 py-2 rounded-md transition duration-200 bg-gray-700 text-white border-gray-600 hover:bg-gray-600 hover:border-gray-500"
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
                                style={{ height: '250px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}
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
                                    <Polyline positions={[coords, extras.marker]} color="#42a5f5" weight={3} />
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
        </div>
      )}
    </div>
  );
};

export default UserDashboard;