import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, BookOpen } from 'lucide-react';
import axios from 'axios';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

function TeacherSignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
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
      signupSchema.parse({ name, email, password });

      const response = await axios.post('http://localhost:3000/admin/register', {
        name,
        email,
        password
      });

      console.log('Registration response:', response.data); 
      
      localStorage.setItem('teacherToken', response.data.token);
      
      
      if (response.data.admin) {
        localStorage.setItem('teacherUser', JSON.stringify(response.data.admin));
      } else if (response.data.teacher) {
        localStorage.setItem('teacherUser', JSON.stringify(response.data.teacher));
      } else {
        
        localStorage.setItem('teacherUser', JSON.stringify({ 
          name: name,
          email: email 
        }));
      }

      navigate('/teacher');
    } catch (error) {
      console.error('Registration error:', error);

      if (error.errors) {
        setError(error.errors[0].message);
      } else {
        setError(
          error.response?.data?.message || 
          'Registration failed. Please try again later.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center py-12 min-h-screen bg-white sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link 
          to="/teacher" 
          className="flex items-center mx-4 mb-8 text-gray-500 transition-colors hover:text-red-600"
        >
          <ArrowLeft className="mr-2 w-5 h-5" />
          Back to Home
        </Link>
        
        <div className="flex flex-col items-center">
          <div className="p-3 bg-red-50 rounded-full">
            <BookOpen className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-center text-gray-900">Teacher Registration</h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/teacher/login" className="font-medium text-red-600 hover:text-red-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 py-8 bg-white rounded-lg border border-gray-200 shadow-lg sm:px-10">
          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block py-2 pr-3 pl-10 w-full placeholder-gray-400 text-gray-900 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="John Smith"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                School Email
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block py-2 pr-3 pl-10 w-full placeholder-gray-400 text-gray-900 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="teacher@school.edu"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block py-2 pr-10 pl-10 w-full placeholder-gray-400 text-gray-900 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Create a secure password"
                />
                <div className="flex absolute inset-y-0 right-0 items-center pr-3">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 transition-colors duration-200 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Password must be at least 6 characters and include a number and special character.
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex justify-center px-4 py-2 w-full text-sm font-medium text-white bg-red-600 rounded-md border border-transparent shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Teacher Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TeacherSignupPage;
