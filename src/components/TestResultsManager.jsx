import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Edit, BookOpen, X, Check, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDarkMode } from '../utils/DarkModeContext';

function TestResultsManager({ batchId, students }) {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddTestModal, setShowAddTestModal] = useState(false);
    const [editingTestId, setEditingTestId] = useState(null);
    const [editingStudentMarks, setEditingStudentMarks] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);
    const { darkMode } = useDarkMode(); // Use the dark mode hook

    const [formData, setFormData] = useState({
        examName: '',
        maximumMarks: 100,
        subject: ''
    });

    const [studentMarks, setStudentMarks] = useState({});

    useEffect(() => {
        fetchTests();
    }, [batchId]);

    const fetchTests = async () => {
        try {
            setLoading(true);
            const teacherData = localStorage.getItem('teacherUser');
            if (!teacherData) {
                throw new Error('Teacher authentication required');
            }

            const { token, id } = JSON.parse(teacherData);
            const response = await axios.get(
                `http://localhost:3000/admin/batches/${batchId}/tests`,
                {
                    headers: {
                        'Authorization': `Bearer ${id}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data?.success) {
                setTests(response.data.tests);
            } else {
                throw new Error(response.data?.message || 'Failed to fetch tests');
            }
        } catch (error) {
            console.error('Error fetching tests:', error);
            setError(error.message || 'Failed to fetch tests');
            toast.error('Failed to fetch tests');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStudentMarkChange = (studentId, value) => {
        setStudentMarks(prev => ({ 
            ...prev, 
            [studentId]: {
                ...prev[studentId],
                marks: value
            } 
        }));
    };

    const handleStudentRemarkChange = (studentId, value) => {
        setStudentMarks(prev => ({ 
            ...prev, 
            [studentId]: {
                ...prev[studentId],
                remarks: value
            } 
        }));
    };

    const resetForm = () => {
        setFormData({
            examName: '',
            maximumMarks: 100,
            subject: ''
        });
        setEditingTestId(null);
    };

    const handleCreateTest = async (e) => {
        e.preventDefault();
        
        try {
            const teacherData = localStorage.getItem('teacherUser');
            if (!teacherData) {
                throw new Error('Teacher authentication required');
            }

            const { token, id } = JSON.parse(teacherData);
            
            const payload = {
                examName: formData.examName,
                maximumMarks: parseInt(formData.maximumMarks),
                subject: formData.subject
            };

            let response;
            if (editingTestId) {
                // Update existing test
                response = await axios.put(
                    `http://localhost:3000/admin/batches/${batchId}/tests/${editingTestId}`,
                    payload,
                    {
                        headers: {
                            'Authorization': `Bearer ${id}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            } else {
                // Create new test
                response = await axios.post(
                    `http://localhost:3000/admin/batches/${batchId}/tests`,
                    payload,
                    {
                        headers: {
                            'Authorization': `Bearer ${id}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            }

            if (response.data?.success) {
                toast.success(editingTestId ? 'Test updated successfully' : 'Test created successfully');
                fetchTests();
                setShowAddTestModal(false);
                resetForm();
            } else {
                throw new Error(response.data?.message || 'Operation failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || 'Operation failed');
            toast.error(error.message || 'Operation failed');
        }
    };

    const handleEditTest = (test) => {
        setFormData({
            examName: test.examName,
            maximumMarks: test.maximumMarks,
            subject: test.subject
        });
        setEditingTestId(test._id);
        setShowAddTestModal(true);
    };

    const handleDeleteTest = async (testId) => {
        if (!window.confirm('Are you sure you want to delete this test?')) {
            return;
        }

        try {
            const teacherData = localStorage.getItem('teacherUser');
            if (!teacherData) {
                throw new Error('Teacher authentication required');
            }

            const { token, id } = JSON.parse(teacherData);
            const response = await axios.delete(
                `http://localhost:3000/admin/batches/${batchId}/tests/${testId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${id}`
                    }
                }
            );

            if (response.data?.success) {
                toast.success('Test deleted successfully');
                fetchTests();
                if (selectedTest?._id === testId) {
                    setSelectedTest(null);
                }
            } else {
                throw new Error(response.data?.message || 'Failed to delete test');
            }
        } catch (error) {
            console.error('Error deleting test:', error);
            setError(error.message || 'Failed to delete test');
            toast.error(error.message || 'Failed to delete test');
        }
    };

    const handleViewTest = (test) => {
        setSelectedTest(test);
        
        // Initialize student marks from test data
        const marksMap = {};
        test.studentMarks.forEach(mark => {
            marksMap[mark.student._id] = {
                marks: mark.marks,
                remarks: mark.remarks || ''
            };
        });
        
        // Add empty entries for students without marks
        students.forEach(student => {
            if (!marksMap[student._id]) {
                marksMap[student._id] = {
                    marks: '',
                    remarks: ''
                };
            }
        });
        
        setStudentMarks(marksMap);
    };

    const handleSaveMarks = async () => {
        try {
            const teacherData = localStorage.getItem('teacherUser');
            if (!teacherData) {
                throw new Error('Teacher authentication required');
            }

            const { token, id } = JSON.parse(teacherData);
            
            // Convert student marks to array format for API
            const studentMarksArray = Object.entries(studentMarks).map(([studentId, data]) => ({
                student: studentId,
                marks: parseInt(data.marks) || 0,
                remarks: data.remarks || ''
            })).filter(mark => mark.marks > 0); // Only include students with marks
            
            const response = await axios.put(
                `http://localhost:3000/admin/batches/${batchId}/tests/${selectedTest._id}`,
                { studentMarks: studentMarksArray },
                {
                    headers: {
                        'Authorization': `Bearer ${id}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data?.success) {
                toast.success('Student marks updated successfully');
                fetchTests();
                setEditingStudentMarks(false);
                
                // Update selected test with new data
                if (response.data.test) {
                    setSelectedTest(response.data.test);
                }
            } else {
                throw new Error(response.data?.message || 'Failed to update marks');
            }
        } catch (error) {
            console.error('Error updating marks:', error);
            setError(error.message || 'Failed to update marks');
            toast.error(error.message || 'Failed to update marks');
        }
    };

    if (loading && tests.length === 0) {
        return (
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Test Results</h2>
                </div>
                <div className="py-8 text-center">
                    <div className="inline-block w-8 h-8 rounded-full border-b-2 border-indigo-600 animate-spin"></div>
                    <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading test results...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Test Results</h2>
                {!selectedTest && (
                    <button
                        onClick={() => {
                            resetForm();
                            setShowAddTestModal(true);
                        }}
                        className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md border border-transparent shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                            darkMode ? 'focus:ring-offset-gray-800' : ''}`}
                    >
                        <Plus className="mr-2 -ml-1 w-5 h-5" />
                        Add Test
                    </button>
                )}
                {selectedTest && (
                    <button
                        onClick={() => {
                            setSelectedTest(null);
                            setEditingStudentMarks(false);
                        }}
                        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                            darkMode 
                                ? 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600' 
                                : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        <ArrowLeft className="mr-2 -ml-1 w-4 h-4" />
                        Back to Tests
                    </button>
                )}
            </div>

            {error && (
                <div className={`p-4 mb-4 text-sm rounded-lg ${
                    darkMode ? 'text-red-300 bg-red-900/30' : 'text-red-700 bg-red-100'
                }`}>
                    {error}
                </div>
            )}

            {!selectedTest ? (
                <div className="overflow-x-auto">
                    {tests.length === 0 ? (
                        <div className="py-8 text-center">
                            <BookOpen className={`mx-auto w-12 h-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>No tests found</h3>
                            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Get started by creating a new test.</p>
                            <div className="mt-6">
                                <button
                                    onClick={() => {
                                        resetForm();
                                        setShowAddTestModal(true);
                                    }}
                                    className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md border border-transparent shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                        darkMode ? 'focus:ring-offset-gray-800' : ''}`}
                                >
                                    <Plus className="mr-2 -ml-1 w-5 h-5" />
                                    Add New Test
                                </button>
                            </div>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <tr>
                                    <th scope="col" className={`px-6 py-3 text-xs font-medium tracking-wider text-left uppercase ${
                                        darkMode ? 'text-gray-300' : 'text-gray-500'
                                    }`}>
                                        Exam Name
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-xs font-medium tracking-wider text-left uppercase ${
                                        darkMode ? 'text-gray-300' : 'text-gray-500'
                                    }`}>
                                        Subject
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-xs font-medium tracking-wider text-left uppercase ${
                                        darkMode ? 'text-gray-300' : 'text-gray-500'
                                    }`}>
                                        Maximum Marks
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-xs font-medium tracking-wider text-left uppercase ${
                                        darkMode ? 'text-gray-300' : 'text-gray-500'
                                    }`}>
                                        Date
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-xs font-medium tracking-wider text-left uppercase ${
                                        darkMode ? 'text-gray-300' : 'text-gray-500'
                                    }`}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                                {tests.map((test) => (
                                    <tr key={test._id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{test.examName}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{test.subject}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{test.maximumMarks}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                                {new Date(test.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 space-x-2 text-sm font-medium text-right whitespace-nowrap">
                                            <button
                                                onClick={() => handleViewTest(test)}
                                                className={`inline-flex items-center px-2.5 py-1.5 border text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                                    darkMode 
                                                        ? 'text-gray-300 border-gray-600 bg-gray-700 hover:bg-gray-600' 
                                                        : 'text-gray-700 border-gray-300 bg-white hover:bg-gray-50'
                                                }`}
                                            >
                                                View & Edit Marks
                                            </button>
                                            <button
                                                onClick={() => handleEditTest(test)}
                                                className={`${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-900'}`}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTest(test._id)}
                                                className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}`}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ) : (
                <div>
                    <div className="mb-6">
                        <h3 className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedTest.examName}</h3>
                        <div className={`flex items-center mt-1 space-x-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            <span>Subject: {selectedTest.subject}</span>
                            <span>Maximum Marks: {selectedTest.maximumMarks}</span>
                            <span>Date: {new Date(selectedTest.date).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Student Marks</h3>
                        {!editingStudentMarks ? (
                            <button
                                onClick={() => setEditingStudentMarks(true)}
                                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                    darkMode 
                                        ? 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600' 
                                        : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <Edit className="mr-2 -ml-1 w-4 h-4" />
                                Edit Marks
                            </button>
                        ) : (
                            <div className="space-x-2">
                                <button
                                    onClick={handleSaveMarks}
                                    className={`inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md border border-transparent shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                        darkMode ? 'focus:ring-offset-gray-800' : ''}`}
                                >
                                    <Save className="mr-2 -ml-1 w-4 h-4" />
                                    Save Marks
                                </button>
                                <button
                                    onClick={() => setEditingStudentMarks(false)}
                                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                        darkMode 
                                            ? 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600' 
                                            : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <X className="mr-2 -ml-1 w-4 h-4" />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <tr>
                                    <th scope="col" className={`px-6 py-3 text-xs font-medium tracking-wider text-left uppercase ${
                                        darkMode ? 'text-gray-300' : 'text-gray-500'
                                    }`}>
                                        Student Name
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-xs font-medium tracking-wider text-left uppercase ${
                                        darkMode ? 'text-gray-300' : 'text-gray-500'
                                    }`}>
                                        Email
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-xs font-medium tracking-wider text-left uppercase ${
                                        darkMode ? 'text-gray-300' : 'text-gray-500'
                                    }`}>
                                        Marks (out of {selectedTest.maximumMarks})
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-xs font-medium tracking-wider text-left uppercase ${
                                        darkMode ? 'text-gray-300' : 'text-gray-500'
                                    }`}>
                                        Remarks
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                                {students.map((student) => {
                                    const studentMark = selectedTest.studentMarks.find(
                                        mark => mark.student._id === student._id
                                    );
                                    
                                    return (
                                        <tr key={student._id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{student.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{student.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {editingStudentMarks ? (
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={selectedTest.maximumMarks}
                                                        value={studentMarks[student._id]?.marks || ''}
                                                        onChange={(e) => handleStudentMarkChange(student._id, e.target.value)}
                                                        className={`block w-20 rounded-md shadow-sm sm:text-sm ${
                                                            darkMode 
                                                                ? 'text-gray-100 bg-gray-700 border-gray-600' 
                                                                : 'border-gray-300'
                                                        }`}
                                                    />
                                                ) : (
                                                    <div className={`text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                                        {studentMark ? studentMark.marks : 'Not graded'}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {editingStudentMarks ? (
                                                    <input
                                                        type="text"
                                                        value={studentMarks[student._id]?.remarks || ''}
                                                        onChange={(e) => handleStudentRemarkChange(student._id, e.target.value)}
                                                        className={`block w-full rounded-md shadow-sm sm:text-sm ${
                                                            darkMode 
                                                                ? 'text-gray-100 bg-gray-700 border-gray-600' 
                                                                : 'border-gray-300'
                                                        }`}
                                                        placeholder="Add remarks (optional)"
                                                    />
                                                ) : (
                                                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                                        {studentMark?.remarks || '-'}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add/Edit Test Modal */}
            {showAddTestModal && (
                <div className="overflow-y-auto fixed inset-0 z-10">
                    <div className="flex justify-center items-end px-4 pt-4 pb-20 min-h-screen text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className={`inline-block overflow-hidden text-left align-bottom rounded-lg shadow-xl transition-all transform sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
                            darkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                            <form onSubmit={handleCreateTest}>
                                <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${
                                    darkMode ? 'bg-gray-800' : 'bg-white'
                                }`}>
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3 className={`text-lg font-medium leading-6 ${
                                                darkMode ? 'text-gray-100' : 'text-gray-900'
                                            }`} id="modal-title">
                                                {editingTestId ? 'Edit Test' : 'Add New Test'}
                                            </h3>
                                            <div className="mt-2">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label htmlFor="examName" className={`block text-sm font-medium ${
                                                            darkMode ? 'text-gray-300' : 'text-gray-700'
                                                        }`}>
                                                            Exam Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="examName"
                                                            id="examName"
                                                            required
                                                            value={formData.examName}
                                                            onChange={handleInputChange}
                                                            className={`block mt-1 w-full rounded-md shadow-sm sm:text-sm ${
                                                                darkMode 
                                                                    ? 'text-gray-100 bg-gray-700 border-gray-600' 
                                                                    : 'border-gray-300'
                                                            }`}
                                                            placeholder="e.g., Mid Term Exam"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="subject" className={`block text-sm font-medium ${
                                                            darkMode ? 'text-gray-300' : 'text-gray-700'
                                                        }`}>
                                                            Subject *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="subject"
                                                            id="subject"
                                                            required
                                                            value={formData.subject}
                                                            onChange={handleInputChange}
                                                            className={`block mt-1 w-full rounded-md shadow-sm sm:text-sm ${
                                                                darkMode 
                                                                    ? 'text-gray-100 bg-gray-700 border-gray-600' 
                                                                    : 'border-gray-300'
                                                            }`}
                                                            placeholder="e.g., Mathematics"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="maximumMarks" className={`block text-sm font-medium ${
                                                            darkMode ? 'text-gray-300' : 'text-gray-700'
                                                        }`}>
                                                            Maximum Marks *
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="maximumMarks"
                                                            id="maximumMarks"
                                                            required
                                                            min="1"
                                                            value={formData.maximumMarks}
                                                            onChange={handleInputChange}
                                                            className={`block mt-1 w-full rounded-md shadow-sm sm:text-sm ${
                                                                darkMode 
                                                                    ? 'text-gray-100 bg-gray-700 border-gray-600' 
                                                                    : 'border-gray-300'
                                                            }`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${
                                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                                }`}>
                                    <button
                                        type="submit"
                                        className={`inline-flex justify-center px-4 py-2 w-full text-base font-medium text-white bg-indigo-600 rounded-md border border-transparent shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm ${
                                            darkMode ? 'focus:ring-offset-gray-800' : ''}`}
                                    >
                                        {editingTestId ? 'Update Test' : 'Create Test'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddTestModal(false)}
                                        className={`inline-flex justify-center px-4 py-2 mt-3 w-full text-base font-medium rounded-md border shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${
                                            darkMode 
                                                ? 'text-gray-300 bg-gray-600 border-gray-500 hover:bg-gray-500' 
                                                : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TestResultsManager;