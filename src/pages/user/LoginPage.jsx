import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';
import axios from 'axios';
import { useDarkMode } from '../../utils/DarkModeContext';
import ThemeToggle from '../../components/ThemeToggle';


function UserLoginPage() {
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

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
    <div className={`flex justify-center items-center p-4 min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className={`overflow-hidden w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl`}>
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        {/* Header with gradient */}
        <div className="p-6 bg-gradient-to-r from-indigo-500 to-indigo-600">
          <div className="flex justify-center">
            <div className="flex justify-center items-center w-16 h-16 bg-white rounded-full shadow-md">
              <User className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-center text-white">
            Welcome Back, Student!
          </h1>
          <p className="mt-1 text-center text-indigo-100">Please enter your details to login</p>
        </div>
        
        {/* Login Form */}
        <div className="p-8">
          {successMessage && (
            <div className="p-3 mb-6 text-sm text-green-700 bg-green-50 rounded-lg">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="p-3 mb-6 text-sm text-red-700 bg-red-50 rounded-lg">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`px-4 py-3 mt-1 w-full ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50'} rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`px-4 py-3 mt-1 w-full ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50'} rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
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
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Are you a parent?{' '}
              <Link to="/parent/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Login here
              </Link>
            </p>
            <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <Link to="/user/register" className="font-medium text-indigo-600 hover:text-indigo-500">
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