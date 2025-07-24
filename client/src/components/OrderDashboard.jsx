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

const markerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [30, 30],
});

// Generate random location ~1km away
const getRandomNearbyLocation = (lat, lon, distance = 1) => {
  const R = 6378.1; // Earth radius in km
  const bearing = Math.random() * 2 * Math.PI; // random direction
  const newLat = Math.asin(
    Math.sin(lat * Math.PI / 180) * Math.cos(distance / R) +
    Math.cos(lat * Math.PI / 180) * Math.sin(distance / R) * Math.cos(bearing)
  );
  const newLon =
    lon * Math.PI / 180 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(distance / R) * Math.cos(lat * Math.PI / 180),
      Math.cos(distance / R) - Math.sin(lat * Math.PI / 180) * Math.sin(newLat)
    );
  return [newLat * 180 / Math.PI, newLon * 180 / Math.PI];
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

  const [orderExtras, setOrderExtras] = useState({}); // stores name, eta, marker for each order

  const coords = [19.0647384721062, 72.8357421770366]; // Fixed location (Mumbai)

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/orders/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok) {
        setOrders(result.data);

        // Generate extras for each order
        const extras = {};
        result.data.forEach((order) => {
          const randomDistance = 0.5 + Math.random() * 1.5; // 0.5km - 2km
          const randomName =
            deliveryPersons[Math.floor(Math.random() * deliveryPersons.length)];
          const randomETA = Math.floor(Math.random() * 15) + 1; // 1-15 minutes
          extras[order._id] = {
            marker: getRandomNearbyLocation(coords[0], coords[1], randomDistance),
            deliveryPerson: randomName,
            eta: randomETA,
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

  useEffect(() => {
    fetchOrders();
    setLocation('Mumbai, Maharashtra'); // fixed display location
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-40">Loading orders...</div>;
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
            const randomCoords = extras.marker || coords;
            return (
              <div
                key={order._id}
                className="card bg-color-300 text-white shadow-xl border border-base-300"
              >
                <div className="card-body">
                  <h2 className="card-title text-lg font-bold">
                    <PackageCheck className="w-5 h-5 text-primary" />
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h2>

                  <div
                    className={`badge badge-${
                      order.status === 'delivered' ? 'success' : 'info'
                    } mt-2 capitalize`}
                  >
                    {order.status}
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
                    {extras.eta && (
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">ETA:</span>{' '}
                        {extras.eta} min
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

                  {openMapId === order._id && (
                    <div className="mt-4 flex justify-center">
                      <div className="w-full max-w-md">
                        <MapContainer
                          center={coords}
                          zoom={15}
                          style={{ height: '250px', width: '100%', borderRadius: '12px' }}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker position={coords} icon={markerIcon}>
                            <Popup>Your Fixed Location</Popup>
                          </Marker>
                          <Marker position={randomCoords} icon={markerIcon}>
                            <Popup>
                              Delivery Person: {extras.deliveryPerson} <br />
                              ETA: {extras.eta} min
                            </Popup>
                          </Marker>
                          <Polyline positions={[coords, randomCoords]} color="blue" weight={3} />
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
