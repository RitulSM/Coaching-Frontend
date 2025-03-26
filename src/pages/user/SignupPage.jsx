import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import axios from 'axios';
import { z } from 'zod';
import { useDarkMode } from '../../utils/DarkModeContext';
import ThemeToggle from '../../components/ThemeToggle';

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

function UserSignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useDarkMode(); // Use the dark mode hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      registerSchema.parse({ name, email, password });
      
      const response = await axios.post('http://localhost:3000/user/register', {
        name,
        email,
        password
      });
      
      navigate('/user/login', { 
        state: { 
          message: 'Registration successful! Please login with your credentials.' 
        }
      });
    } catch (error) {
      if (error.errors) {
        setError(error.errors[0].message);
      } else if (error.response) {
        setError(error.response.data.message || 'Registration failed');
      } else if (error.request) {
        setError('Unable to connect to server. Please try again later.');
      } else {
        setError('Something went wrong. Please try again.');
      }
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
              <UserPlus className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-center text-white">
            Create Student Account
          </h1>
          <p className="mt-1 text-center text-indigo-100">
            Join our learning platform
          </p>
        </div>

        {/* Signup Form */}
        <div className="p-8">
          {error && (
            <div className={`p-3 mb-6 text-sm rounded-lg ${
              darkMode ? 'text-red-300 bg-red-900/30' : 'text-red-700 bg-red-50'
            }`}>
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`px-4 py-3 mt-1 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  darkMode 
                    ? 'text-white bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
            </div>

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
                className={`px-4 py-3 mt-1 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  darkMode 
                    ? 'text-white bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-300'
                }`}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`px-4 py-3 mt-1 w-full rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  darkMode 
                    ? 'text-white bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-300'
                }`}
                placeholder="Create a password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating Account...' : 'Create Student Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Registering as a parent?{' '}
              <Link
                to="/parent/signup"
                className={`font-medium text-indigo-600 hover:text-indigo-500 ${
                  darkMode ? 'hover:text-indigo-400' : ''}`}
              >
                Sign up as parent
              </Link>
            </p>
            <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Already have an account?{' '}
              <Link
                to="/user/login"
                className={`font-medium text-indigo-600 hover:text-indigo-500 ${
                  darkMode ? 'hover:text-indigo-400' : ''}`}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSignupPage;