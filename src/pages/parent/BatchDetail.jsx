import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Users, Calendar, BookOpen, ArrowLeft, Mail, User, ClipboardCheck, Bell, Award, AlertCircle, DollarSign } from 'lucide-react';
import axios from 'axios';
import ParentNavbar from '../../components/ParentNavbar';
import ParentAttendanceView from '../../components/ParentAttendanceView';
import TimetableViewer from '../../components/TimetableViewer';
import TestResultsViewer from '../../components/TestResultsViewer';
import TestResultsDebug from '../../components/TestResultsDebug';
import ParentFeesView from '../../components/ParentFeesView';
import { useDarkMode } from '../../utils/DarkModeContext';

function ParentBatchDetail() {
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { batchId } = useParams();
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get('studentId');
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const { darkMode } = useDarkMode();

    useEffect(() => {
        const fetchBatchDetails = async () => {
            try {
                const userStr = localStorage.getItem('parentData'); // Ensure this matches your localStorage key
                if (!userStr) {
                    console.error('No parent data found');
                    navigate('/parent/login');
                    return;
                }

                const userData = JSON.parse(userStr);
                console.log('Parent user data:', userData);
                console.log('Making request with:', {
                    batchId,
                    studentId,
                    token: userData.token,
                    parentId: userData.id
                });

                const response = await axios.get(
                    `https://coaching-backend-gamma.vercel.app/user/parent/batches/${batchId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${userData.token}`,
                            'Content-Type': 'application/json'
                        },
                        params: {
                            parentId: userData.id,
                            studentId: studentId
                        }
                    }
                );

                if (response.data.success) {
                    setBatch(response.data.batch);
                } else {
                    throw new Error(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching batch details:', error);
                setError(error.response?.data?.message || 'Failed to fetch batch details');
                if (error.response?.status === 401) {
                    navigate('/parent/login');
                }
            } finally {
                setLoading(false);
            }
        };

        if (batchId && studentId) {
            fetchBatchDetails();
        } else {
            setError('Missing batch or student information');
            setLoading(false);
        }
    }, [batchId, studentId, navigate]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        {/* Student Information */}
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
                            <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'} mb-4`}>Student Information</h2>
                            <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <User className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className={`text-md font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{batch?.student?.name}</h3>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{batch?.student?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Teacher Information */}
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
                            <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'} mb-4`}>Teacher Information</h2>
                            {batch?.teacher ? (
                                <div className="flex items-center space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <User className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className={`text-md font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{batch.teacher.name}</h3>
                                        <div className={`mt-1 flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            <Mail className="h-4 w-4 mr-1" />
                                            {batch.teacher.email}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No teacher assigned</p>
                            )}
                        </div>

                        {/* Batch Statistics */}
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 mb-6`}>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className={`text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{batch?.name}</h1>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Batch Code: {batch?.batch_code}</p>
                                </div>
                                <span className="px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800">
                                    Class {batch?.class}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex items-center">
                                    <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                                    <div>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Students</p>
                                        <p className={`font-medium ${darkMode ? 'text-gray-300' : ''}`}>{batch?.studentsCount || 0}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                                    <div>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Announcements</p>
                                        <p className={`font-medium ${darkMode ? 'text-gray-300' : ''}`}>{batch?.announcements?.length || 0}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                                    <div>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Started On</p>
                                        <p className={`font-medium ${darkMode ? 'text-gray-300' : ''}`}>
                                            {new Date(batch?.createdAt).toLocaleDateString()}
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
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
                            <ParentAttendanceView 
                                batchId={batchId} 
                                studentId={searchParams.get('studentId')} 
                            />
                        </div>
                    </div>
                );

            case 'announcements':
                return (
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
                        <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : ''}`}>Announcements</h2>
                        <div className="space-y-4">
                            {batch?.announcements?.length > 0 ? (
                                batch.announcements.map((announcement, index) => (
                                    <div key={index} className={`border-l-4 border-indigo-500 pl-4 py-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-r-lg`}>
                                        <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{announcement.title}</h3>
                                        <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{announcement.content}</p>
                                        <div className={`mt-2 flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {new Date(announcement.createdAt).toLocaleDateString()}
                                            <span className="mx-2">•</span>
                                            <User className="h-4 w-4 mr-1" />
                                            {announcement.teacher_id?.name}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No announcements yet</p>
                            )}
                        </div>
                    </div>
                );

            case 'timetable':
                return (
                    <div className="space-y-6">
                        <TimetableViewer batchId={batchId} userType="parent" />
                    </div>
                );

            case 'tests':
                return (
                    <TestResultsViewer 
                        batchId={batchId} 
                        studentId={studentId} 
                        isParentView={true}
                    />
                );

            case 'fees':
                return (
                    <ParentFeesView batchId={batchId} studentId={studentId} />
                );

            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
                <div className="text-center">
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Error</h2>
                    <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
                    <Link
                        to="/parent/dashboard"
                        className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <ParentNavbar />
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <Link
                    to="/parent/dashboard"
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                </Link>

                {/* Tabs */}
                <div className={`mb-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex flex-wrap -mb-px">
                        {[
                            { id: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4 mr-2" /> },
                            { id: 'announcements', label: 'Announcements', icon: <Bell className="w-4 h-4 mr-2" /> },
                            { id: 'attendance', label: 'Attendance', icon: <ClipboardCheck className="w-4 h-4 mr-2" /> },
                            { id: 'timetable', label: 'Timetable', icon: <Calendar className="w-4 h-4 mr-2" /> },
                            { id: 'tests', label: 'Test Results', icon: <Award className="w-4 h-4 mr-2" /> },
                            { id: 'fees', label: 'Fees', icon: <DollarSign className="w-4 h-4 mr-2" /> }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center text-sm font-medium px-4 py-3 border-b-2 ${
                                    activeTab === tab.id
                                        ? 'text-indigo-600 border-indigo-600'
                                        : darkMode 
                                            ? 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-500'
                                            : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'tests' ? (
                    <>
                        <TestResultsDebug 
                            batchId={batchId} 
                            studentId={studentId} 
                            isParentView={true} 
                        />
                        <TestResultsViewer 
                            batchId={batchId} 
                            studentId={studentId} 
                            isParentView={true}
                        />
                    </>
                ) : (
                    renderTabContent()
                )}
            </div>
        </div>
    );
}

export default ParentBatchDetail;
