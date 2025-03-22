import React, { useState, useEffect } from 'react';
import { Calendar, User, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

function StudentAttendance({ batchId }) {
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchAttendance();
    }, [batchId, dateRange]);

    const fetchAttendance = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (!userData) throw new Error('Not authenticated');

            const response = await axios.get(
                `http://localhost:3000/user/student/batches/${batchId}/attendance`,
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

    if (loading) return <div>Loading attendance records...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!attendance) return <div>No attendance records found</div>;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Attendance Record</h2>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-indigo-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-indigo-600">Total Classes</h3>
                    <p className="text-2xl font-semibold text-indigo-900">
                        {attendance.statistics.totalClasses}
                    </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-green-600">Present</h3>
                    <p className="text-2xl font-semibold text-green-900">
                        {attendance.statistics.present}
                    </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-red-600">Absent</h3>
                    <p className="text-2xl font-semibold text-red-900">
                        {attendance.statistics.absent}
                    </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-600">Attendance %</h3>
                    <p className="text-2xl font-semibold text-blue-900">
                        {attendance.statistics.attendancePercentage}%
                    </p>
                </div>
            </div>

            {/* Date Range Filter */}
            <div className="flex gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">From</label>
                    <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => handleDateChange('startDate', e.target.value)}
                        className="mt-1 block rounded-md border-gray-300 shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">To</label>
                    <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => handleDateChange('endDate', e.target.value)}
                        className="mt-1 block rounded-md border-gray-300 shadow-sm"
                    />
                </div>
            </div>

            {/* Records Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marked By</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {attendance.records.map((record, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(record.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {record.status === 'present' ? 
                                            <CheckCircle className="w-4 h-4 mr-1" /> : 
                                            <XCircle className="w-4 h-4 mr-1" />}
                                        {record.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {record.remarks || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <User className="w-4 h-4 mr-1" />
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

export default StudentAttendance;
