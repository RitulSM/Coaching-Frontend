import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Save, Edit, Trash2, AlertCircle } from 'lucide-react';
import { useDarkMode } from '../utils/DarkModeContext';

function AttendanceMarker({ batchId, students }) {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState(
        students.map(student => ({
            student_id: student._id,
            status: '',
            remarks: ''
        }))
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [editingRecord, setEditingRecord] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteRecordId, setDeleteRecordId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isAttendanceSubmitted, setIsAttendanceSubmitted] = useState(false);
    const [existingAttendanceForDate, setExistingAttendanceForDate] = useState(null);
    const { darkMode } = useDarkMode();

    useEffect(() => {
        fetchAttendanceRecords();
    }, [batchId]);

    useEffect(() => {
        // Check if attendance exists for the selected date
        if (attendanceRecords.length > 0 && date) {
            const formattedDate = new Date(date).toISOString().split('T')[0];
            const existingRecord = attendanceRecords.find(record => 
                new Date(record.date).toISOString().split('T')[0] === formattedDate
            );
            
            if (existingRecord && !isEditing) {
                setExistingAttendanceForDate(existingRecord);
                // Map existing attendance data to the current attendance state
                const mappedAttendance = existingRecord.records.map(r => ({
                    student_id: r.student_id._id || r.student_id,
                    status: r.status,
                    remarks: r.remarks || ''
                }));
                setAttendance(mappedAttendance);
            } else if (!isEditing) {
                setExistingAttendanceForDate(null);
                // Reset attendance if no record exists for this date - now with empty status
                setAttendance(
                    students.map(student => ({
                        student_id: student._id,
                        status: '',
                        remarks: ''
                    }))
                );
            }
        }
    }, [date, attendanceRecords, isEditing]);

    const fetchAttendanceRecords = async () => {
        try {
            setLoading(true);
            const teacherData = JSON.parse(localStorage.getItem('teacherUser'));
            const response = await axios.get(
                `http://localhost:3000/admin/batches/${batchId}/attendance`,
                {
                    headers: {
                        'Authorization': `Bearer ${teacherData.id}`
                    }
                }
            );

            if (response.data.success) {
                setAttendanceRecords(response.data.attendance);
            }
        } catch (error) {
            console.error('Error fetching attendance records:', error);
            setError(error.response?.data?.message || 'Error fetching attendance records');
        } finally {
            setLoading(false);
        }
    };

    const handleAttendanceChange = (studentId, status) => {
        setAttendance(prev => prev.map(record => 
            record.student_id === studentId 
                ? { ...record, status } 
                : record
        ));
    };

    const handleRemarkChange = (studentId, remarks) => {
        setAttendance(prev => prev.map(record => 
            record.student_id === studentId 
                ? { ...record, remarks } 
                : record
        ));
    };

    const handleDateChange = (newDate) => {
        setDate(newDate);
        setIsAttendanceSubmitted(false);
    };

    const handleMarkAllPresent = () => {
        // Update attendance state to mark all students as present
        setAttendance(prev => prev.map(record => ({
            ...record,
            status: 'present'
        })));
        setSuccess('All students marked as present');
    };

    const handleSubmit = async () => {
        // Check if any student has unselected status
        const hasUnselectedStatus = attendance.some(record => !record.status);
        
        if (hasUnselectedStatus) {
            setError('Please select attendance status for all students');
            return;
        }
        
        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const teacherData = JSON.parse(localStorage.getItem('teacherUser'));
            
            if (isEditing && editingRecord) {
                // Update existing attendance record
                const response = await axios.put(
                    `http://localhost:3000/admin/batches/${batchId}/attendance/${editingRecord._id}`,
                    {
                        records: attendance
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${teacherData.id}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data.success) {
                    setSuccess('Attendance updated successfully');
                    setIsEditing(false);
                    setEditingRecord(null);
                    setIsAttendanceSubmitted(true);
                    fetchAttendanceRecords();
                }
            } else if (existingAttendanceForDate) {
                // Update attendance for today that already exists
                const response = await axios.put(
                    `http://localhost:3000/admin/batches/${batchId}/attendance/${existingAttendanceForDate._id}`,
                    {
                        records: attendance
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${teacherData.id}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data.success) {
                    setSuccess('Attendance updated successfully');
                    fetchAttendanceRecords();
                }
            } else {
                // Create new attendance record
                const response = await axios.post(
                    `http://localhost:3000/admin/batches/${batchId}/attendance`,
                    {
                        date,
                        records: attendance
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${teacherData.id}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data.success) {
                    setSuccess('Attendance marked successfully');
                    setIsAttendanceSubmitted(true);
                    fetchAttendanceRecords();
                }
            }
        } catch (error) {
            console.error('Error with attendance:', error);
            setError(error.response?.data?.message || `Error ${isEditing ? 'updating' : 'marking'} attendance`);
        } finally {
            setLoading(false);
        }
    };

    const handleEditAttendance = (record) => {
        setEditingRecord(record);
        setIsEditing(true);
        setDate(new Date(record.date).toISOString().split('T')[0]);
        
        // Map the existing records to the attendance state
        const mappedAttendance = record.records.map(r => ({
            student_id: r.student_id._id || r.student_id,
            status: r.status,
            remarks: r.remarks || ''
        }));
        
        // Add any missing students (in case new students were added to the batch)
        students.forEach(student => {
            if (!mappedAttendance.some(a => a.student_id === student._id)) {
                mappedAttendance.push({
                    student_id: student._id,
                    status: '',
                    remarks: ''
                });
            }
        });
        
        setAttendance(mappedAttendance);
    };

    const handleDeleteAttendance = async () => {
        if (!deleteRecordId) return;
        
        try {
            setDeleteLoading(true);
            const teacherData = JSON.parse(localStorage.getItem('teacherUser'));
            const response = await axios.delete(
                `http://localhost:3000/admin/batches/${batchId}/attendance/${deleteRecordId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${teacherData.id}`
                    }
                }
            );

            if (response.data.success) {
                setSuccess('Attendance record deleted successfully');
                setShowDeleteModal(false);
                setDeleteRecordId(null);
                fetchAttendanceRecords();
            }
        } catch (error) {
            console.error('Error deleting attendance record:', error);
            setError(error.response?.data?.message || 'Error deleting attendance record');
        } finally {
            setDeleteLoading(false);
        }
    };

    const confirmDelete = (id) => {
        setDeleteRecordId(id);
        setShowDeleteModal(true);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditingRecord(null);
        setIsAttendanceSubmitted(false);
        setDate(new Date().toISOString().split('T')[0]);
        setAttendance(
            students.map(student => ({
                student_id: student._id,
                status: '',
                remarks: ''
            }))
        );
    };

    // Get status color for attendance table
    const getStatusColor = (status) => {
        if (status === 'present') {
            return darkMode ? 'text-green-400' : 'text-green-600';
        } else if (status === 'absent') {
            return darkMode ? 'text-red-400' : 'text-red-600';
        }
        return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    };

    return (
        <div className="space-y-6">
            <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className={`mb-4 text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {isEditing ? 'Edit Attendance' : 'Mark Attendance'}
                </h2>
                
                {error && (
                    <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-md border border-red-200 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="p-3 mb-4 text-sm text-green-700 bg-green-50 rounded-md border border-green-200 flex items-center">
                        <Check className="w-4 h-4 mr-2" />
                        {success}
                    </div>
                )}
                
                <div className="mb-6">
                    <label htmlFor="date" className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Date
                    </label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className={`block w-full rounded-md ${
                            darkMode 
                                ? 'bg-gray-700 text-white border-gray-600 focus:border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500'
                        } sm:text-sm p-2.5`}
                        disabled={isEditing}
                    />
                    {existingAttendanceForDate && !isEditing && (
                        <p className="mt-2 text-sm text-blue-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Attendance for this date already exists. You can view or edit it.
                        </p>
                    )}
                </div>
                
                <div className="overflow-x-auto rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}">
                    <div className={`p-3 ${darkMode ? 'bg-gray-750' : 'bg-gray-50'} flex justify-between items-center border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Student Attendance</h3>
                        {!existingAttendanceForDate || isEditing ? (
                            <button
                                type="button"
                                onClick={handleMarkAllPresent}
                                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
                                    darkMode 
                                        ? 'bg-green-700 text-white hover:bg-green-600' 
                                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                                } transition-colors duration-150`}
                            >
                                <Check className="mr-1 w-4 h-4" />
                                Select All Present
                            </button>
                        ) : null}
                    </div>
                    <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                        <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                            <tr>
                                <th scope="col" className={`px-6 py-3 text-xs font-medium tracking-wider text-left ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase`}>
                                    Student
                                </th>
                                <th scope="col" className={`px-6 py-3 text-xs font-medium tracking-wider text-left ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase`}>
                                    Status
                                </th>
                                <th scope="col" className={`px-6 py-3 text-xs font-medium tracking-wider text-left ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase`}>
                                    Remarks
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`${darkMode ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
                            {students.map(student => {
                                const attendanceRecord = attendance.find(a => a.student_id === student._id);
                                return (
                                    <tr key={student._id} className={`${darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'} transition duration-150`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 ${darkMode ? 'text-gray-800' : 'text-gray-600'} flex items-center justify-center font-semibold text-lg`}>
                                                    {student.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{student.name}</div>
                                                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{student.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                {existingAttendanceForDate && !isEditing ? (
                                                    <div className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium ${
                                                        attendanceRecord?.status === 'present' 
                                                        ? 'bg-green-100 text-green-800 border-green-200' 
                                                        : 'bg-red-100 text-red-800 border-red-200'
                                                    }`}>
                                                        {attendanceRecord?.status === 'present' ? (
                                                            <>
                                                                <Check className="mr-1 w-4 h-4" />
                                                                Present
                                                            </>
                                                        ) : (
                                                            <>
                                                                <X className="mr-1 w-4 h-4" />
                                                                Absent
                                                            </>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAttendanceChange(student._id, 'present')}
                                                            className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium transition-colors duration-150 ${
                                                                attendanceRecord?.status === 'present'
                                                                    ? 'bg-green-100 text-green-800 border-green-200 shadow-sm'
                                                                    : darkMode 
                                                                        ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:text-green-400' 
                                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:text-green-700 hover:border-green-300'
                                                            }`}
                                                        >
                                                            <Check className={`mr-1 w-4 h-4 ${attendanceRecord?.status === 'present' ? 'text-green-600' : ''}`} />
                                                            Present
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAttendanceChange(student._id, 'absent')}
                                                            className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium transition-colors duration-150 ${
                                                                attendanceRecord?.status === 'absent'
                                                                    ? 'bg-red-100 text-red-800 border-red-200 shadow-sm'
                                                                    : darkMode 
                                                                        ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:text-red-400' 
                                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                                                            }`}
                                                        >
                                                            <X className={`mr-1 w-4 h-4 ${attendanceRecord?.status === 'absent' ? 'text-red-600' : ''}`} />
                                                            Absent
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                            {!attendanceRecord?.status && !existingAttendanceForDate && (
                                                <p className="mt-1 text-xs text-amber-500">Please select attendance status</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                value={attendanceRecord?.remarks || ''}
                                                onChange={(e) => handleRemarkChange(student._id, e.target.value)}
                                                placeholder="Optional remarks"
                                                className={`block w-full rounded-md ${
                                                    darkMode 
                                                        ? 'bg-gray-700 text-white border-gray-600 focus:border-red-500 focus:ring-red-500' 
                                                        : 'border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500'
                                                } sm:text-sm p-2`}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                <div className="flex justify-end mt-6 space-x-3">
                    {isEditing && (
                        <button
                            type="button"
                            onClick={cancelEdit}
                            className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
                                darkMode 
                                    ? 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600' 
                                    : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                            } rounded-md border shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                        >
                            Cancel
                        </button>
                    )}
                    {existingAttendanceForDate && !isEditing ? (
                        <button
                            type="button"
                            onClick={() => handleEditAttendance(existingAttendanceForDate)}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <Edit className="mr-2 w-4 h-4" />
                            Edit Attendance
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md border border-transparent shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70"
                        >
                            <Save className="mr-2 w-4 h-4" />
                            {loading ? 'Processing...' : (isEditing ? 'Update Attendance' : (existingAttendanceForDate ? 'Update Attendance' : 'Mark Attendance'))}
                        </button>
                    )}
                </div>
            </div>
            
            {/* Previous Attendance Records */}
            {attendanceRecords.length > 0 && (
                <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h2 className={`mb-4 text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Previous Attendance Records</h2>
                    <div className="overflow-x-auto rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}">
                        <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                <tr>
                                    <th scope="col" className={`px-6 py-3 text-xs font-medium tracking-wider text-left ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase`}>
                                        Date
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-xs font-medium tracking-wider text-left ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase`}>
                                        Present/Total
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-xs font-medium tracking-wider text-left ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase`}>
                                        Marked By
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-xs font-medium tracking-wider text-left ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase`}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`${darkMode ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
                                {attendanceRecords.map(record => {
                                    const presentCount = record.records.filter(r => r.status === 'present').length;
                                    const totalCount = record.records.length;
                                    const attendancePercentage = Math.round((presentCount/totalCount) * 100);
                                    return (
                                        <tr key={record._id} className={`${darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'} transition duration-150`}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                    {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className={`w-2/3 bg-gray-200 rounded-full h-2.5 mr-2 ${darkMode ? 'bg-gray-600' : ''}`}>
                                                        <div 
                                                            className={`h-2.5 rounded-full ${
                                                                attendancePercentage > 80 ? 'bg-green-500' : 
                                                                attendancePercentage > 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`} 
                                                            style={{ width: `${attendancePercentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className={darkMode ? 'text-gray-200' : ''}>
                                                        {presentCount}/{totalCount} ({attendancePercentage}%)
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={darkMode ? 'text-gray-200' : ''}>
                                                    {record.marked_by?.name || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={() => handleEditAttendance(record)}
                                                        className={`inline-flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                                                        title="Edit attendance"
                                                    >
                                                        <Edit className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDelete(record._id)}
                                                        className={`inline-flex items-center ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
                                                        title="Delete attendance"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
                    <div className={`p-6 w-full max-w-md ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white'} rounded-lg shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                        <div className="flex items-center mb-4 text-red-600">
                            <AlertCircle className="mr-2 w-6 h-6" />
                            <h3 className="text-lg font-medium">Confirm Deletion</h3>
                        </div>
                        <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Are you sure you want to delete this attendance record? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteRecordId(null);
                                }}
                                className={`px-4 py-2 ${
                                    darkMode 
                                        ? 'text-gray-300 border-gray-600 bg-gray-700 hover:bg-gray-600' 
                                        : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                                } rounded-md border`}
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAttendance}
                                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-70 flex items-center"
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? 'Deleting...' : <><Trash2 className="w-4 h-4 mr-1" /> Delete</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AttendanceMarker;
