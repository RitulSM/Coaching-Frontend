import React, { useState, useEffect } from 'react';
import { Calendar, User, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { useDarkMode } from '../utils/DarkModeContext';

function StudentAttendance({ batchId }) {
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });
    const { darkMode } = useDarkMode();

    useEffect(() => {
        fetchAttendance();
    }, [batchId, dateRange]);

    const fetchAttendance = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (!userData) throw new Error('Not authenticated');

            const response = await axios.get(
                `https://coaching-backend-gamma.vercel.app/user/student/batches/${batchId}/attendance`,
                {
                    headers: {
                        'Authorization': `Bearer ${userData.token}`,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        userId: userData.id,
                        startDate: dateRange.startDate || '',
                        endDate: dateRange.endDate || ''
                    }
                }
            );

            console.log('Attendance response:', response.data);

            if (response.data.success) {
                setAttendance(response.data.attendance);
            }
        } catch (error) {
            console.error('Attendance fetch error:', error);
            setError(error.response?.data?.message || 'Failed to fetch attendance');
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (type, value) => {
        setDateRange(prev => ({
            ...prev,
            [type]: value
        }));
    };

    // Calculate attendance statistics
    const calculateStats = () => {
        if (!attendance?.records?.length) return { present: 0, absent: 0, total: 0, percentage: 0 };

        const present = attendance.records.filter(record => record.status === 'present').length;
        const absent = attendance.records.filter(record => record.status === 'absent').length;
        const total = attendance.records.length;
        const percentage = Math.round((present / total) * 100);

        return { present, absent, total, percentage };
    };

    const stats = calculateStats();

    return (
        <div className={darkMode ? 'text-gray-100' : 'text-gray-900'}>
            <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Your Attendance</h2>
            
            {/* Date Filter */}
            <div className="mb-6">
                <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Filter by Date</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>From</label>
                        <input
                            type="date"
                            value={dateRange.startDate}
                            onChange={(e) => handleDateChange('startDate', e.target.value)}
                            className={`block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm ${
                                darkMode 
                                    ? 'text-gray-100 bg-gray-800 border-gray-700 focus:ring-indigo-500 focus:border-indigo-500' 
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                        />
                    </div>
                    <div>
                        <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>To</label>
                        <input
                            type="date"
                            value={dateRange.endDate}
                            onChange={(e) => handleDateChange('endDate', e.target.value)}
                            className={`block w-full rounded-md shadow-sm px-3 py-2 sm:text-sm ${
                                darkMode 
                                    ? 'text-gray-100 bg-gray-800 border-gray-700 focus:ring-indigo-500 focus:border-indigo-500' 
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                        />
                    </div>
                </div>
            </div>
            
            {loading && (
                <div className="py-8 text-center">
                    <div className="inline-block w-8 h-8 rounded-full border-2 border-t-2 border-gray-500 animate-spin border-t-indigo-600"></div>
                    <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading attendance data...</p>
                </div>
            )}
            
            {error && !loading && (
                <div className={`p-4 rounded-md ${darkMode ? 'text-red-300 bg-red-900/30' : 'text-red-700 bg-red-50'}`}>
                    {error}
                </div>
            )}
            
            {!loading && !error && attendance && (
                <>
                    {/* Attendance Stats */}
                    <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-4">
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                            <div className="flex items-center">
                                <div className={`p-2 rounded-full ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'}`}>
                                    <Calendar className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div className="ml-3">
                                    <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Classes</p>
                                    <p className="text-xl font-semibold text-indigo-600">{stats.total}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                            <div className="flex items-center">
                                <div className={`p-2 rounded-full ${darkMode ? 'bg-green-900/50' : 'bg-green-100'}`}>
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="ml-3">
                                    <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Present</p>
                                    <p className="text-xl font-semibold text-green-600">{stats.present}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                            <div className="flex items-center">
                                <div className={`p-2 rounded-full ${darkMode ? 'bg-red-900/50' : 'bg-red-100'}`}>
                                    <XCircle className="w-5 h-5 text-red-600" />
                                </div>
                                <div className="ml-3">
                                    <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Absent</p>
                                    <p className="text-xl font-semibold text-red-600">{stats.absent}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                            <div className="flex items-center">
                                <div className={`p-2 rounded-full ${darkMode ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                                    <User className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="ml-3">
                                    <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Attendance</p>
                                    <p className="text-xl font-semibold text-purple-600">{stats.percentage}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Attendance Records */}
                    <div className="overflow-x-auto">
                        <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
                                <tr>
                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                        Date
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                        Status
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                        Remarks
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`${darkMode ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
                                {attendance.records.map((record, index) => (
                                    <tr key={index}>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                            {new Date(record.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {record.status === 'present' ? (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
                                                }`}>
                                                    <CheckCircle className="mr-1 w-4 h-4" />
                                                    Present
                                                </span>
                                            ) : (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    <XCircle className="mr-1 w-4 h-4" />
                                                    Absent
                                                </span>
                                            )}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                            {record.remarks || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {attendance.records.length === 0 && (
                        <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            No attendance records found for the selected date range.
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default StudentAttendance;
