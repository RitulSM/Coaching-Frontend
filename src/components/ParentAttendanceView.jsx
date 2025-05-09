import React, { useState, useEffect } from 'react';
import { Calendar, User, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { useDarkMode } from '../utils/DarkModeContext';

function ParentAttendanceView({ batchId, studentId }) {
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
    }, [batchId, studentId, dateRange]);

    const fetchAttendance = async () => {
        try {
            const parentData = JSON.parse(localStorage.getItem('parentData'));
            if (!parentData) throw new Error('Not authenticated');

            const response = await axios.get(
                `https://coaching-backend-gamma.vercel.app/user/parent/batches/${batchId}/student-attendance/${studentId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${parentData.token}`,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        startDate: dateRange.startDate || '',
                        endDate: dateRange.endDate || ''
                    }
                }
            );

            if (response.data.success) {
                setAttendance(response.data.attendance);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch attendance');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className={`${darkMode ? 'text-gray-300' : ''}`}>Loading attendance records...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!attendance) return <div className={`${darkMode ? 'text-gray-300' : ''}`}>No attendance records found</div>;

    return (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
            <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-gray-200' : ''}`}>Attendance Record</h2>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
                <div className={`${darkMode ? 'bg-indigo-900' : 'bg-indigo-50'} p-4 rounded-lg`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Classes</p>
                    <p className="text-2xl font-bold text-indigo-600">
                        {attendance.statistics.totalClasses}
                    </p>
                </div>
                <div className={`${darkMode ? 'bg-green-900' : 'bg-green-50'} p-4 rounded-lg`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Present</p>
                    <p className="text-2xl font-bold text-green-600">
                        {attendance.statistics.present}
                    </p>
                </div>
                <div className={`${darkMode ? 'bg-red-900' : 'bg-red-50'} p-4 rounded-lg`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Absent</p>
                    <p className="text-2xl font-bold text-red-600">
                        {attendance.statistics.absent}
                    </p>
                </div>
                <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-50'} p-4 rounded-lg`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Attendance Rate</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {attendance.statistics.attendancePercentage}%
                    </p>
                </div>
            </div>

            {/* Date Filter */}
            <div className="flex gap-4 mb-6">
                <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>From</label>
                    <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                        className={`mt-1 block rounded-md ${darkMode ? 'text-white bg-gray-700 border-gray-600' : 'border-gray-300'} shadow-sm`}
                    />
                </div>
                <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>To</label>
                    <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                        className={`mt-1 block rounded-md ${darkMode ? 'text-white bg-gray-700 border-gray-600' : 'border-gray-300'} shadow-sm`}
                    />
                </div>
            </div>

            {/* Attendance Records */}
            <div className="overflow-x-auto">
                <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <tr>
                            <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Date</th>
                            <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Status</th>
                            <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Remarks</th>
                            <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Marked By</th>
                        </tr>
                    </thead>
                    <tbody className={`${darkMode ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
                        {attendance.records.map((record, index) => (
                            <tr key={index} className={darkMode ? 'bg-gray-800' : 'bg-white'}>
                                <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : ''}`}>
                                    {new Date(record.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {record.status === 'present' ? 
                                            <CheckCircle className="mr-1 w-4 h-4" /> : 
                                            <XCircle className="mr-1 w-4 h-4" />}
                                        {record.status}
                                    </span>
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                    {record.remarks || '-'}
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                    <div className="flex items-center">
                                        <User className="mr-1 w-4 h-4" />
                                        {record.marked_by}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ParentAttendanceView;
