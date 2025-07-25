import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
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
      if (!response.ok) throw new Error(result.message || 'Login failed');

      // Save token
      const token = result.data.accessToken;
      localStorage.setItem('token', token);

      // Optionally fetch user profile (if your API supports it)
      try {
        const profileRes = await fetch('http://localhost:8000/api/v1/users/current-user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = await profileRes.json();
        if (profileRes.ok) {
          setUser(profileData.data);
        } else {
          setUser({ email }); // fallback if profile fails
        }
      } catch {
        setUser({ email });
      }

      // ✅ Redirect to home page after login
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
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
              type="text"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div className="flex justify-between items-center mt-4 text-sm">
          <a href="#" className="link link-hover">Forgot password?</a>
          <a href="/signup" className="link link-hover text-primary">
            Don't have an account? Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
