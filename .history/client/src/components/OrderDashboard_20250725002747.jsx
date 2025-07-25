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

// Function to move the marker slightly towards the target
const moveTowards = (current, target, eta) => {
  const [lat, lon] = current;
  const [tLat, tLon] = target;

  // Use Leaflet's L.latLng for more accurate distance calculation in meters
  const currentLatLng = L.latLng(lat, lon);
  const targetLatLng = L.latLng(tLat, tLon);

  const distanceMeters = currentLatLng.distanceTo(targetLatLng);

  // If already very close, snap to target
  if (distanceMeters < 1) { // 1 meter threshold for snapping
    return target;
  }

  // Calculate speed. Make this value smaller for slower animation.
  // This factor determines how many meters the marker moves per animation frame.
  const speedMetersPerFrame = 0.5; // Example: 0.5 meters per 100ms interval = 5m/s or 18km/h, adjust as needed

  // Ensure ETA influences speed, e.g., if ETA is larger, movement might seem slower
  // Or, simply use a constant speed if ETA is just for display.
  // For a more realistic "tracking", a constant speed (like 0.5m/s) often looks better than speed influenced by ETA.
  // If you want ETA to influence speed, you could do:
  // const speedMetersPerFrame = Math.min(distanceMeters, (distanceMeters / Math.max(1, eta * 60 * 10)) * (100 / 1000));
  // Let's stick with a simpler constant speed for now to ensure it moves.

  const fractionOfDistance = speedMetersPerFrame / distanceMeters;

  // Linear interpolation: newPos = current + (target - current) * fraction
  const newLat = lat + (tLat - lat) * fractionOfDistance;
  const newLon = lon + (tLon - lon) * fractionOfDistance;

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
  const coords = [19.0647384721062, 72.8357421770366];

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
        const extras = {};
        result.data.forEach((order) => {
          const isOrderDeliveredBackend = order.status === 'delivered';

          if (!isOrderDeliveredBackend) {
            // Generate a random initial position for the delivery person
            // and ensure it's not too close initially.
            let randomDistanceKm;
            let initialMarkerPos;
            let currentEta;

            do {
              randomDistanceKm = 0.5 + Math.random() * 5; // Distance from 0.5km to 5km
              const bearing = Math.random() * 2 * Math.PI; // Random direction

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

              // Calculate initial ETA based on distance (e.g., 5 min per km, plus a base)
              currentEta = Math.floor(randomDistanceKm * 5) + 2; // Min 2 minutes, longer for more distance

            } while (L.latLng(initialMarkerPos).distanceTo(L.latLng(coords)) < 50); // Ensure initial distance > 50 meters

            extras[order._id] = {
              marker: initialMarkerPos,
              deliveryPerson: deliveryPersons[Math.floor(Math.random() * deliveryPersons.length)],
              eta: currentEta,
              reached: false,
            };
          } else {
            // For orders already delivered by the backend
            extras[order._id] = {
              marker: coords,
              deliveryPerson: deliveryPersons[Math.floor(Math.random() * deliveryPersons.length)],
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

  // Effect for animating the markers using setInterval
  useEffect(() => {
    // Only start interval if there are orders and we are not in loading state
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
            const newPos = moveTowards(updated[id].marker, coords, updated[id].eta);

            const currentDistanceMeters = L.latLng(newPos).distanceTo(L.latLng(coords));
            const reached = currentDistanceMeters < 5; // 5 meters threshold for "reached"

            updated[id] = {
              ...updated[id],
              marker: reached ? coords : newPos,
              reached: reached,
              // Decrease ETA by a small fraction corresponding to the 100ms interval
              // For a 10 min ETA, it would take 10 * 60 * 1000 = 600,000 ms.
              // We decrement ETA (in minutes) by (interval_ms / total_ms_per_minute) = (100 / 60000)
              eta: reached ? 0 : Math.max(0, updated[id].eta - (100 / 60000)),
            };

            if (!reached) {
                anyOrderStillTracking = true;
            }
          }
        }

        // If no orders are tracking anymore, clear the interval
        if (!anyOrderStillTracking) {
            clearInterval(interval);
        }

        return updated;
      });
    }, 100); // Update every 100 milliseconds (10 times per second)

    // Cleanup function: important to prevent memory leaks and multiple intervals
    return () => clearInterval(interval);
  }, [orders, loading]); // Dependencies: re-run if orders or loading state changes

  // Initial data fetch and set fixed location display
  useEffect(() => {
    fetchOrders();
    setLocation('Mumbai, Maharashtra');
  }, []);

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
                        {extras.eta !== undefined && extras.eta > 0.1 // Use 0.1 instead of 0 for display threshold
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