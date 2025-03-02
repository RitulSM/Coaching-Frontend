import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, BookOpen } from 'lucide-react';
import axios from 'axios';
import { z } from 'zod';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      loginSchema.parse({ email, password });

      const response = await axios.post('http://localhost:3000/admin/login', {
        email,
        password
      });

      console.log('Login response:', response.data); 
      
      localStorage.setItem('teacherToken', response.data.token);
      
      
      if (response.data.admin) {
        localStorage.setItem('teacherUser', JSON.stringify(response.data.admin));
      } else if (response.data.teacher) {
        localStorage.setItem('teacherUser', JSON.stringify(response.data.teacher));
      } else {
        
        localStorage.setItem('teacherUser', JSON.stringify({ 
          name: email.split('@')[0], 
          email: email 
        }));
      }

      navigate('/teacher');
    } catch (error) {
      console.error('Login error:', error);

      if (error.errors) {
        setError(error.errors[0].message);
      } else if (error.response?.status === 404) {
        setError('Teacher account not found. Please check your email.');
      } else if (error.response?.status === 401) {
        setError('Invalid password. Please try again.');
      } else {
        setError(
          error.response?.data?.message || 
          'Login failed. Please try again later.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link 
          to="/" 
          className="flex items-center text-gray-500 hover:text-red-600 mb-8 mx-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
        
        <div className="flex flex-col items-center">
          <div className="bg-red-50 p-3 rounded-full">
            <BookOpen className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">Teacher Login</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Need an account?{' '}
            <Link to="/teacher/signup" className="font-medium text-red-600 hover:text-red-500">
              Register here
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10 border border-gray-200">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="teacher@school.edu"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-end mt-2">
                <Link to="/teacher/forgot-password" className="text-sm font-medium text-red-600 hover:text-red-500">
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