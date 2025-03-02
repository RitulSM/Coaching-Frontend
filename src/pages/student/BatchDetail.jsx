import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Users, Calendar, BookOpen, ArrowLeft, Mail, User } from 'lucide-react';
import axios from 'axios';
import StudentNavbar from '../../components/StudentNavbar';

function StudentBatchDetail() {
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { batchId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBatchDetails = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    navigate('/user/login');
                    return;
                }

                const userData = JSON.parse(userStr);
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

        if (batchId) {
            fetchBatchDetails();
        }
    }, [batchId, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !batch) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900">Error</h2>
                    <p className="mt-2 text-gray-600">{error || 'Batch not found'}</p>
                    <Link
                        to="/student/batches"
                        className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to My Batches
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <StudentNavbar />
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    to="/student/batches"
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to My Batches
                </Link>

                {/* Batch Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">{batch.name}</h1>
                    <p className="text-sm text-gray-500 mt-1">Batch Code: {batch.batch_code}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div className="flex items-center">
                            <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                                <p className="text-sm text-gray-500">Class</p>
                                <p className="font-medium">{batch.class}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Users className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                                <p className="text-sm text-gray-500">Students</p>
                                <p className="font-medium">{batch.studentsCount} Enrolled</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                                <p className="text-sm text-gray-500">Created</p>
                                <p className="font-medium">
                                    {new Date(batch.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Teacher Information */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Teacher Information</h2>
                    {batch.teacher ? (
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
                        {batch.announcements && batch.announcements.length > 0 ? (
                            batch.announcements.map((announcement, index) => (
                                <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
                                    <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                                    <p className="mt-1 text-gray-600">{announcement.content}</p>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Posted by {announcement.teacher_id.name} on{' '}
                                        {new Date(announcement.createdAt).toLocaleDateString()}
                                    </p>
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

export default StudentBatchDetail;
