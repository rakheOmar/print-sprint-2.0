import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  BadgeInfo,
  CalendarDays,
  ShieldCheck,
  Hash,
  LogOut,
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const DetailRow = ({ icon: Icon, label, value, link }) => (
  <p className="flex items-center gap-2 text-lg">
    <Icon className="w-5 h-5 text-primary" />
    <span className="font-semibold">{label}:</span>
    {link ? (
      <a href={link} className="link link-primary break-all">{value}</a>
    ) : (
      <span className="break-words">{value}</span>
    )}
  </p>
);

const UserProfile = ({ userProfile, onLogout }) => (
  <div className="card w-full max-w-3xl bg-base-100 shadow-xl p-6">
    <figure className="px-10 pt-6">
      <div className="avatar">
        <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img
            src={userProfile.avatar}
            alt="User Avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/150x150/FF6B6B/FFFFFF?text=User';
            }}
          />
        </div>
      </div>
    </figure>

    <div className="card-body items-center text-center">
      <h2 className="card-title text-3xl font-bold mb-4 flex items-center gap-2">
        <User className="w-6 h-6 text-primary" />
        {userProfile.fullname}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left">
        <DetailRow icon={Mail} label="Email" value={userProfile.email} link={`mailto:${userProfile.email}`} />
        <DetailRow icon={Phone} label="Phone" value={userProfile.phone} link={`tel:${userProfile.phone}`} />
        <DetailRow icon={ShieldCheck} label="Role" value={userProfile.role} />
        <DetailRow icon={MapPin} label="Address" value={userProfile.address || 'N/A'} />
        <DetailRow icon={Hash} label="User ID" value={userProfile._id} />
        <DetailRow icon={CalendarDays} label="Created" value={new Date(userProfile.createdAt).toLocaleString()} />
        <DetailRow icon={BadgeInfo} label="Updated" value={new Date(userProfile.updatedAt).toLocaleString()} />
      </div>

      <div className="card-actions mt-6">
        <button className="btn btn-error text-lg flex items-center gap-2" onClick={onLogout}>
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>
  </div>
);

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem('token');
        if (!authToken) throw new Error('Authentication token is missing. Please log in.');

        const response = await fetch(`${API_BASE_URL}/users/current-user`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || 'Failed to fetch user profile.');

        setUser(result.message);
        setUserProfile(result.message);
      } catch (err) {
        setError(err.message);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [setUser]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
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
      <div className="flex justify-center items-center h-screen text-error text-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      {userProfile && <UserProfile userProfile={userProfile} onLogout={handleLogout} />}
    </div>
  );
};

export default ProfilePage;
