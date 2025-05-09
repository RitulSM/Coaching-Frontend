import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Calendar, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useDarkMode } from '../utils/DarkModeContext';

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
    const { darkMode } = useDarkMode();

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
                
                endpoint = `https://coaching-backend-gamma.vercel.app/user/parent/batches/${batchId}/timetable?studentId=${studentId}`;
            } else {
                userData = localStorage.getItem('user');
                if (!userData) {
                    setError('You must be logged in to view this page');
                    setLoading(false);
                    return;
                }
                
                endpoint = `https://coaching-backend-gamma.vercel.app/user/batches/${batchId}/timetable`;
            }

            const { token } = JSON.parse(userData);
            
            console.log(`Fetching timetable from: ${endpoint}`);
            
            const response = await axios.get(
                endpoint,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log('Timetable API response:', response.data);

            if (response.data.success) {
                setTimetable(response.data.timetable);
                
                // Debug log to check the structure of a day's entries
                const firstDay = days.find(day => response.data.timetable[day]?.length > 0);
                if (firstDay) {
                    console.log(`Sample period from ${firstDay}:`, response.data.timetable[firstDay][0]);
                }
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

    const formatTime = (timeString) => {
        try {
            if (!timeString) return 'N/A';
            
            console.log('Formatting time:', timeString);
            
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours, 10);
            
            if (isNaN(hour)) {
                console.warn('Invalid hour value:', hours);
                return timeString || 'N/A';
            }
            
            if (hour === 0) {
                return `12:${minutes} AM`;
            } else if (hour < 12) {
                return `${hour}:${minutes} AM`;
            } else if (hour === 12) {
                return `12:${minutes} PM`;
            } else {
                return `${hour - 12}:${minutes} PM`;
            }
        } catch (e) {
            console.error('Error formatting time:', e, 'Original timeString:', timeString);
            return timeString || 'N/A';
        }
    };

    const getPeriodsForDay = () => {
        return timetable[selectedDay] || [];
    };
    const getWeekRange = () => {
        const currentDate = new Date();
        const first = currentDate.getDate() - currentDate.getDay() + 1;
        const last = first + 5;
        const monday = new Date(currentDate.setDate(first));
        const saturday = new Date(currentDate.setDate(last));
        const format = (d) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        return `${format(monday)} - ${format(saturday)}`;
    };
    return (
        <div className={`p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-sm`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : ''}`}>Class Timetable</h2>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {getWeekRange()}
                </span>
            </div>

            {/* Day Selector */}
            <div className="overflow-x-auto mb-6">
                <div className="flex space-x-1">
                    {days.map(day => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`px-3 py-2 text-sm capitalize font-medium rounded-md whitespace-nowrap 
                                ${selectedDay === day
                                    ? darkMode
                                        ? 'bg-indigo-900/50 text-indigo-300'
                                        : 'bg-indigo-100 text-indigo-700'
                                    : darkMode
                                        ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }
                            `}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading & Error States */}
            {loading && (
                <div className="py-8 text-center">
                    <div className="inline-block w-8 h-8 rounded-full border-2 border-t-2 border-gray-500 animate-spin border-t-indigo-600"></div>
                    <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading timetable...</p>
                </div>
            )}

            {error && !loading && (
                <div className={`p-4 rounded-md ${darkMode ? 'text-red-300 bg-red-900/30' : 'text-red-700 bg-red-50'}`}>
                    <div className="flex">
                        <AlertCircle className="mr-2 w-5 h-5" />
                        {error}
                    </div>
                </div>
            )}

            {/* Timetable Content */}
            {!loading && !error && (
                <div>
                    {getPeriodsForDay().length > 0 ? (
                        <div className="space-y-4">
                            {getPeriodsForDay().map((period, index) => (
                                <div 
                                    key={index} 
                                    className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                                {period.subject || 'General Class'}
                                            </h3>
                                            
                                            {period.topic && (
                                                <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    Topic: {period.topic}
                                                </p>
                                            )}
                                            
                                            <div className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                <div className="flex items-center">
                                                    <Clock className="mr-1 w-4 h-4 text-indigo-500" />
                                                    {formatTime(period.startTime)} - {formatTime(period.endTime)}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className={`px-2 py-1 text-xs rounded ${
                                            period.isPast 
                                                ? darkMode 
                                                    ? 'bg-gray-700 text-gray-300' 
                                                    : 'bg-gray-100 text-gray-600'
                                                : period.isCurrent 
                                                    ? darkMode 
                                                        ? 'bg-green-900/30 text-green-300' 
                                                        : 'bg-green-100 text-green-700'
                                                    : darkMode 
                                                        ? 'bg-blue-900/30 text-blue-300' 
                                                        : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {period.isPast ? 'Completed' : period.isCurrent ? 'Current' : 'Upcoming'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <Calendar className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                            <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>No Classes Scheduled</h3>
                            <p className="mt-1 text-sm">There are no classes scheduled for {selectedDay}.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default TimetableViewer; 