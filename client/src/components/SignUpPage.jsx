import React, { useState } from 'react';
import axios from 'axios';

function SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user'); // <--- default role
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [newlyRegisteredUser, setNewlyRegisteredUser] = useState(null);

  const handleRegistration = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!fullName || !email || !password || !confirmPassword || !avatar) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email address.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('fullname', fullName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('address', address);
    formData.append('phone', phone);
    formData.append('avatar', avatar);
    formData.append('role', role); // <--- send role

    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setIsRegistered(true);
      setNewlyRegisteredUser(response.data.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (isRegistered && newlyRegisteredUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <div className="card w-full max-w-md bg-base-100 shadow-lg p-6">
          <h2 className="text-2xl font-bold text-primary mb-4 text-center">Registration Successful!</h2>
          {newlyRegisteredUser.avatar && (
            <img
              src={newlyRegisteredUser.avatar}
              alt="User Avatar"
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
          )}
          <p className="text-center mb-2">
            Welcome, <strong>{newlyRegisteredUser.fullname}</strong>! Your account has been created.
          </p>
          <p className="text-center mb-4">You can now proceed to the login page.</p>
          <a href="/login" className="btn btn-primary w-full">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl p-8">
        <h2 className="text-2xl font-bold text-primary text-center">Join PrintSprint Today!</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Create your account to access our services.</p>

        <form onSubmit={handleRegistration} className="space-y-4">
          <input type="text" placeholder="Full Name" className="input input-bordered w-full" value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={loading} />
          <input type="email" placeholder="Email Address" className="input input-bordered w-full" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
          <input type="password" placeholder="Password" className="input input-bordered w-full" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
          <input type="password" placeholder="Confirm Password" className="input input-bordered w-full" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={loading} />
          <input type="file" accept="image/*" className="file-input file-input-bordered w-full" onChange={(e) => setAvatar(e.target.files[0])} required disabled={loading} />
          <input type="text" placeholder="Address (Optional)" className="input input-bordered w-full" value={address} onChange={(e) => setAddress(e.target.value)} disabled={loading} />
          <input type="tel" placeholder="Phone (Optional)" className="input input-bordered w-full" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading} />

          {/* Role Selection */}
          <select className="select select-bordered w-full" value={role} onChange={(e) => setRole(e.target.value)} disabled={loading}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Registering...' : 'Register Account'}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          Already have an account? <a href="/login" className="link link-primary">Log In Here</a>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
