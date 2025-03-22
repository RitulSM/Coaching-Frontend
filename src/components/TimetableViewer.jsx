import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Calendar, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

function TimetableViewer({ batchId, userType = 'student' }) {
    const [timetable, setTimetable] = useState({
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get('studentId');
    const [selectedDay, setSelectedDay] = useState(() => {
        const today = new Date().getDay();
        // Convert JS day (0=Sunday, 1=Monday) to our format
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[today] === 'sunday' ? 'monday' : days[today];
    });

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    useEffect(() => {
        fetchTimetable();
    }, [batchId, userType, studentId]);

    const fetchTimetable = async () => {
        try {
            setLoading(true);
            
            let userData;
            let endpoint;
            
            if (userType === 'parent') {
                userData = localStorage.getItem('parentData');
                if (!userData) {
                    setError('You must be logged in to view this page');
                    setLoading(false);
                    return;
                }
                
                if (!studentId) {
                    setError('Student ID is required');
                    setLoading(false);
                    return;
                }
                
                endpoint = `http://localhost:3000/user/parent/batches/${batchId}/timetable?studentId=${studentId}`;
            } else {
                userData = localStorage.getItem('user');
                if (!userData) {
                    setError('You must be logged in to view this page');
                    setLoading(false);
                    return;
                }
                
                endpoint = `http://localhost:3000/user/batches/${batchId}/timetable`;
            }

            const { token } = JSON.parse(userData);
            const response = await axios.get(
                endpoint,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setTimetable(response.data.timetable);
            } else {
                setError('Failed to fetch timetable');
            }
        } catch (error) {
            console.error('Error fetching timetable:', error);
            setError(error.response?.data?.message || 'Failed to fetch timetable');
        } finally {
            setLoading(false);
        }
    };

    // Format time to 12-hour format
    const formatTime = (timeString) => {
        if (!timeString) return '';
        
        try {
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const formattedHour = hour % 12 || 12;
            return `${formattedHour}:${minutes} ${ampm}`;
        } catch (error) {
            return timeString;
        }
    };

    // Get all periods for the selected day
    const getPeriodsForDay = () => {
        const periods = timetable[selectedDay] || [];
        return periods.sort((a, b) => a.hour - b.hour);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    // Check if there are any classes scheduled for any day
    const hasAnyClasses = Object.values(timetable).some(day => day && day.length > 0);

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-red-600" />
                Class Timetable
            </h2>
            
            {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}
            
            {!hasAnyClasses ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No classes have been scheduled yet</p>
                </div>
            ) : (
                <>
                    <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                        {days.map(day => (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                className={`px-4 py-2 rounded-md text-sm font-medium capitalize whitespace-nowrap ${
                                    selectedDay === day
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-4 capitalize">{selectedDay} Schedule</h3>
                        
                        {/* Table-like Grid Layout */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Period</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {getPeriodsForDay().map((entry) => (
                                        <tr key={entry.hour} className="bg-white">
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {entry.hour}th Period
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                                {entry.subject}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                                {entry.teacher || "-"}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                                <span className="flex items-center">
                                                    <Clock className="h-3 w-3 mr-1 text-blue-600" />
                                                    {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default TimetableViewer; 