import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Ensure Link is imported
import { useAuth } from '../context/AuthContext'; // Path to your AuthContext
import { Loader2 } from 'lucide-react'; // Import a spinner icon

/**
 * LoginPage component handles user login.
 * It can be used as a standalone page or rendered within a modal.
 *
 * @param {object} props - Component props.
 * @param {function} [props.onClose] - Optional callback to close a parent modal if this component is used within one.
 */
function LoginPage({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed. Please check your credentials.');
      }

      const token = result.data.accessToken;
      localStorage.setItem('token', token);

      let userData = null;
      try {
        const profileRes = await fetch('http://localhost:8000/api/v1/users/current-user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = await profileRes.json();

        if (profileRes.ok) {
          userData = profileData.data;
        } else {
          console.warn("Failed to fetch user profile, using email as fallback.");
          userData = { email };
        }
      } catch (profileError) {
        console.error("Error fetching user profile:", profileError);
        userData = { email };
      }

      setUser(userData);

      if (onClose) {
        onClose();
      }
      navigate(-1);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 font-sans relative"> {/* Darker background, added font-sans, relative for bg pattern */}
      {/* Subtle Texture/Pattern Overlay (Old style) */}
      <div className="absolute inset-0 z-0 opacity-10"
           style={{
             backgroundImage: "url('/path/to/subtle-paper-texture-dark.png')", // A dark paper or subtle grunge texture
             backgroundSize: 'cover',
             backgroundBlendMode: 'overlay',
           }}
      ></div>

      <div className="card w-full max-w-md bg-gray-800 shadow-xl p-10 rounded-2xl border border-gray-700 relative z-10"> {/* Richer background, stronger shadow, more padding, rounded, border */}
        <h2 className="text-3xl font-serif font-bold text-blue-400 text-center mb-4"> {/* Serif font, accent color */}
          Welcome Back to PrintSprint
        </h2>
        <p className="text-center text-base text-gray-400 mb-8 leading-relaxed"> {/* Slightly larger text, softer gray, more margin */}
          Log in to manage your print jobs and orders
        </p>

        <form onSubmit={handleLogin} className="space-y-6"> {/* Increased vertical space */}
          <div>
            <label className="label" htmlFor="email">
              <span className="label-text text-gray-300">Email or Username</span>
            </label>
            <input
              id="email"
              type="email" // Use type="email" for better validation and mobile keyboard
              className="input input-bordered w-full bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200" // Styled for dark mode, focus effects
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="e.g., you@example.com" // Placeholder text
            />
          </div>

          <div>
            <label className="label" htmlFor="password">
              <span className="label-text text-gray-300">Password</span>
            </label>
            <input
              id="password"
              type="password"
              className="input input-bordered w-full bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200" // Styled for dark mode, focus effects
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="••••••••" // Placeholder text
            />
          </div>

          {error && <div className="text-red-400 text-sm mt-2">{error}</div>} {/* Brighter red for error */}

          <button
            type="submit"
            className="btn btn-primary w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2" // Custom button styling, flex for spinner
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" /> {/* Spinner icon */}
                Logging In...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm gap-2 sm:gap-0"> {/* Adjusted for better mobile stack, sm:flex-row */}
          <a href="#" className="link text-blue-300 hover:text-blue-200 hover:underline transition-colors duration-200">Forgot password?</a> {/* Brighter blue, hover underline */}
          <Link to="/signup" className="link text-blue-300 hover:text-blue-200 hover:underline transition-colors duration-200">
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;