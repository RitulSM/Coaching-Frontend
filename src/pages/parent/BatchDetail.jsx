import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Users, Calendar, BookOpen, ArrowLeft, Mail, User } from 'lucide-react';
import axios from 'axios';
import ParentNavbar from '../../components/ParentNavbar';

function ParentBatchDetail() {
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { batchId } = useParams();
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get('studentId');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBatchDetails = async () => {
            try {
                const userStr = localStorage.getItem('parentData'); // Ensure this matches your localStorage key
                if (!userStr) {
                    navigate('/parent/login');
                    return;
                }

                const userData = JSON.parse(userStr);
                console.log('Making request with:', {
                    batchId,
                    studentId,
                    token: userData.token,
                    parentId: userData.id
                });

                const response = await axios.get(
                    `http://localhost:3000/user/parent/batches/${batchId}`,
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

    return (
        <div className="min-h-screen bg-gray-50">
            <ParentNavbar />
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <Link
                    to="/parent/dashboard"
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                </Link>

                {/* Student Information */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h2>
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-md font-medium text-gray-900">{batch?.student?.name}</h3>
                            <p className="text-sm text-gray-500">{batch?.student?.email}</p>
                        </div>
                        <div className="ml-auto">
                            <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                                Active Enrollment
                            </span>
                        </div>
                    </div>
                </div>

                {/* Batch Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{batch?.name}</h1>
                            <p className="text-sm text-gray-500 mt-1">Batch Code: {batch?.batch_code}</p>
                        </div>
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800">
                            Class {batch?.class}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center">
                            <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                                <p className="text-sm text-gray-500">Total Students</p>
                                <p className="font-medium">{batch?.studentsCount || 0}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Users className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                                <p className="text-sm text-gray-500">Announcements</p>
                                <p className="font-medium">{batch?.announcements?.length || 0}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                                <p className="text-sm text-gray-500">Started On</p>
                                <p className="font-medium">
                                    {new Date(batch?.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Teacher Information */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Teacher Information</h2>
                    {batch?.teacher ? (
                        <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                <User className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-md font-medium text-gray-900">{batch.teacher.name}</h3>
                                <div className="mt-1 flex items-center text-sm text-gray-500">
                                    <Mail className="h-4 w-4 mr-1" />
                                    {batch.teacher.email}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">No teacher assigned</p>
                    )}
                </div>

                {/* Announcements */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Announcements</h2>
                    <div className="space-y-4">
                        {batch?.announcements?.length > 0 ? (
                            batch.announcements.map((announcement, index) => (
                                <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
                                    <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                                    <p className="mt-1 text-gray-600">{announcement.content}</p>
                                    <div className="mt-2 flex items-center text-sm text-gray-500">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {new Date(announcement.createdAt).toLocaleDateString()}
                                        <span className="mx-2">•</span>
                                        <User className="h-4 w-4 mr-1" />
                                        {announcement.teacher_id?.name}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No announcements yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ParentBatchDetail;
