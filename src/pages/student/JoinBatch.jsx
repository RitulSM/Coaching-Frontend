import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle } from 'lucide-react';
import axios from 'axios';
import StudentNavbar from '../../components/StudentNavbar';
import { useDarkMode } from '../../utils/DarkModeContext';

function JoinBatch() {
    const [batchCode, setBatchCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { darkMode } = useDarkMode();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/student/login');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const userData = localStorage.getItem('user');
            if (!userData) {
                navigate('/student/login');
                return;
            }

            // Parse the stored data and send token directly
            const { token } = JSON.parse(userData);
            
            console.log('Using token:', token); // Debug log

            const response = await axios({
                method: 'POST',
                url: 'http://localhost:3000/user/join-batch',
                data: { batch_code: batchCode.trim() },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Join response:', response.data); // Debug log

            if (response.data.success) {
                setSuccess('Successfully joined the batch!');
                setTimeout(() => navigate('/student/batches'), 2000);
            }
        } catch (error) {
            console.error('Join batch error:', error.response || error);
            if (error.response?.status === 401) {
                setError('Session expired. Please login again.');
                setTimeout(() => navigate('/student/login'), 2000);
            } else {
                setError(error.response?.data?.message || 'Failed to join batch');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={darkMode ? 'bg-gray-900' : ''}>
            <StudentNavbar />
            <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center p-4`}>
                <div className={`max-w-md w-full rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-8">
                        <div className="flex justify-center mb-4">
                            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-md">
                                <UserPlus className="h-8 w-8 text-indigo-600" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-white text-center">
                            Join a Batch
                        </h1>
                        <p className="mt-2 text-indigo-100 text-center">
                            Enter the batch code provided by your teacher
                        </p>
                    </div>

                    {/* Form Section */}
                    <div className="p-6">
                        {error && (
                            <div className={`mb-4 flex items-center gap-2 p-4 rounded-lg ${
                                darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'
                            }`}>
                                <AlertCircle className="h-5 w-5" />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className={`mb-4 p-4 rounded-lg ${
                                darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700'
                            }`}>
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="batchCode" className={`block text-sm font-medium mb-1 ${
                                    darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    Batch Code
                                </label>
                                <input
                                    id="batchCode"
                                    type="text"
                                    value={batchCode}
                                    onChange={(e) => setBatchCode(e.target.value.toUpperCase())}
                                    placeholder="Enter batch code (e.g., BATCH001)"
                                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                        darkMode 
                                            ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500' 
                                            : 'border-gray-300'
                                    }`}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                        loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {loading ? 'Joining...' : 'Join Batch'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate('/student/batches')}
                                    className={`w-full py-3 px-4 border rounded-lg ${
                                        darkMode 
                                            ? 'text-gray-300 border-gray-600 hover:bg-gray-700' 
                                            : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JoinBatch;
