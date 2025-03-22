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

function StudentBatchDetail() {
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { batchId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [userData, setUserData] = useState(null);

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
                        <div className="p-6 bg-white rounded-lg shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">Teacher Information</h2>
                            {batch.teacher ? (
                                <div className="flex items-center space-x-4">
                                    <div className="flex justify-center items-center w-12 h-12 bg-indigo-100 rounded-full">
                                        <User className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900 text-md">{batch.teacher.name}</h3>
                                        <div className="flex items-center mt-1 text-sm text-gray-500">
                                            <Mail className="mr-1 w-4 h-4" />
                                            {batch.teacher.email}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">No teacher assigned</p>
                            )}
                        </div>

                        {/* Batch Statistics */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="p-6 bg-white rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <Users className="w-10 h-10 text-indigo-600" />
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Total Students</h3>
                                        <p className="text-3xl font-bold text-indigo-600">{batch.studentsCount}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-white rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <Bell className="w-10 h-10 text-green-600" />
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Announcements</h3>
                                        <p className="text-3xl font-bold text-green-600">{batch.announcements?.length || 0}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-white rounded-lg shadow-sm">
                                <div className="flex items-center">
                                    <Calendar className="w-10 h-10 text-purple-600" />
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Joined On</h3>
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
                        <div className="p-6 bg-white rounded-lg shadow-sm">
                            <StudentAttendance batchId={batchId} />
                        </div>
                    </div>
                );

            case 'announcements':
                return (
                    <div className="p-6 bg-white rounded-lg shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold">Announcements</h2>
                        <div className="space-y-4">
                            {batch.announcements && batch.announcements.length > 0 ? (
                                batch.announcements.map((announcement, index) => (
                                    <div key={index} className="py-2 pl-4 border-l-4 border-indigo-500">
                                        <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                                        <p className="mt-1 text-gray-600">{announcement.content}</p>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Posted by {announcement.teacher_id?.name} on{' '}
                                            {new Date(announcement.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No announcements yet</p>
                            )}
                        </div>
                    </div>
                );

            case 'timetable':
                return (
                    <div className="space-y-6">
                        <TimetableViewer batchId={batchId} />
                    </div>
                );

            case 'tests':
                return (
                    <TestResultsViewer 
                        batchId={batchId} 
                        studentId={userData?.id} 
                    />
                );
            case 'fees':
                return (
                    <StudentFeesView batchId={batchId} />
                );
            default:
                return (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Select a tab to view content</p>
                    </div>
                );
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <StudentNavbar />
            
            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : error ? (
                <div className="container mx-auto px-4 py-12">
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                        <div className="flex">
                            <div className="py-1">
                                <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
                            </div>
                            <div>
                                <p className="font-medium">Error</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <Link to="/student/batches" className="text-indigo-600 hover:text-indigo-800">
                            ← Back to My Batches
                        </Link>
                    </div>
                </div>
            ) : batch ? (
                <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <Link
                        to="/student/batches"
                        className="inline-flex items-center mb-6 text-indigo-600 hover:text-indigo-800"
                    >
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back to My Batches
                    </Link>

                    {/* Batch Header */}
                    <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{batch.name}</h1>
                                <p className="mt-1 text-sm text-gray-500">Batch Code: {batch.batch_code}</p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mb-6 border-b border-gray-200">
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
                                studentId={userData?.id} 
                                isParentView={false} 
                            />
                            <TestResultsViewer 
                                batchId={batchId} 
                                studentId={userData?.id} 
                            />
                        </>
                    ) : (
                        renderTabContent()
                    )}
                </div>
            ) : (
                <div className="container mx-auto px-4 py-12 text-center">
                    <p className="text-gray-500">No batch information available.</p>
                    <div className="mt-6">
                        <Link to="/student/batches" className="text-indigo-600 hover:text-indigo-800">
                            ← Back to My Batches
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentBatchDetail;
