import React, { useState, useEffect } from 'react';
import { Mic, LocateFixed, ShoppingCart, User, LogOut, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [location, setLocation] = useState('Detecting...');

  const { user, logout } = useAuth();

  const openLogin = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const openSignup = () => {
    setAuthMode('signup');
    setAuthModalOpen(true);
  };

  const handleVoiceSearch = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      alert(`You said: ${voiceText}`);
    };
    recognition.start();
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocation('Geolocation unsupported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city = data?.address?.city || data?.address?.town || data?.address?.village || 'Unknown';
          setLocation(city);
        } catch (err) {
          console.error(err);
          setLocation('Location fetch failed');
        }
      },
      () => {
        setLocation('Permission denied');
      }
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

  return (
    <>
      <div className="navbar bg-base-100 shadow-md px-4 md:px-10 sticky top-0 z-50">
        {/* Logo */}
        <div className="flex-1">
          <Link to="/" className="text-2xl font-bold text-primary">PaperSprint</Link>
        </div>

        {/* Location Display */}
        <div className="flex items-center gap-2 text-sm text-gray-50 font-medium">
          <span className="truncate max-w-[100px]">{location}</span>
          <button className="btn btn-sm btn-ghost" onClick={detectLocation} title="Detect Location">
            <LocateFixed size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 ml-3">
          <input
            type="text"
            placeholder="Search..."
            className="input input-bordered input-sm w-48 md:w-64"
          />
          <button className="btn btn-square btn-sm" onClick={handleVoiceSearch}>
            <Mic size={18} />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 ml-4">
          {user ? (
            <>
              {/* Cart */}
              <Link to="/cart" className="btn btn-ghost btn-sm">
                <ShoppingCart size={20} />
              </Link>

              {/* User Dropdown */}
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-circle avatar btn-ghost">
                  <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={user.avatar || '/default-avatar.png'} alt="User Avatar" />
                  </div>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[99] p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User size={16} /> Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/order-dashboard" className="flex items-center gap-2">
                      <FileText size={16} /> Orders
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 text-error font-semibold"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <button onClick={openLogin} className="btn btn-outline btn-sm">Login</button>
              <button onClick={openSignup} className="btn btn-primary btn-sm">Sign Up</button>
            </>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
      />
    </>
  );
};

export default Navbar;
