import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, BookOpen } from 'lucide-react';
import axios from 'axios';
import { z } from 'zod';
import DarkModeToggle from '../../components/DarkModeToggle';
import { useDarkMode } from '../../utils/DarkModeContext';

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

function TeacherLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
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
      const response = await axios.post('http://localhost:3000/admin/login', {
        email: email,
        password: password
      });

      if (response.data.message === "Admin login successful") {
        // Store teacher/admin data in correct format
        const teacherData = {
          id: response.data.admin._id,
          name: response.data.admin.name,
          email: response.data.admin.email,
          role: 'admin',
          token: response.data.token
        };

        localStorage.setItem('teacherUser', JSON.stringify(teacherData));
        navigate('/teacher/batches');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'} flex flex-col justify-center py-12 sm:px-6 lg:px-8`}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="absolute top-4 right-4">
          <DarkModeToggle />
        </div>
        <Link 
          to="/teacher" 
          className={`flex items-center ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'} mb-8 mx-4 transition-colors`}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
        
        <div className="flex flex-col items-center">
          <div className="bg-red-50 p-3 rounded-full">
            <BookOpen className="h-10 w-10 text-red-600" />
          </div>
          <h2 className={`mt-4 text-center text-3xl font-extrabold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Teacher Login</h2>
          <p className={`mt-2 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Need an account?{' '}
            <Link to="/teacher/signup" className={`font-medium ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-500'}`}>
              Register here
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`${darkMode ? 'bg-gray-800 shadow-gray-700 border-gray-700' : 'bg-white shadow-lg border-gray-200'} py-8 px-4 shadow rounded-lg sm:px-10 border`}>
          {error && (
            <div className={`mb-4 p-3 ${darkMode ? 'bg-red-900/30 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-700'} rounded-md text-sm border`}>
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-red-500 focus:border-red-500'
                  } rounded-md focus:outline-none focus:ring-2`}
                  placeholder="teacher@school.edu"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-10 py-2 border ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-red-500 focus:border-red-500'
                  } rounded-md focus:outline-none focus:ring-2`}
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-500'} focus:outline-none transition-colors duration-200`}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-end mt-2">
                <Link to="/teacher/forgot-password" className={`text-sm font-medium ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-500'}`}>
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign in as Teacher'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TeacherLoginPage;