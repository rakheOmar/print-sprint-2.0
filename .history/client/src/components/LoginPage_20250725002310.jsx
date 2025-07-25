import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Ensure Link is imported
import { useAuth } from '../context/AuthContext'; // Path to your AuthContext

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

  const { setUser } = useAuth(); // Destructure setUser from your AuthContext
  const navigate = useNavigate(); // Hook for navigation

  /**
   * Handles the login form submission.
   * Authenticates the user with the backend, stores the token,
   * fetches user data, sets the user in AuthContext,
   * and then redirects to the previous page or home.
   *
   * @param {Event} e - The form submission event.
   */
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError('');       // Clear previous errors
    setLoading(true);   // Set loading state to true

    try {
      // Step 1: Send login credentials to your backend API
      const response = await fetch('http://localhost:8000/api/v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json(); // Parse the JSON response

      // Check if the response was not OK (e.g., 400, 401, 500 status codes)
      if (!response.ok) {
        // Use the message from the API response if available, otherwise a generic one
        throw new Error(result.message || 'Login failed. Please check your credentials.');
      }

      // Step 2: Extract and save the access token
      const token = result.data.accessToken;
      localStorage.setItem('token', token); // Store token in localStorage

      // Step 3: Fetch current user profile using the new token
      let userData = null; // Initialize userData
      try {
        const profileRes = await fetch('http://localhost:8000/api/v1/users/current-user', {
          headers: { Authorization: `Bearer ${token}` }, // Send token in Authorization header
        });
        const profileData = await profileRes.json();

        if (profileRes.ok) {
          userData = profileData.data; // Set full user data if successful
        } else {
          // Fallback if fetching profile fails but login was successful
          console.warn("Failed to fetch user profile, using email as fallback.");
          userData = { email }; // Use email as a minimal user object
        }
      } catch (profileError) {
        console.error("Error fetching user profile:", profileError);
        userData = { email }; // Fallback in case of network or parsing error
      }

      // Step 4: Update the user context with the logged-in user's data
      setUser(userData);

      // Step 5: Handle redirection and modal closure
      if (onClose) {
        onClose(); // If this component is in a modal, call its close handler
      }

      // Navigate back to the previous page in history.
      // If there's no history (e.g., direct access to /login),
      // navigate(-1) might default to the root or do nothing,
      // which is generally desired behavior.
      navigate(-1);

    } catch (err) {
      // Catch any errors from fetch or custom thrown errors
      setError(err.message);
    } finally {
      // Always set loading to false, regardless of success or failure
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-lg p-8">
        <h2 className="text-2xl font-bold text-primary text-center">
          Welcome Back to PrintSprint
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Log in to manage your print jobs and orders
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">
              <span className="label-text">Email or Username</span>
            </label>
            <input
              id="email"
              type="text" // Can be 'email' type for better mobile keyboard
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading} // Disable input while loading
            />
          </div>

          <div>
            <label className="label" htmlFor="password">
              <span className="label-text">Password</span>
            </label>
            <input
              id="password"
              type="password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading} // Disable input while loading
            />
          </div>

          {/* Display error message if any */}
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Logging In...' : 'Log In'} {/* Change button text based on loading state */}
          </button>
        </form>

        <div className="flex justify-between items-center mt-4 text-sm">
          {/* Link for Forgot password */}
          <a href="#" className="link link-hover text-gray-400">Forgot password?</a>
          {/* Link to Sign Up page */}
          <Link to="/signup" className="link link-hover text-primary">
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;