import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../utils/DarkModeContext';
import { Calendar, CheckCircle, XCircle, User } from 'lucide-react';
import axios from 'axios';

function StudentAttendanceDetails({ batchId, student }) {
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
    }, [batchId, student._id, dateRange]);

    const fetchAttendance = async () => {
        try {
            const teacherData = JSON.parse(localStorage.getItem('teacherUser'));
            const response = await axios.get(
                `https://coaching-backend-gamma.vercel.app/admin/batches/${batchId}/student-attendance/${student._id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${teacherData.id}`
                    },
                    params: dateRange
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
        <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm`}>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <div className="flex justify-center items-center w-10 h-10 bg-indigo-100 rounded-full">
                        <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                        <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{student.name}</h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{student.email}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Attendance Rate</p>
                    <p className="text-2xl font-bold text-indigo-600">
                        {attendance.statistics.attendancePercentage}%
                    </p>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Classes</p>
                    <p className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : ''}`}>{attendance.statistics.totalClasses}</p>
                </div>
                <div className={`p-4 ${darkMode ? 'bg-green-900' : 'bg-green-50'} rounded-lg`}>
                    <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Present</p>
                    <p className={`text-xl font-semibold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>{attendance.statistics.present}</p>
                </div>
                <div className={`p-4 ${darkMode ? 'bg-red-900' : 'bg-red-50'} rounded-lg`}>
                    <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>Absent</p>
                    <p className={`text-xl font-semibold ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{attendance.statistics.absent}</p>
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
                        className={`block mt-1 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'} shadow-sm`}
                    />
                </div>
                <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>To</label>
                    <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                        className={`block mt-1 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'} shadow-sm`}
                    />
                </div>
            </div>

            {/* Records Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <th className={`px-4 py-3 text-xs font-medium text-left ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Date</th>
                            <th className={`px-4 py-3 text-xs font-medium text-left ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Status</th>
                            <th className={`px-4 py-3 text-xs font-medium text-left ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Remarks</th>
                        </tr>
                    </thead>
                    <tbody className={`${darkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}`}>
                        {attendance.records.map((record, index) => (
                            <tr key={index} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                <td className={`px-4 py-3 whitespace-nowrap ${darkMode ? 'text-gray-300' : ''}`}>
                                    {new Date(record.date).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {record.status === 'present' ?
                                            <CheckCircle className="mr-1 w-4 h-4" /> :
                                            <XCircle className="mr-1 w-4 h-4" />}
                                        {record.status}
                                    </span>
                                </td>
                                <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} whitespace-nowrap`}>
                                    {record.remarks || '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StudentAttendanceDetails;
