import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import axios from 'axios';

function ParentLoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:3000/user/login/parent', {
                email: formData.email,
                password: formData.password
            });

            if (response.data.success) {
                const parentData = {
                    token: response.data.token,
                    id: response.data.user.id,
                    name: response.data.user.name,
                    email: response.data.user.email,
                    role: 'parent',
                    linkedStudents: response.data.linkedStudents
                };
                localStorage.setItem('parentData', JSON.stringify(parentData));
                navigate('/parent/dashboard');
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6">
                    <div className="flex justify-center">
                        <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-md">
                            <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="mt-4 text-2xl font-bold text-white text-center">
                        Parent Login
                    </h1>
                    <p className="text-indigo-100 text-center mt-1">Monitor your child's progress</p>
                </div>

                {/* Form Section */}
                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Don't have an Account{' '}
                            <Link to="/user/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Signup here
                            </Link>
                        </p>
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 px-4 rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Are you a student?{' '}
                            <Link to="/student/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ParentLoginPage;