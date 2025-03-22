import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DollarSign, Check, X, AlertCircle, Edit, Search } from 'lucide-react';

function FeesManager({ batchId }) {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [students, setStudents] = useState([]);
    const [feesPayments, setFeesPayments] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [paymentForm, setPaymentForm] = useState({
        studentId: '',
        amount: '',
        paymentMethod: 'offline',
        status: 'paid',
        remarks: ''
    });

    // API base URL
    const API_BASE_URL = 'http://localhost:3000';

    // Fetch data when component mounts or batchId changes
    useEffect(() => {
        if (batchId) {
            fetchFeesData();
        }
    }, [batchId]);

    // Get authentication token from local storage
    const getAuthToken = () => {
        try {
            const teacherData = JSON.parse(localStorage.getItem('teacherUser'));
            if (!teacherData || !teacherData.token) {
                throw new Error('Authentication token not found');
            }
            return teacherData.token;
        } catch (error) {
            console.error('Error getting auth token:', error);
            setError('Authentication error. Please login again.');
            return null;
        }
    };

    // Create authenticated axios instance
    const getAuthAxios = () => {
        const token = getAuthToken();
        if (!token) return null;

        return axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    };

    // Fetch students and fees payment data
    const fetchFeesData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const authAxios = getAuthAxios();
            if (!authAxios) {
                setLoading(false);
                return;
            }

            // Fetch batch details to get students
            const batchResponse = await authAxios.get(`/admin/batches/${batchId}`);
            
            if (batchResponse.data?.success) {
                // Ensure students data is properly populated
                const studentsData = batchResponse.data.batch.students || [];
                setStudents(studentsData);
            } else {
                throw new Error(batchResponse.data?.message || 'Failed to fetch batch details');
            }

            // Fetch fees payments
            const feesResponse = await authAxios.get(`/admin/batches/${batchId}/fees`);

            if (feesResponse.data?.success) {
                setFeesPayments(feesResponse.data.feesPayments || []);
            } else {
                throw new Error(feesResponse.data?.message || 'Failed to fetch fees data');
            }
        } catch (error) {
            console.error('Error fetching fees data:', error);
            setError(error.response?.data?.message || error.message || 'Failed to load fees data');
            toast.error(error.response?.data?.message || error.message || 'Failed to load fees data');
        } finally {
            setLoading(false);
        }
    };

    // Open modal for adding/editing payment
    const handleOpenModal = (student) => {
        if (!student || !student._id) {
            toast.error('Invalid student data');
            return;
        }

        setSelectedStudent(student);
        
        // Find existing payment for this student
        const existingPayment = feesPayments.find(
            payment => payment.student && payment.student._id === student._id
        );
        
        if (existingPayment) {
            setPaymentForm({
                studentId: student._id,
                amount: existingPayment.amount || '',
                paymentMethod: existingPayment.paymentMethod || 'offline',
                status: existingPayment.status || 'paid',
                remarks: existingPayment.remarks || ''
            });
        } else {
            setPaymentForm({
                studentId: student._id,
                amount: '',
                paymentMethod: 'offline',
                status: 'paid',
                remarks: ''
            });
        }
        
        setIsModalOpen(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
        setError(null);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!paymentForm.studentId) {
            toast.error('Student ID is required');
            return;
        }
        
        if (!paymentForm.amount || isNaN(paymentForm.amount) || Number(paymentForm.amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }
        
        setSubmitting(true);
        setError(null);
        
        try {
            const authAxios = getAuthAxios();
            if (!authAxios) {
                setSubmitting(false);
                return;
            }
            
            // Prepare request data
            const requestData = {
                studentId: paymentForm.studentId,
                amount: Number(paymentForm.amount),
                paymentMethod: paymentForm.paymentMethod,
                status: paymentForm.status,
                remarks: paymentForm.remarks || ''
            };
            
            // Submit data to API
            const response = await authAxios.post(
                `/admin/batches/${batchId}/fees`,
                requestData
            );
            
            if (response.data.success) {
                toast.success('Fees payment record updated successfully');
                
                // Update the fees payments list
                if (Array.isArray(response.data.feesPayments)) {
                    setFeesPayments(response.data.feesPayments);
                }
                
                // Close the modal
                handleCloseModal();
            } else {
                throw new Error(response.data.message || 'Failed to update payment');
            }
        } catch (error) {
            console.error('Error updating fees payment:', error);
            setError(error.response?.data?.message || error.message || 'Failed to update payment');
            toast.error(error.response?.data?.message || error.message || 'Failed to update payment');
        } finally {
            setSubmitting(false);
        }
    };

    // Get payment status for a student
    const getPaymentStatus = (studentId) => {
        if (!studentId || !feesPayments || !feesPayments.length) return null;
        
        return feesPayments.find(
            payment => payment.student && payment.student._id === studentId
        ) || null;
    };

    // Get color class based on payment status
    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get icon based on payment status
    const getStatusIcon = (status) => {
        switch (status) {
            case 'paid':
                return <Check className="w-4 h-4 text-green-500" />;
            case 'pending':
                return <AlertCircle className="w-4 h-4 text-yellow-500" />;
            case 'overdue':
                return <X className="w-4 h-4 text-red-500" />;
            default:
                return null;
        }
    };

    // Filter students based on search term
    const filteredStudents = students.filter(student => {
        if (!student || !student.name || !student.email) return false;
        
        return (
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Show loading spinner
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 rounded-full border-b-2 border-red-600 animate-spin"></div>
            </div>
        );
    }

    // Show error message if there's an error
    if (error && !isModalOpen) {
        return (
            <div className="overflow-hidden bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Fees Management</h2>
                </div>
                <div className="p-6 text-red-700 bg-red-50">
                    <p className="flex items-center">
                        <AlertCircle className="mr-2 w-5 h-5" />
                        {error}
                    </p>
                    <button 
                        onClick={fetchFeesData} 
                        className="px-4 py-2 mt-4 text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Fees Management</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Track and manage student fee payments
                </p>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search students by name or email"
                        className="py-2 pr-4 pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Students List with Fees Status */}
            <div className="overflow-x-auto">
                {students.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No students found in this batch.
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No students match your search.
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Student
                                </th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Payment Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Amount
                                </th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Method
                                </th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStudents.map((student) => {
                                const payment = getPaymentStatus(student._id);
                                
                                return (
                                    <tr key={student._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {student.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {student.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {payment ? (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                                    {getStatusIcon(payment.status)}
                                                    <span className="ml-1.5">{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</span>
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    Not Recorded
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {payment ? `₹${payment.amount}` : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {payment ? payment.paymentMethod.charAt(0).toUpperCase() + payment.paymentMethod.slice(1) : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                            <button
                                                onClick={() => handleOpenModal(student)}
                                                className="inline-flex items-center text-red-600 hover:text-red-900"
                                            >
                                                <Edit className="mr-1 w-4 h-4" />
                                                {payment ? 'Update' : 'Add Payment'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Payment Modal */}
            {isModalOpen && selectedStudent && (
                <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
                    <div className="overflow-hidden mx-auto w-full max-w-md bg-white rounded-lg shadow-lg">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                {feesPayments.some(p => p.student && p.student._id === selectedStudent._id) 
                                    ? 'Update Payment Record' 
                                    : 'Add Payment Record'}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Student: {selectedStudent.name}
                            </p>
                        </div>
                        
                        {error && (
                            <div className="px-6 pt-4 text-sm text-red-600">
                                <div className="flex items-center p-3 bg-red-50 rounded-md">
                                    <AlertCircle className="mr-2 w-4 h-4" />
                                    {error}
                                </div>
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={paymentForm.amount}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Payment Method
                                </label>
                                <select
                                    name="paymentMethod"
                                    value={paymentForm.paymentMethod}
                                    onChange={handleInputChange}
                                    required
                                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="offline">Offline</option>
                                    <option value="online">Online</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={paymentForm.status}
                                    onChange={handleInputChange}
                                    required
                                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Remarks (Optional)
                                </label>
                                <textarea
                                    name="remarks"
                                    value={paymentForm.remarks}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Add any additional notes..."
                                ></textarea>
                            </div>
                            
                            <div className="flex justify-end pt-4 space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md border border-transparent shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <span className="flex items-center">
                                            <span className="mr-2 w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent"></span>
                                            Saving...
                                        </span>
                                    ) : (
                                        'Save'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FeesManager; 