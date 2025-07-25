import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  ShieldCheck,
  LogOut,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8000/api/v1";

const DetailRow = ({ icon: Icon, label, value, link }) => (
  <p className="flex items-center gap-2 text-lg">
    <Icon className="w-5 h-5 text-primary" />
    <span className="font-semibold">{label}:</span>
    {link ? (
      <a href={link} className="link link-primary break-all text-base-content">
        {value}
      </a>
    ) : (
      <span className="break-words text-base-content">{value}</span>
    )}
  </p>
);

const PartnerDashboard = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem("token");
        if (!authToken) throw new Error("No token found. Please log in.");

        const res = await fetch(`${API_BASE_URL}/users/current-user`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        const result = await res.json();
        if (!res.ok || !result.data)
          throw new Error(result.message || "Failed to fetch user.");

        if (result.data.role !== "partner") {
          throw new Error(
            "Access denied. Only partners can access this dashboard."
          );
        }

        setUser(result.data);
        setUserProfile(result.data);
      } catch (err) {
        setError(err.message);
        localStorage.removeItem("token");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, setUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-error text-xl text-center px-4">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <h1 className="text-4xl font-bold text-center mb-10">
        Partner Dashboard
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Partner Profile Card */}
        <div className="card bg-base-100 shadow-xl p-6 col-span-1">
          <div className="flex flex-col items-center">
            <div className="avatar mb-4">
              <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={userProfile.avatar}
                  alt="User Avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/150x150/FF6B6B/FFFFFF?text=User";
                  }}
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4">{userProfile.fullname}</h2>
            <div className="space-y-2 w-full">
              <DetailRow
                icon={Mail}
                label="Email"
                value={userProfile.email}
                link={`mailto:${userProfile.email}`}
              />
              <DetailRow
                icon={Phone}
                label="Phone"
                value={userProfile.phone}
                link={`tel:${userProfile.phone}`}
              />
              <DetailRow
                icon={ShieldCheck}
                label="Role"
                value={userProfile.role}
              />
              <DetailRow
                icon={MapPin}
                label="Address"
                value={userProfile.address || "N/A"}
              />
              <DetailRow
                icon={CalendarDays}
                label="Joined"
                value={new Date(userProfile.createdAt).toLocaleString()}
              />
            </div>
            <button className="btn btn-error mt-6" onClick={handleLogout}>
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Sales Stats */}
        <div className="col-span-2 grid md:grid-cols-2 gap-6">
          <div className="stat bg-base-100 shadow-xl">
            <div className="stat-title text-primary">
              Total Orders Fulfilled
            </div>
            <div className="stat-value text-4xl">342</div>
            <div className="stat-desc">From Jan 2024 to Today</div>
          </div>

          <div className="stat bg-base-100 shadow-xl">
            <div className="stat-title text-primary">
              Total Revenue Generated
            </div>
            <div className="stat-value text-4xl">₹1,42,000</div>
            <div className="stat-desc">+18% from last month</div>
          </div>

          <div className="stat bg-base-100 shadow-xl col-span-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="stat-title text-primary">
                  Satisfaction Rating
                </div>
                <div className="stat-value text-4xl">92%</div>
                <div className="stat-desc">Based on 130+ reviews</div>
              </div>
              <div
                className="radial-progress text-primary text-2xl"
                style={{ "--value": 92 }}
                role="progressbar"
              >
                92%
              </div>
            </div>
          </div>

          <div className="stat bg-base-100 shadow-xl">
            <div className="stat-title text-primary">Avg. Delivery Time</div>
            <div className="stat-value text-4xl">12 mins</div>
            <div className="stat-desc">Fastest among city partners</div>
          </div>

          <div className="stat bg-base-100 shadow-xl">
            <div className="stat-title text-primary">Pending Payout</div>
            <div className="stat-value text-4xl">₹8,400</div>
            <div className="stat-desc">Next payout on 31st July</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
