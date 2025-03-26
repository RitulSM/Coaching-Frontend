import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Users, Calendar, BookOpen, ArrowLeft, Mail, User, Bell, ClipboardCheck, Award, DollarSign } from 'lucide-react';
import axios from 'axios';
import StudentNavbar from '../../components/StudentNavbar';
import StudentAttendance from '../../components/StudentAttendance';
import TimetableViewer from '../../components/TimetableViewer';
import TestResultsViewer from '../../components/TestResultsViewer';
import TestResultsDebug from '../../components/TestResultsDebug';
import StudentFeesView from '../../components/StudentFeesView';
import { useDarkMode } from '../../utils/DarkModeContext';

function StudentBatchDetail() {
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { batchId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [userData, setUserData] = useState(null);
    const { darkMode } = useDarkMode();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/user/login');
            return;
        }
        
        try {
            const parsedUserData = JSON.parse(userStr);
            console.log('Student user data:', parsedUserData);
            setUserData(parsedUserData);
        } catch (error) {
            console.error('Error parsing user data:', error);
            navigate('/user/login');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchBatchDetails = async () => {
            try {
                if (!userData) return;

                console.log('Fetching batch details:', {
                    batchId,
                    userData
                });

                const response = await axios.get(
                    `http://localhost:3000/user/student/batches/${batchId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${userData.token}`
                        },
                        params: {
                            userId: userData.id
                        }
                    }
                );

                console.log('Batch details response:', response.data);

                if (response.data.success) {
                    setBatch(response.data.batch);
                } else {
                    throw new Error(response.data.message || 'Failed to fetch batch details');
                }
            } catch (error) {
                console.error('Error fetching batch details:', error.response?.data || error);
                setError(error.response?.data?.message || 'Failed to fetch batch details');
            } finally {
                setLoading(false);
            }
        };

        if (batchId && userData) {
            fetchBatchDetails();
        }
    }, [batchId, userData, navigate]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        {/* Teacher Information */}
                        <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <h2 className={`mb-4 text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Teacher Information</h2>
                            {batch.teacher ? (
                                <div className="flex items-center space-x-4">
                                    <div className="flex justify-center items-center w-12 h-12 bg-indigo-100 rounded-full">
                                        <User className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className={`font-medium text-md ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{batch.teacher.name}</h3>
                                        <div className={`flex items-center mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            <Mail className="mr-1 w-4 h-4" />
                                            {batch.teacher.email}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No teacher assigned</p>
                            )}
                        </div>

                        {/* Batch Statistics */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <div className="flex items-center">
                                    <Users className="w-10 h-10 text-indigo-600" />
                                    <div className="ml-4">
                                        <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Total Students</h3>
                                        <p className="text-3xl font-bold text-indigo-600">{batch.studentsCount}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <div className="flex items-center">
                                    <Bell className="w-10 h-10 text-green-600" />
                                    <div className="ml-4">
                                        <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Announcements</h3>
                                        <p className="text-3xl font-bold text-green-600">{batch.announcements?.length || 0}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <div className="flex items-center">
                                    <Calendar className="w-10 h-10 text-purple-600" />
                                    <div className="ml-4">
                                        <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Joined On</h3>
                                        <p className="text-lg text-purple-600">
                                            {new Date(batch.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'attendance':
                return (
                    <div className="space-y-6">
                        <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <StudentAttendance batchId={batchId} />
                        </div>
                    </div>
                );

            case 'announcements':
                return (
                    <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <h2 className={`mb-4 text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Announcements</h2>
                        <div className="space-y-4">
                            {batch.announcements && batch.announcements.length > 0 ? (
                                batch.announcements.map((announcement, index) => (
                                    <div key={index} className={`py-2 pl-4 border-l-4 border-indigo-500 ${darkMode ? 'bg-gray-700' : ''}`}>
                                        <h3 className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{announcement.title}</h3>
                                        <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{announcement.content}</p>
                                        <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Posted by {announcement.teacher_id?.name} on{' '}
                                            {new Date(announcement.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No announcements yet</p>
                            )}
                        </div>
                    </div>
                );

            case 'timetable':
                return (
                    <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <TimetableViewer batchId={batchId} />
                    </div>
                );

            case 'tests':
                return (
                    <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <TestResultsViewer batchId={batchId} studentId={userData?._id} />
                    </div>
                );

            case 'fees':
                return (
                    <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <StudentFeesView batchId={batchId} studentId={userData?._id} />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className={darkMode ? 'min-h-screen bg-gray-900' : ''}>
            <StudentNavbar />
            <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="mx-auto max-w-7xl">
                    {loading ? (
                        <div className={`flex justify-center items-center h-64 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <p>Loading batch details...</p>
                        </div>
                    ) : error ? (
                        <div className={`p-4 text-center ${darkMode ? 'text-red-300 bg-red-900/30' : 'text-red-700 bg-red-100'} rounded-lg`}>
                            {error}
                        </div>
                    ) : (
                        <>
                            {/* Batch Header */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <Link 
                                        to="/student/batches" 
                                        className={`p-2 mr-3 rounded-full ${
                                            darkMode 
                                                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800' 
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </Link>
                                    <div>
                                        <h1 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{batch.name}</h1>
                                        <div className="flex flex-wrap mt-1">
                                            <span className={`mr-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Class: <span className="font-medium">{batch.class}</span>
                                            </span>
                                            <span className={`mr-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Subject: <span className="font-medium">{batch.subject || 'All Subjects'}</span>
                                            </span>
                                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Code: <span className="font-medium">{batch.batch_code}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tab Navigation */}
                            <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
                                <nav className="flex overflow-x-auto">
                                    {['overview', 'attendance', 'announcements', 'timetable', 'tests', 'fees'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`
                                                px-4 py-3 text-sm font-medium whitespace-nowrap
                                                ${activeTab === tab 
                                                    ? darkMode 
                                                        ? 'border-b-2 border-indigo-500 text-indigo-400' 
                                                        : 'border-b-2 border-indigo-600 text-indigo-600'
                                                    : darkMode 
                                                        ? 'text-gray-400 hover:text-gray-300' 
                                                        : 'text-gray-500 hover:text-gray-900'
                                                }
                                            `}
                                        >
                                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            {renderTabContent()}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudentBatchDetail;
