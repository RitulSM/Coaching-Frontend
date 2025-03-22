import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Award, AlertCircle } from 'lucide-react';

function TestResultsViewer({ batchId, studentId, isParentView = false }) {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTest, setSelectedTest] = useState(null);

    useEffect(() => {
        if (batchId && (isParentView ? studentId : true)) {
            fetchTests();
        } else {
            setLoading(false);
            if (isParentView && !studentId) {
                setError('Student ID is required for parent view');
            } else if (!batchId) {
                setError('Batch ID is required');
            }
        }
    }, [batchId, studentId, isParentView]);

    const fetchTests = async () => {
        try {
            setLoading(true);
            setError('');
            
            // Different storage key based on whether it's parent or student view
            const storageKey = isParentView ? 'parentData' : 'user';
            const userData = localStorage.getItem(storageKey);
            
            if (!userData) {
                throw new Error(`No ${isParentView ? 'parent' : 'student'} authentication data found`);
            }

            const parsedUserData = JSON.parse(userData);
            
            if (!parsedUserData || !parsedUserData.token) {
                console.error('User data missing token:', parsedUserData);
                throw new Error('Authentication token is missing');
            }
            
            const token = parsedUserData.token;
            
            const endpoint = isParentView 
                ? `http://localhost:3000/user/parent/batches/${batchId}/tests`
                : `http://localhost:3000/user/student/batches/${batchId}/tests`;
            
            console.log('Fetching tests with:', {
                endpoint,
                isParentView,
                hasToken: !!token,
                hasStudentId: !!studentId
            });
            
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            
            // Add studentId as query parameter for parent view
            if (isParentView && studentId) {
                config.params = { studentId };
            }
            
            const response = await axios.get(endpoint, config);

            console.log('Test results API response:', response.data);

            if (response.data?.success) {
                // For each test, find the student's marks
                const testsWithMarks = response.data.tests.map(test => {
                    // First check if studentMarks exists
                    if (!test.studentMarks || !Array.isArray(test.studentMarks)) {
                        return {
                            ...test,
                            studentMark: null
                        };
                    }
                    
                    const targetStudentId = isParentView ? studentId : parsedUserData.id;
                    
                    // Find the student's mark in the studentMarks array
                    const studentMark = test.studentMarks.find(mark => {
                        // Handle different possible formats of student reference
                        if (typeof mark.student === 'string') {
                            return mark.student === targetStudentId;
                        } else if (mark.student && typeof mark.student === 'object') {
                            return mark.student._id === targetStudentId;
                        }
                        return false;
                    });
                    
                    return {
                        ...test,
                        studentMark: studentMark || null
                    };
                });
                
                console.log('Processed tests with marks:', testsWithMarks);
                setTests(testsWithMarks);
            } else {
                throw new Error(response.data?.message || 'Failed to fetch tests');
            }
        } catch (error) {
            console.error('Error fetching tests:', error);
            setError(error.response?.data?.message || error.message || 'Failed to fetch tests');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTest = (test) => {
        setSelectedTest(test);
    };

    const getPerformanceLabel = (marks, maximumMarks) => {
        const percentage = (marks / maximumMarks) * 100;
        
        if (percentage >= 90) return { label: 'Excellent', color: 'text-green-500' };
        if (percentage >= 75) return { label: 'Very Good', color: 'text-green-600' };
        if (percentage >= 60) return { label: 'Good', color: 'text-blue-600' };
        if (percentage >= 40) return { label: 'Satisfactory', color: 'text-yellow-600' };
        return { label: 'Needs Improvement', color: 'text-red-600' };
    };

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
                </div>
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="mt-2 text-gray-600">Loading test results...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
            </div>

            {error && (
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {!selectedTest ? (
                <div>
                    {tests.length === 0 ? (
                        <div className="text-center py-8">
                            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No test results found</h3>
                            <p className="mt-1 text-sm text-gray-500">Your test results will appear here when available.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tests.map((test) => (
                                <div 
                                    key={test._id} 
                                    onClick={() => handleSelectTest(test)}
                                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{test.examName}</h3>
                                            <p className="text-sm text-gray-500">Subject: {test.subject}</p>
                                            <p className="text-sm text-gray-500">Date: {new Date(test.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            {test.studentMark ? (
                                                <div>
                                                    <span className="text-lg font-bold">{test.studentMark.marks}</span>
                                                    <span className="text-sm text-gray-500">/{test.maximumMarks}</span>
                                                    <div className={`text-xs mt-1 ${getPerformanceLabel(test.studentMark.marks, test.maximumMarks).color}`}>
                                                        {getPerformanceLabel(test.studentMark.marks, test.maximumMarks).label}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-500">Not graded yet</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <button
                        onClick={() => setSelectedTest(null)}
                        className="mb-4 text-indigo-600 hover:text-indigo-900 flex items-center"
                    >
                        <span className="mr-1">←</span> Back to all tests
                    </button>
                    
                    <div className="bg-gray-50 p-6 rounded-lg mb-6">
                        <div className="flex flex-col md:flex-row justify-between items-start">
                            <div className="mb-4 md:mb-0">
                                <h3 className="text-xl font-medium text-gray-900">{selectedTest.examName}</h3>
                                <p className="text-gray-500 mt-1">Subject: {selectedTest.subject}</p>
                                <p className="text-gray-500">Date: {new Date(selectedTest.date).toLocaleDateString()}</p>
                                <p className="text-gray-500">Maximum Marks: {selectedTest.maximumMarks}</p>
                            </div>
                            
                            {selectedTest.studentMark ? (
                                <div className="text-center bg-white p-4 rounded-lg shadow-sm">
                                    <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-full mb-2">
                                        <Award className="h-8 w-8 text-indigo-600" />
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {selectedTest.studentMark.marks}/{selectedTest.maximumMarks}
                                    </div>
                                    <div className={`text-sm mt-1 ${getPerformanceLabel(selectedTest.studentMark.marks, selectedTest.maximumMarks).color}`}>
                                        {getPerformanceLabel(selectedTest.studentMark.marks, selectedTest.maximumMarks).label}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        
                        {selectedTest.studentMark && selectedTest.studentMark.remarks && (
                            <div className="mt-6 p-4 bg-white rounded-lg">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Teacher's Remarks</h4>
                                <p className="text-gray-600">{selectedTest.studentMark.remarks}</p>
                            </div>
                        )}
                        
                        {!selectedTest.studentMark && (
                            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                                <h4 className="text-sm font-medium text-yellow-800 mb-2">Not Graded</h4>
                                <p className="text-yellow-700">Your test has not been graded yet. Please check back later.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TestResultsViewer; 