import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

function LoginPage({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.message || "Login failed. Please check your credentials."
        );
      }

      const token = result.data.accessToken;
      localStorage.setItem("token", token);

      let userData = null;
      try {
        const profileRes = await fetch(
          "http://localhost:8000/api/v1/users/current-user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const profileData = await profileRes.json();
        userData = profileRes.ok ? profileData.data : { email };
      } catch (profileError) {
        console.error("Error fetching user profile:", profileError);
        userData = { email };
      }

      setUser(userData);

      // Only auto-close if not admin
      if (userData?.role !== "admin") {
        if (onClose) onClose();
        window.location.href = "/";
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminRedirect = () => {
    window.location.href = "/admin-panel";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 font-sans relative">
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: "url('/path/to/subtle-paper-texture-dark.png')",
          backgroundSize: "cover",
          backgroundBlendMode: "overlay",
        }}
      ></div>

      <div className="card w-full max-w-md bg-gray-800 shadow-xl p-10 rounded-2xl border border-gray-700 relative z-10">
        <h2 className="text-3xl font-serif font-bold text-blue-400 text-center mb-4">
          Welcome Back to PrintSprint
        </h2>
        <p className="text-center text-base text-gray-400 mb-8 leading-relaxed">
          Log in to manage your print jobs and orders
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="label" htmlFor="email">
              <span className="label-text text-gray-300">
                Email or Username
              </span>
            </label>
            <input
              id="email"
              type="email"
              className="input input-bordered w-full bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="e.g., you@example.com"
            />
          </div>

          <div>
            <label className="label" htmlFor="password">
              <span className="label-text text-gray-300">Password</span>
            </label>
            <input
              id="password"
              type="password"
              className="input input-bordered w-full bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="••••••••"
            />
          </div>

          {error && <div className="text-red-400 text-sm mt-2">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Logging In...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {user?.role === "admin" && (
          <button
            onClick={handleAdminRedirect}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all duration-200"
          >
            Go to Admin Panel
          </button>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm gap-2 sm:gap-0">
          <a
            href="#"
            className="link text-blue-300 hover:text-blue-200 hover:underline transition-colors duration-200"
          >
            Forgot password?
          </a>
          <a
            href="/signup"
            className="link text-blue-300 hover:text-blue-200 hover:underline transition-colors duration-200"
          >
            Don't have an account? Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
