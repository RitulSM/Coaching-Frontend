import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';
import axios from 'axios';


function UserLoginPage() {
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/user/login/student', {
        email,
        password
      });

      if (response.data.success) {
        const userData = {
          token: response.data.token,
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: 'student'
        };
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/student/batches');
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-md">
              <User className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white text-center">
            Welcome Back, Student!
          </h1>
          <p className="text-indigo-100 text-center mt-1">Please enter your details to login</p>
        </div>
        
        {/* Login Form */}
        <div className="p-8">
          {successMessage && (
            <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-lg border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-lg border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Are you a parent?{' '}
              <Link to="/parent/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Login here
              </Link>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/user/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLoginPage;