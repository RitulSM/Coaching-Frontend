import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Users, Calendar, BookOpen, ArrowLeft, Mail, User, Bell, ClipboardCheck, Edit, Trash2, AlertCircle, Award, DollarSign } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import TeacherNavbar from '../../components/TeacherNavbar';
import AnnouncementForm from '../../components/AnnouncementForm';
import AttendanceMarker from '../../components/AttendanceMarker';
import StudentAttendanceDetails from '../../components/StudentAttendanceDetails';
import TimetableManager from '../../components/TimetableManager';
import TestResultsManager from '../../components/TestResultsManager';
import FeesManager from '../../components/FeesManager';
import { useDarkMode } from '../../utils/DarkModeContext'; // Import the dark mode hook

function BatchDetails() {
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [announcements, setAnnouncements] = useState([]);
    const { batchId } = useParams();
    const navigate = useNavigate();
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [deleteItemType, setDeleteItemType] = useState(null);
    const { darkMode } = useDarkMode(); // Use the dark mode hook

    useEffect(() => {
        fetchBatchDetails();
    }, [batchId]);

    const fetchBatchDetails = async () => {
        try {
            const teacherData = localStorage.getItem('teacherUser');
            if (!teacherData) {
                navigate('/teacher/login');
                return;
            }

            const { token } = JSON.parse(teacherData);
            const response = await axios.get(`https://coaching-backend-gamma.vercel.app/admin/batches/${batchId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data?.success) {
                setBatch(response.data.batch);
            } else {
                setError('Failed to fetch batch details');
            }
        } catch (error) {
            console.error('Error fetching batch details:', error);
            setError(error.response?.data?.message || 'Failed to fetch batch details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const teacherData = localStorage.getItem('teacherUser');
                if (!teacherData) {
                    navigate('/teacher/login');
                    return;
                }

                const { token } = JSON.parse(teacherData);
                const response = await axios.get(
                    `https://coaching-backend-gamma.vercel.app/admin/batches/${batchId}/announcements`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                if (response.data.success) {
                    setAnnouncements(response.data.announcements);
                }
            } catch (error) {
                console.error('Error fetching announcements:', error);
            }
        };

        fetchAnnouncements();
    }, [batchId, navigate]);

    const handleAnnouncementCreated = (newAnnouncement) => {
        setAnnouncements([newAnnouncement, ...announcements]);
    };

    const handleAnnouncementUpdated = (updatedAnnouncement) => {
        setAnnouncements(announcements.map(announcement => 
            announcement._id === updatedAnnouncement._id ? updatedAnnouncement : announcement
        ));
        setSelectedAnnouncement(null);
    };

    const handleDelete = async () => {
        if (!deleteItemId) return;
        
        try {
            const teacherData = JSON.parse(localStorage.getItem('teacherUser'));
            
            if (deleteItemType === 'announcement') {
                const response = await axios.delete(
                    `https://coaching-backend-gamma.vercel.app/admin/batches/${batchId}/announcements/${deleteItemId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${teacherData.id}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data.success) {
                    setAnnouncements(announcements.filter(announcement => announcement._id !== deleteItemId));
                    toast.success('Announcement deleted successfully');
                }
            } else if (deleteItemType === 'student') {
                const response = await axios.delete(
                    `https://coaching-backend-gamma.vercel.app/admin/batches/${batchId}/students/${deleteItemId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${teacherData.id}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data.success) {
                    setBatch(response.data.batch);
                    toast.success('Student removed from batch successfully');
                }
            }
            
            setShowDeleteModal(false);
            setDeleteItemId(null);
            setDeleteItemType(null);
        } catch (error) {
            console.error(`Error deleting ${deleteItemType}:`, error);
            toast.error(error.response?.data?.message || `Error deleting ${deleteItemType}`);
        }
    };

    const handleDeleteBatch = async () => {
        try {
            const teacherData = JSON.parse(localStorage.getItem('teacherUser'));
            const response = await axios.delete(
                `https://coaching-backend-gamma.vercel.app/admin/batches/${batchId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${teacherData.id}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toast.success('Batch deleted successfully');
                navigate('/teacher/batches');
            }
        } catch (error) {
            console.error('Error deleting batch:', error);
            toast.error(error.response?.data?.message || 'Error deleting batch');
        }
    };

    if (loading) {
        return (
            <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="w-12 h-12 rounded-full border-b-2 border-red-600 animate-spin"></div>
            </div>
        );
    }

    if (error || !batch) {
        return (
            <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="text-center">
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Error</h2>
                    <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{error || 'Batch not found'}</p>
                    <Link
                        to="/teacher/batches"
                        className={`inline-flex items-center mt-4 text-red-600 hover:text-red-800 ${darkMode ? 'hover:text-red-400' : ''}`}
                    >
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back to Batches
                    </Link>
                </div>
            </div>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-8">
                        {/* Teacher Information */}
                        <div className={`p-8 rounded-xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Teacher Information</h2>
                                {batch.teacher_id && (
                                    <span className={`px-3 py-1 text-sm rounded-full ${darkMode ? 'text-green-300 bg-green-900/30' : 'text-green-700 bg-green-50'}`}>
                                        Active Instructor
                                    </span>
                                )}
                            </div>
                            {batch.teacher_id ? (
                                <div className="flex items-center space-x-6">
                                    <div className={`flex justify-center items-center w-16 h-16 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-red-50'}`}>
                                        <User className={`w-8 h-8 ${darkMode ? 'text-red-300' : 'text-red-600'}`} />
                                    </div>
                                    <div>
                                        <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{batch.teacher_id.name}</h3>
                                        <div className={`flex items-center mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            <Mail className="mr-2 w-4 h-4" />
                                            {batch.teacher_id.email}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={`py-6 text-center rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    <User className={`mx-auto mb-2 w-12 h-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>No teacher assigned yet</p>
                                </div>
                            )}
                        </div>

                        {/* Batch Statistics */}
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className={`p-6 rounded-xl shadow-sm transition-shadow duration-200 hover:shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-red-50'}`}>
                                        <Users className={`w-8 h-8 ${darkMode ? 'text-red-300' : 'text-red-600'}`} />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Students</p>
                                        <h3 className={`mt-1 text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                            {batch.students?.length || 0}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div className={`p-6 rounded-xl shadow-sm transition-shadow duration-200 hover:shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                                        <Bell className={`w-8 h-8 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Announcements</p>
                                        <h3 className={`mt-1 text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                            {batch.announcements?.length || 0}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div className={`p-6 rounded-xl shadow-sm transition-shadow duration-200 hover:shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                                        <Calendar className={`w-8 h-8 ${darkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Created On</p>
                                        <h3 className={`mt-1 text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                            {new Date(batch.createdAt).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'allStudents':
                return (
                    <div className="space-y-6">
                        <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>All Students</h2>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            placeholder="Search students..."
                                            className={`px-4 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                                                darkMode 
                                                    ? 'placeholder-gray-500 text-gray-100 bg-gray-700 border-gray-600' 
                                                    : 'placeholder-gray-400 border-gray-300'
                                            }`}
                                        />
                                    </div>
                                </div>

                                {/* All Students Table */}
                                {batch.students && batch.students.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                                <tr>
                                                    <th className={`px-6 py-3 text-xs font-medium text-left uppercase ${
                                                        darkMode ? 'text-gray-300' : 'text-gray-500'
                                                    }`}>Name</th>
                                                    <th className={`px-6 py-3 text-xs font-medium text-left uppercase ${
                                                        darkMode ? 'text-gray-300' : 'text-gray-500'
                                                    }`}>Email</th>
                                                    <th className={`px-6 py-3 text-xs font-medium text-left uppercase ${
                                                        darkMode ? 'text-gray-300' : 'text-gray-500'
                                                    }`}>Status</th>
                                                    <th className={`px-6 py-3 text-xs font-medium text-left uppercase ${
                                                        darkMode ? 'text-gray-300' : 'text-gray-500'
                                                    }`}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className={`divide-y ${
                                                darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'
                                            }`}>
                                                {batch.students.map((student) => (
                                                    <tr key={student._id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className={`flex justify-center items-center w-8 h-8 rounded-full ${
                                                                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                                                                }`}>
                                                                    <User className={`w-4 h-4 ${
                                                                        darkMode ? 'text-gray-300' : 'text-gray-500'
                                                                    }`} />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className={`text-sm font-medium ${
                                                                        darkMode ? 'text-gray-100' : 'text-gray-900'
                                                                    }`}>
                                                                        {student.name}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className={`text-sm ${
                                                                darkMode ? 'text-gray-300' : 'text-gray-500'
                                                            }`}>{student.email}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                                darkMode ? 'text-green-300 bg-green-900/30' : 'text-green-800 bg-green-100'
                                                            }`}>
                                                                Active
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => {
                                                                        setDeleteItemId(student._id);
                                                                        setDeleteItemType('student');
                                                                        setShowDeleteModal(true);
                                                                    }}
                                                                    className={`inline-flex items-center ${
                                                                        darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'
                                                                    }`}
                                                                >
                                                                    <Trash2 className="mr-1 w-4 h-4" />
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className={`py-8 text-center rounded-lg ${
                                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                                    }`}>
                                        <Users className={`mx-auto mb-2 w-12 h-12 ${
                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`} />
                                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>No students available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 'attendance':
                return (
                    <div className="space-y-6">
                        {selectedStudent ? (
                            <StudentAttendanceDetails 
                                student={selectedStudent} 
                                batchId={batchId}
                                onBack={() => setSelectedStudent(null)}
                            />
                        ) : (
                            <AttendanceMarker 
                                batchId={batchId}
                                students={batch.students || []}
                            />
                        )}
                    </div>
                );
            case 'announcements':
                return (
                    <div className="space-y-6">
                        <AnnouncementForm 
                            batchId={batchId}
                            onAnnouncementCreated={handleAnnouncementCreated}
                            announcementToEdit={selectedAnnouncement}
                            onAnnouncementUpdated={handleAnnouncementUpdated}
                            onCancelEdit={() => setSelectedAnnouncement(null)}
                        />
                        <div className={`p-6 rounded-lg shadow-sm ${
                            darkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                            <h2 className={`mb-4 text-lg font-semibold ${
                                darkMode ? 'text-gray-100' : 'text-gray-900'
                            }`}>Recent Announcements</h2>
                            <div className="space-y-4">
                                {announcements.length > 0 ? (
                                    announcements.map((announcement) => (
                                        <div 
                                            key={announcement._id} 
                                            className={`relative py-4 pr-3 pl-4 rounded-r-lg border-l-4 ${
                                                darkMode ? 'bg-gray-700 border-red-500' : 'bg-gray-50 border-red-500'
                                            }`}
                                        >
                                            <div className="flex absolute top-3 right-3 space-x-2">
                                                <button 
                                                    onClick={() => setSelectedAnnouncement(announcement)}
                                                    className={`p-1 transition-colors ${
                                                        darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'
                                                    }`}
                                                    title="Edit announcement"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setDeleteItemId(announcement._id);
                                                        setDeleteItemType('announcement');
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className={`p-1 transition-colors ${
                                                        darkMode ? 'text-gray-300 hover:text-red-400' : 'text-gray-500 hover:text-red-600'
                                                    }`}
                                                    title="Delete announcement"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <h3 className={`pr-16 text-lg font-medium ${
                                                darkMode ? 'text-gray-100' : 'text-gray-900'
                                            }`}>
                                                {announcement.title}
                                            </h3>
                                            <p className={`mt-2 ${
                                                darkMode ? 'text-gray-300' : 'text-gray-600'
                                            }`}>
                                                {announcement.content}
                                            </p>
                                            <div className={`flex items-center mt-2 text-sm ${
                                                darkMode ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                                <Calendar className="mr-1 w-4 h-4" />
                                                {new Date(announcement.createdAt).toLocaleDateString()}
                                                <span className="mx-2">•</span>
                                                <User className="mr-1 w-4 h-4" />
                                                {announcement.teacher_id.name}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={`py-8 text-center rounded-lg ${
                                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                                    }`}>
                                        <Bell className={`mx-auto mb-2 w-12 h-12 ${
                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`} />
                                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>No announcements yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 'timetable':
                return (
                    <div className="space-y-6">
                        <TimetableManager batchId={batchId} />
                    </div>
                );
            case 'tests':
                return (
                    <div className="space-y-6">
                        <TestResultsManager 
                            batchId={batchId} 
                            students={batch.students || []}
                        />
                    </div>
                );
            case 'fees':
                return (
                    <div className="space-y-6">
                        <FeesManager batchId={batchId} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'text-gray-100 bg-gray-900' : 'text-gray-900 bg-gray-50'}`}>
            <TeacherNavbar />
            <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    to="/teacher/batches"
                    className={`inline-flex items-center mb-6 text-red-600 hover:text-red-800 ${
                        darkMode ? 'hover:text-red-400' : ''}`}
                >
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back to Batches
                </Link>

                {/* Action Buttons */}
                <div className="flex justify-end mb-6 space-x-3">
                    <button
                        onClick={() => {
                            if (window.confirm("Are you sure you want to delete this batch? This action cannot be undone.")) {
                                handleDeleteBatch();
                            }
                        }}
                        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border shadow-sm focus:outline-none ${
                            darkMode 
                                ? 'text-red-400 bg-gray-800 border-gray-700 hover:bg-gray-700' 
                                : 'text-red-700 bg-white border-red-300 hover:bg-red-50'
                        }`}
                    >
                        <Trash2 className="mr-2 w-4 h-4" />
                        Delete Batch
                    </button>
                </div>

                {/* Batch Header */}
                <div className={`p-6 mb-6 rounded-lg shadow-sm ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className={`text-2xl font-bold ${
                                darkMode ? 'text-gray-100' : 'text-gray-900'
                            }`}>{batch.name}</h1>
                            <p className={`mt-1 text-sm ${
                                darkMode ? 'text-gray-300' : 'text-gray-500'
                            }`}>Batch Code: {batch.batch_code}</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                darkMode ? 'text-green-300 bg-green-900/30' : 'text-green-800 bg-green-100'
                            }`}>
                                Active
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className={`mb-6 border-b ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                    <div className="flex flex-wrap -mb-px">
                        {[
                            { id: 'overview', label: 'Overview', icon: <BookOpen className="mr-2 w-4 h-4" /> },
                            { id: 'announcements', label: 'Announcements', icon: <Bell className="mr-2 w-4 h-4" /> },
                            { id: 'attendance', label: 'Attendance', icon: <ClipboardCheck className="mr-2 w-4 h-4" /> },
                            { id: 'allStudents', label: 'All Students', icon: <Users className="mr-2 w-4 h-4" /> },
                            { id: 'timetable', label: 'Timetable', icon: <Calendar className="mr-2 w-4 h-4" /> },
                            { id: 'tests', label: 'Test Results', icon: <Award className="mr-2 w-4 h-4" /> },
                            { id: 'fees', label: 'Fees Management', icon: <DollarSign className="mr-2 w-4 h-4" /> }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center text-sm font-medium px-4 py-3 border-b-2 ${
                                    activeTab === tab.id
                                        ? `text-red-600 border-red-600 ${
                                            darkMode ? 'hover:text-red-400' : 'hover:text-red-800'
                                        }`
                                        : `${
                                            darkMode 
                                                ? 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-500' 
                                                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                                        }`
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                {renderTabContent()}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="flex fixed inset-0 z-50 justify-center items-center bg-gray-600 bg-opacity-50">
                    <div className={`p-6 mx-4 w-full max-w-md rounded-lg ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        <h3 className={`mb-4 text-lg font-medium ${
                            darkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>Confirm Deletion</h3>
                        <p className={`mb-4 text-sm ${
                            darkMode ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                            {deleteItemType === 'announcement' 
                                ? "Are you sure you want to delete this announcement? This action cannot be undone."
                                : deleteItemType === 'student'
                                ? "Are you sure you want to remove this student from the batch? They will no longer have access to this batch's content."
                                : "Are you sure you want to delete this item? This action cannot be undone."
                            }
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteItemId(null);
                                    setDeleteItemType(null);
                                }}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${
                                    darkMode 
                                        ? 'text-gray-100 bg-gray-700 hover:bg-gray-600' 
                                        : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className={`px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 ${
                                    darkMode ? 'hover:bg-red-800' : ''}`}
                            >
                                {deleteItemType === 'student' ? 'Remove' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BatchDetails;