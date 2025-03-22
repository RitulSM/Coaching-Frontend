import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Save, Edit, Trash2, AlertCircle } from 'lucide-react';

function AttendanceMarker({ batchId, students }) {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState(
        students.map(student => ({
            student_id: student._id,
            status: 'present',
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

    useEffect(() => {
        fetchAttendanceRecords();
    }, [batchId]);

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

    const handleSubmit = async () => {
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
                    status: 'present',
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
        setDate(new Date().toISOString().split('T')[0]);
        setAttendance(
            students.map(student => ({
                student_id: student._id,
                status: 'present',
                remarks: ''
            }))
        );
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Attendance' : 'Mark Attendance'}</h2>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
                        {success}
                    </div>
                )}
                
                <div className="mb-4">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                    </label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                        disabled={isEditing}
                    />
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Remarks
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map(student => {
                                const attendanceRecord = attendance.find(a => a.student_id === student._id);
                                return (
                                    <tr key={student._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                            <div className="text-sm text-gray-500">{student.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleAttendanceChange(student._id, 'present')}
                                                    className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium ${
                                                        attendanceRecord?.status === 'present'
                                                            ? 'bg-green-100 text-green-800 border-green-200'
                                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <Check className="w-4 h-4 mr-1" />
                                                    Present
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAttendanceChange(student._id, 'absent')}
                                                    className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium ${
                                                        attendanceRecord?.status === 'absent'
                                                            ? 'bg-red-100 text-red-800 border-red-200'
                                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <X className="w-4 h-4 mr-1" />
                                                    Absent
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="text"
                                                value={attendanceRecord?.remarks || ''}
                                                onChange={(e) => handleRemarkChange(student._id, e.target.value)}
                                                placeholder="Optional remarks"
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                <div className="mt-4 flex justify-end space-x-3">
                    {isEditing && (
                        <button
                            type="button"
                            onClick={cancelEdit}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Processing...' : (isEditing ? 'Update Attendance' : 'Mark Attendance')}
                    </button>
                </div>
            </div>
            
            {/* Previous Attendance Records */}
            {attendanceRecords.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Previous Attendance Records</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Present/Total
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Marked By
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {attendanceRecords.map(record => {
                                    const presentCount = record.records.filter(r => r.status === 'present').length;
                                    const totalCount = record.records.length;
                                    return (
                                        <tr key={record._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(record.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {presentCount}/{totalCount} ({Math.round((presentCount/totalCount) * 100)}%)
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {record.marked_by?.name || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEditAttendance(record)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Edit attendance"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDelete(record._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Delete attendance"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex items-center mb-4 text-red-600">
                            <AlertCircle className="w-6 h-6 mr-2" />
                            <h3 className="text-lg font-medium">Confirm Deletion</h3>
                        </div>
                        <p className="mb-6 text-gray-700">
                            Are you sure you want to delete this attendance record? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteRecordId(null);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAttendance}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-70"
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AttendanceMarker;
