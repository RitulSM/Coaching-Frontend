import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Save, Plus, X, AlertCircle } from 'lucide-react';
import { useDarkMode } from '../utils/DarkModeContext';

function TimetableManager({ batchId }) {
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
    const [selectedDay, setSelectedDay] = useState('monday');
    const [success, setSuccess] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newEntry, setNewEntry] = useState({ 
        hour: '', 
        subject: '', 
        teacher: '',
        startTime: '',
        endTime: ''
    });
    const { darkMode } = useDarkMode();

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    useEffect(() => {
        fetchTimetable();
    }, [batchId]);

    const fetchTimetable = async () => {
        try {
            setLoading(true);
            const teacherData = localStorage.getItem('teacherUser');
            if (!teacherData) {
                setError('You must be logged in to view this page');
                setLoading(false);
                return;
            }

            const { token } = JSON.parse(teacherData);
            const response = await axios.get(
                `https://coaching-backend-gamma.vercel.app/admin/batches/${batchId}/timetable`,
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

    const handleAddEntry = async () => {
        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const teacherData = JSON.parse(localStorage.getItem('teacherUser'));
            const response = await axios.put(
                `https://coaching-backend-gamma.vercel.app/admin/batches/${batchId}/timetable/${selectedDay}/${newEntry.hour}`,
                {
                    subject: newEntry.subject,
                    teacher: newEntry.teacher,
                    startTime: newEntry.startTime,
                    endTime: newEntry.endTime
                },
                {
                    headers: {
                        'Authorization': `Bearer ${teacherData.id}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setTimetable(response.data.timetable);
                setSuccess('Timetable entry added successfully');
                setShowAddForm(false);
                setNewEntry({
                    hour: '',
                    subject: '',
                    teacher: '',
                    startTime: '',
                    endTime: ''
                });
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (error) {
            console.error('Error adding timetable entry:', error);
            setError(error.response?.data?.message || 'Error adding timetable entry');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveEntry = async (hour) => {
        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const teacherData = JSON.parse(localStorage.getItem('teacherUser'));
            const response = await axios.delete(
                `https://coaching-backend-gamma.vercel.app/admin/batches/${batchId}/timetable/${selectedDay}/${hour}`,
                {
                    headers: {
                        'Authorization': `Bearer ${teacherData.id}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setTimetable(response.data.timetable);
                setSuccess(`Timetable entry removed successfully`);
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (error) {
            console.error('Error removing timetable entry:', error);
            setError(error.response?.data?.message || 'Error removing timetable entry');
        } finally {
            setLoading(false);
        }
    };

    const handleClearDay = async () => {
        if (!window.confirm(`Are you sure you want to clear all entries for ${selectedDay}?`)) {
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const teacherData = JSON.parse(localStorage.getItem('teacherUser'));
            const response = await axios.delete(
                `https://coaching-backend-gamma.vercel.app/admin/batches/${batchId}/timetable/${selectedDay}`,
                {
                    headers: {
                        'Authorization': `Bearer ${teacherData.id}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setTimetable(response.data.timetable);
                setSuccess(`All entries for ${selectedDay} cleared successfully`);
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (error) {
            console.error('Error clearing timetable entries:', error);
            setError(error.response?.data?.message || 'Error clearing timetable entries');
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
    const getWeekRange = () => {
        const currentDate = new Date();
        const first = currentDate.getDate() - currentDate.getDay() + 1;
        const last = first + 5;
        const monday = new Date(currentDate.setDate(first));
        const saturday = new Date(currentDate.setDate(last));
        const format = (d) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        return `${format(monday)} - ${format(saturday)}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className={`p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-sm`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : ''}`}>Class Timetable</h2>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {getWeekRange()}
                </span>
            </div>
            
            {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}
            
            {success && (
                <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
                    {success}
                </div>
            )}
            
            <div className="mb-6">
                <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                    {days.map(day => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`px-4 py-2 rounded-md text-sm font-medium capitalize whitespace-nowrap ${
                                selectedDay === day
                                    ? 'bg-red-100 text-red-700'
                                    : darkMode 
                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>
                
                <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className={`text-lg font-medium capitalize ${darkMode ? 'text-gray-200' : ''}`}>{selectedDay} Schedule</h3>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                            >
                                <Plus size={16} className="mr-1" />
                                Add Period
                            </button>
                            <button
                                onClick={handleClearDay}
                                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium ${
                                    darkMode 
                                        ? 'text-gray-300 bg-gray-600 hover:bg-gray-500' 
                                        : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                                } rounded-md`}
                            >
                                <X size={16} className="mr-1" />
                                Clear Day
                            </button>
                        </div>
                    </div>
                    
                    {/* Table-like Grid Layout */}
                    <div className="overflow-x-auto">
                        <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} rounded-lg`}>
                            <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-100'}>
                                <tr>
                                    <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider w-24`}>Period</th>
                                    <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Subject</th>
                                    <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Teacher</th>
                                    <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider w-40`}>Time</th>
                                    <th className={`px-4 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider w-20`}>Action</th>
                                </tr>
                            </thead>
                            <tbody className={`${darkMode ? 'bg-gray-700 divide-y divide-gray-600' : 'bg-white divide-y divide-gray-200'}`}>
                                {getPeriodsForDay().map((entry) => (
                                    <tr key={entry.hour} className={darkMode ? 'bg-gray-700' : 'bg-white'}>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                            <span className={darkMode ? 'text-gray-200' : ''}>
                                                {entry.hour}th Period
                                            </span>
                                        </td>
                                        <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {entry.subject}
                                        </td>
                                        <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {entry.teacher || "-"}
                                        </td>
                                        <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <span className="flex items-center">
                                                <Clock className="h-3 w-3 mr-1 text-blue-600" />
                                                {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                onClick={() => handleRemoveEntry(entry.hour)}
                                                className={darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}
                                            >
                                                <X size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* Add/Edit Class Form */}
                {showAddForm && (
                    <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded-lg p-6 mb-4 shadow-sm`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : ''}`}>Add Class Period</h3>
                            <button 
                                onClick={() => setShowAddForm(false)}
                                className={darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Period Number</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={newEntry.hour}
                                    onChange={(e) => setNewEntry({ ...newEntry, hour: e.target.value })}
                                    placeholder="Enter period number"
                                    className={`w-full rounded-md ${
                                        darkMode 
                                            ? 'bg-gray-800 border-gray-600 text-white focus:border-red-500 focus:ring focus:ring-red-200' 
                                            : 'border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200'
                                    } py-3 text-base`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Teacher</label>
                                <input
                                    type="text"
                                    value={newEntry.teacher}
                                    onChange={(e) => setNewEntry({ ...newEntry, teacher: e.target.value })}
                                    placeholder="Enter teacher's name"
                                    className={`w-full rounded-md ${
                                        darkMode 
                                            ? 'bg-gray-800 border-gray-600 text-white focus:border-red-500 focus:ring focus:ring-red-200' 
                                            : 'border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200'
                                    } py-3 text-base`}
                                />
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Subject</label>
                            <input
                                type="text"
                                value={newEntry.subject}
                                onChange={(e) => setNewEntry({ ...newEntry, subject: e.target.value })}
                                placeholder="Enter subject name (e.g. Mathematics, Science, English)"
                                className={`w-full rounded-md ${
                                    darkMode 
                                        ? 'bg-gray-800 border-gray-600 text-white focus:border-red-500 focus:ring focus:ring-red-200' 
                                        : 'border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200'
                                } py-3 text-base`}
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Start Time</label>
                                <input
                                    type="time"
                                    value={newEntry.startTime}
                                    onChange={(e) => setNewEntry({ ...newEntry, startTime: e.target.value })}
                                    className={`w-full rounded-md ${
                                        darkMode 
                                            ? 'bg-gray-800 border-gray-600 text-white focus:border-red-500 focus:ring focus:ring-red-200' 
                                            : 'border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200'
                                    } py-3 text-base`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>End Time</label>
                                <input
                                    type="time"
                                    value={newEntry.endTime}
                                    onChange={(e) => setNewEntry({ ...newEntry, endTime: e.target.value })}
                                    className={`w-full rounded-md ${
                                        darkMode 
                                            ? 'bg-gray-800 border-gray-600 text-white focus:border-red-500 focus:ring focus:ring-red-200' 
                                            : 'border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200'
                                    } py-3 text-base`}
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end">
                            <button
                                onClick={handleAddEntry}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-base"
                            >
                                <Plus size={18} className="mr-2" />
                                Save Period
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TimetableManager; 