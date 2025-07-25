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

// Earth's mean radius in meters
const EARTH_RADIUS_METERS = 6371000;

// Corrected function to calculate marker movement using geodesic calculations
const moveMarkerSmoothly = (currentPos, targetPos, distanceToTargetMeters, remainingEtaMinutes, intervalMs) => {
  const [currentLat, currentLon] = currentPos;
  const [targetLat, targetLon] = targetPos;

  // If already very close (e.g., within 1 meter), snap to target to prevent crawling
  if (distanceToTargetMeters < 1) {
    return targetPos;
  }

  // Convert remaining ETA to milliseconds
  const totalTimeRemainingMs = remainingEtaMinutes * 60 * 1000;

  // Calculate how many animation frames are expected to be left until arrival
  // Ensure at least 1 frame to prevent division by zero, ensuring movement always occurs
  const expectedFramesLeft = Math.max(1, Math.ceil(totalTimeRemainingMs / intervalMs));

  // Calculate the distance (in meters) the marker should cover in this single frame
  const distanceToCoverThisFrame = distanceToTargetMeters / expectedFramesLeft;

  // Ensure we don't overshoot by trying to move more than the actual remaining distance
  const actualDistanceToMove = Math.min(distanceToCoverThisFrame, distanceToTargetMeters);

  // --- GEODESIC CALCULATION FOR NEW POSITION ---
  // Convert current and target coordinates to radians
  const lat1Rad = currentLat * Math.PI / 180;
  const lon1Rad = currentLon * Math.PI / 180;
  const lat2Rad = targetLat * Math.PI / 180;
  const lon2Rad = targetLon * Math.PI / 180;

  // Calculate bearing (direction) from current to target
  const dLon = lon2Rad - lon1Rad;
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
            Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  const bearing = Math.atan2(y, x); // Bearing in radians

  // Calculate new latitude and longitude based on current position, bearing, and distance to move
  // This uses the "destination point given distance and bearing" formula
  const newLatRad = Math.asin(
    Math.sin(lat1Rad) * Math.cos(actualDistanceToMove / EARTH_RADIUS_METERS) +
    Math.cos(lat1Rad) * Math.sin(actualDistanceToMove / EARTH_RADIUS_METERS) * Math.cos(bearing)
  );

  let newLonRad = lon1Rad + Math.atan2(
    Math.sin(bearing) * Math.sin(actualDistanceToMove / EARTH_RADIUS_METERS) * Math.cos(lat1Rad),
    Math.cos(actualDistanceToMove / EARTH_RADIUS_METERS) - Math.sin(lat1Rad) * Math.sin(newLatRad)
  );

  // Normalize longitude to -180 to +180
  newLonRad = (newLonRad + 3 * Math.PI) % (2 * Math.PI) - Math.PI;

  // Convert back to degrees
  return [newLatRad * 180 / Math.PI, newLonRad * 180 / Math.PI];
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

  // Animate markers smoothly
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setOrderExtras((prev) => {
        const updated = { ...prev };
        let anyOrderStillTracking = false;

        for (const id in updated) {
          if (!updated[id].reached) {
            const currentMarkerPos = updated[id].marker;
            const currentEta = updated[id].eta; // in minutes

            const currentLatLng = L.latLng(currentMarkerPos);
            const targetLatLng = L.latLng(coords);
            const distanceToTargetMeters = currentLatLng.distanceTo(targetLatLng);

            const reached = distanceToTargetMeters < 10;

            let newPos;
            if (reached) {
              newPos = coords; // Snap to the final destination if considered reached
            } else {
              // Use the new, robust function for smooth movement
              newPos = moveMarkerSmoothly(currentMarkerPos, coords, distanceToTargetMeters, currentEta, 100);
            }

            let etaDecrement = 0.1; // Base decrement per 100ms (1 min/sec)
            const PROXIMITY_THRESHOLD_METERS = 300;
            const PROXIMITY_MULTIPLIER = 5;

            if (distanceToTargetMeters < PROXIMITY_THRESHOLD_METERS) {
              etaDecrement *= PROXIMITY_MULTIPLIER;
            }
            if (distanceToTargetMeters < 50) {
              etaDecrement *= 2;
            }

            updated[id] = {
              ...updated[id],
              marker: newPos,
              reached: reached,
              eta: reached ? 0 : Math.max(0, currentEta - etaDecrement),
            };

            if (!reached) {
              anyOrderStillTracking = true;
            }
          }
        }
        if (!anyOrderStillTracking) {
          clearInterval(animationInterval);
        }
        return updated;
      });
    }, 100);

    return () => clearInterval(animationInterval);
  }, [coords]);

  useEffect(() => {
    fetchOrders();
    setLocation('Mumbai, Maharashtra'); /* */
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
    <div className="p-6 w-full bg-gray-950 min-h-screen text-gray-100">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">📦 My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">No orders found.</p>
      ) : (
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