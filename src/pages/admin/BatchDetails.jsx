import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Users, Calendar, BookOpen, ArrowLeft, Mail, User } from 'lucide-react';
import axios from 'axios';
import TeacherNavbar from '../../components/TeacherNavbar';
import AnnouncementForm from '../../components/AnnouncementForm';

function BatchDetails() {
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [announcements, setAnnouncements] = useState([]);
    const { batchId } = useParams();
    const navigate = useNavigate();

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
            const response = await axios.get(`http://localhost:3000/admin/batches/${batchId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Batch details response:', response.data); // Debug log

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
                    `http://localhost:3000/admin/batches/${batchId}/announcements`,
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
    }, [batchId]);

    const handleAnnouncementCreated = (newAnnouncement) => {
        setAnnouncements([newAnnouncement, ...announcements]);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
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
                        to="/teacher/batches"
                        className="mt-4 inline-flex items-center text-red-600 hover:text-red-800"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Batches
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <TeacherNavbar />
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    to="/teacher/batches"
                    className="inline-flex items-center text-red-600 hover:text-red-800 mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Batches
                </Link>

                {/* Batch Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{batch.name}</h1>
                            <p className="text-sm text-gray-500 mt-1">Batch Code: {batch.batch_code}</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium 
                                ${batch.status === 'active' ? 'bg-green-100 text-green-800' : 
                                  batch.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-red-100 text-red-800'}`}>
                                {batch.status || 'Active'}
                            </span>
                        </div>
                    </div>

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
                                <p className="font-medium">{batch.students?.length || 0} Enrolled</p>
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
                    {batch.teacher_id ? (
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <User className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-md font-medium text-gray-900">{batch.teacher_id.name}</h3>
                                <div className="mt-1 flex items-center text-sm text-gray-500">
                                    <Mail className="h-4 w-4 mr-1" />
                                    {batch.teacher_id.email}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">No teacher assigned</p>
                    )}
                </div>

                {/* Students List */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Enrolled Students</h2>
                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                            <Users className="h-4 w-4 mr-2" />
                            Add Students
                        </button>
                    </div>

                    {batch.students && batch.students.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {batch.students.map((student) => (
                                        <tr key={student._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                        <User className="h-4 w-4 text-gray-500" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {student.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{student.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Users className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No students yet</h3>
                            <p className="mt-1 text-sm text-gray-500">Start by adding students to this batch.</p>
                        </div>
                    )}
                </div>

                {/* Announcements */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Announcements</h2>
                    <AnnouncementForm 
                        batchId={batchId} 
                        onAnnouncementCreated={handleAnnouncementCreated}
                    />
                    
                    <div className="mt-6 space-y-4">
                        {announcements.map((announcement) => (
                            <div 
                                key={announcement._id} 
                                className="bg-white p-4 rounded-lg shadow-sm"
                            >
                                <h3 className="text-lg font-medium text-gray-900">
                                    {announcement.title}
                                </h3>
                                <p className="mt-1 text-gray-600">
                                    {announcement.content}
                                </p>
                                <div className="mt-2 text-sm text-gray-500">
                                    Posted by {announcement.teacher_id.name} on{' '}
                                    {new Date(announcement.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BatchDetails;
