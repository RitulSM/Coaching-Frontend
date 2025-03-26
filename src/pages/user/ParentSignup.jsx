import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import axios from 'axios';
import { z } from 'zod';
import { useDarkMode } from '../../utils/DarkModeContext';

const parentRegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  studentEmail: z.string().email("Invalid student email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

function ParentSignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      parentRegisterSchema.parse({ name, email, studentEmail, password });
      
      const response = await axios.post('http://localhost:3000/user/register/parent', {
        name,
        email,
        studentEmail,
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
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} p-4`}>
      <div className={`max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl overflow-hidden`}>
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-md">
              <UserPlus className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white text-center">
            Create Parent Account
          </h1>
          <p className="text-indigo-100 text-center mt-1">
            Join our learning platform as a parent
          </p>
        </div>

        {/* Signup Form */}
        <div className="p-8">
          {error && (
            <div className={`mb-6 p-3 rounded-lg text-sm ${
              darkMode ? 'text-red-300 bg-red-900/30' : 'bg-red-50 text-red-700'
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
                className={`mt-1 w-full px-4 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-indigo-500' 
                    : 'bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500'
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
                className={`mt-1 w-full px-4 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-indigo-500' 
                    : 'bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                }`}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="studentEmail" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Student's Email Address
              </label>
              <input
                id="studentEmail"
                type="email"
                required
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                className={`mt-1 w-full px-4 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-indigo-500' 
                    : 'bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                }`}
                placeholder="Enter your child's email"
              />
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Your child must register first before you can create a parent account
              </p>
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
                className={`mt-1 w-full px-4 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-indigo-500' 
                    : 'bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                }`}
                placeholder="Create a password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating Account...' : 'Create Parent Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Registering as a student?{' '}
              <Link
                to="/user/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up as student
              </Link>
            </p>
            <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Already have an account?{' '}
              <Link
                to="/user/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
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

export default ParentSignupPage; 