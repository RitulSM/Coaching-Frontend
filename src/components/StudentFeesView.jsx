import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, AlertCircle, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';
import { useDarkMode } from '../utils/DarkModeContext';

function StudentFeesView({ batchId }) {
    const [loading, setLoading] = useState(true);
    const [feesPayment, setFeesPayment] = useState(null);
    const [error, setError] = useState('');
    const { darkMode } = useDarkMode();

    useEffect(() => {
        fetchFeesData();
    }, [batchId]);

    const fetchFeesData = async () => {
        try {
            setLoading(true);
            const userData = JSON.parse(localStorage.getItem('user'));

            if (!userData) {
                console.error('No user data found in localStorage');
                setError('Authentication required');
                setLoading(false);
                return;
            }

            console.log('Fetching fees data with:', {
                batchId,
                userId: userData.id,
                hasToken: !!userData.token
            });

            const response = await axios.get(
                `https://coaching-backend-gamma.vercel.app/user/student/batches/${batchId}/fees`,
                {
                    params: { userId: userData.id },
                    headers: {
                        'Authorization': `Bearer ${userData.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Fees data response:', response.data);

            if (response.data.success) {
                setFeesPayment(response.data.feesPayment);
            } else {
                throw new Error(response.data.message || 'Failed to fetch fees data');
            }
        } catch (error) {
            console.error('Error fetching fees data:', error);
            setError(error.response?.data?.message || 'Failed to load fees data');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        if (!status) return 'bg-gray-100 text-gray-800';
        
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        if (!status) return null;
        
        switch (status) {
            case 'paid':
                return <Check className="h-5 w-5 text-green-500" />;
            case 'pending':
                return <AlertCircle className="h-5 w-5 text-yellow-500" />;
            case 'overdue':
                return <X className="h-5 w-5 text-red-500" />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
                <div className="text-center text-red-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
            <div className={`${darkMode ? 'bg-indigo-900' : 'bg-indigo-50'} p-6`}>
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'} flex items-center`}>
                    <DollarSign className="h-5 w-5 mr-2 text-indigo-600" />
                    Fees Information
                </h2>
            </div>

            <div className="p-6">
                {feesPayment ? (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Payment Status</h3>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Last updated: {new Date(feesPayment.paymentDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className={`px-4 py-2 rounded-full ${getStatusColor(feesPayment.status)} flex items-center`}>
                                {getStatusIcon(feesPayment.status)}
                                <span className="ml-2 text-sm font-medium">
                                    {feesPayment.status.charAt(0).toUpperCase() + feesPayment.status.slice(1)}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Amount</h4>
                                <p className={`text-2xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>₹{feesPayment.amount}</p>
                            </div>
                            <div>
                                <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Payment Method</h4>
                                <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                    {feesPayment.paymentMethod.charAt(0).toUpperCase() + feesPayment.paymentMethod.slice(1)}
                                </p>
                            </div>
                        </div>

                        {feesPayment.remarks && (
                            <div>
                                <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Remarks</h4>
                                <p className={`${darkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-700 bg-gray-50'} p-3 rounded-md`}>
                                    {feesPayment.remarks}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-8 text-center">
                        <DollarSign className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                        <h3 className={`mt-2 text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>No Payment Information</h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                            Your fees payment information has not been recorded yet.
                            <br />Please contact your teacher or administrator.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentFeesView; 