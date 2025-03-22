import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Users } from 'lucide-react';

const UserRegisterComponent = () => {
  return (
    <div className="flex justify-center items-center p-4 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="overflow-hidden w-full max-w-md bg-white rounded-xl shadow-xl">
        {/* Header with gradient */}
        <div className="p-6 bg-gradient-to-r from-indigo-500 to-indigo-600">
          <div className="flex justify-center">
            <div className="flex justify-center items-center w-16 h-16 bg-white rounded-full shadow-md">
              <UserPlus className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-center text-white">
            Create Your Account
          </h1>
          <p className="mt-1 text-center text-indigo-100">
            Please select your account type
          </p>
        </div>

        {/* Registration Options */}
        <div className="p-8">
          <div className="space-y-4">
            <Link to="/user/signup" className="block">
              <button className="flex justify-center items-center px-4 py-3 w-full font-semibold text-white bg-indigo-600 rounded-lg transition-all duration-200 transform hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:-translate-y-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Sign up as Student
              </button>
            </Link>
            
            <Link to="/user/signup" className="block">
              <button className="flex justify-center items-center px-4 py-3 w-full font-semibold text-indigo-600 bg-white rounded-lg border-2 border-indigo-600 transition-all duration-200 transform hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:-translate-y-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Sign up as Parent
              </button>
            </Link>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
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
};

export default UserRegisterComponent; 