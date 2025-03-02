import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {  BookOpen, Calendar, User } from 'lucide-react';
import axios from 'axios';
import ParentNavbar from '../../components/ParentNavbar';

function ParentDashboard() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudentBatches();
    }, []);

    const fetchStudentBatches = async () => {
        try {
            const userStr = localStorage.getItem('parentData');
            if (!userStr) {
                navigate('/parent/login');
                return;
            }

            const userData = JSON.parse(userStr);
            const response = await axios.get(
                'http://localhost:3000/user/parent/student-batches',
                {
                    headers: {
                        'Authorization': `Bearer ${userData.token}`
                    }
                }
            );

            if (response.data.success) {
                setStudents(response.data.data);
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error.response?.data?.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading student data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <div className="text-red-500 text-center mb-4">
                        <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 text-center mb-2">Error Loading Data</h3>
                    <p className="text-gray-500 text-center">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <ParentNavbar />
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Students' Academic Overview</h1>
                
                {students.map(student => (
                    <div key={student.student.id} className="mb-10 bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-6">
                            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                <User className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-xl font-medium text-gray-900">
                                    {student.student.name}
                                </h2>
                                <p className="text-sm text-gray-500">{student.student.email}</p>
                            </div>
                            <div className="ml-auto">
                                <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                                    Active Student
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {student.batches.map(batch => (
                                <div key={batch._id} className="bg-gray-50 rounded-lg p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {batch.name}
                                        </h3>
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                            {batch.batch_code}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center text-gray-600">
                                            <BookOpen className="h-4 w-4 mr-2" />
                                            Class: {batch.class}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <User className="h-4 w-4 mr-2" />
                                            Teacher: {batch.teacher_id?.name || 'Not Assigned'}
                                        </div>
                                      
                                        <div className="flex items-center text-gray-600">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Joined: {new Date(batch.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <Link
                                            to={`/parent/batches/${batch._id}?studentId=${student.student.id}`}
                                            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                                        >
                                            <BookOpen className="h-4 w-4 mr-1" />
                                            View Full Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ParentDashboard;
