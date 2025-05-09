import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Users, BookOpen, Search, RefreshCcw, Trash2 } from 'lucide-react';
import axios from 'axios';
import TeacherNavbar from '../../components/TeacherNavbar';
import { toast } from 'react-toastify';
import { useDarkMode } from '../../utils/DarkModeContext';

function BatchesList() {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [currentTeacher, setCurrentTeacher] = useState(null);
    const navigate = useNavigate();
    const { darkMode } = useDarkMode();

    useEffect(() => {
        // Get teacher info from localStorage
        const teacherData = localStorage.getItem('teacherUser');
        if (teacherData) {
            setCurrentTeacher(JSON.parse(teacherData));
        }
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            const response = await axios.get('https://coaching-backend-gamma.vercel.app/admin/batches');
            if (response.data?.success) {
                // Filter batches to only show those created by the logged-in teacher
                const teacherData = localStorage.getItem('teacherUser');
                if (teacherData) {
                    const teacher = JSON.parse(teacherData);
                    const teacherBatches = response.data.batches.filter(
                        batch => batch.teacher_id?._id === teacher.id
                    );
                    setBatches(teacherBatches);
                } else {
                    setBatches([]);
                }
            }
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch batches');
            setLoading(false);
        }
    };

    const handleDeleteBatch = async (batchId, e) => {
        // Prevent navigation to batch details
        e.preventDefault();
        e.stopPropagation();
        
        if (!window.confirm('Are you sure you want to delete this batch? This action cannot be undone.')) {
            return;
        }
        
        try {
            const teacherData = JSON.parse(localStorage.getItem('teacherUser'));
            const response = await axios.delete(
                `https://coaching-backend-gamma.vercel.app/admin/batches/${batchId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${teacherData.id}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toast.success('Batch deleted successfully');
                // Remove the deleted batch from the state
                setBatches(batches.filter(batch => batch._id !== batchId));
            }
        } catch (error) {
            console.error('Error deleting batch:', error);
            toast.error(error.response?.data?.message || 'Error deleting batch');
        }
    };

    const filteredBatches = batches.filter(batch => {
        const matchesSearch = batch.batch_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            batch.teacher_id?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filter === 'all') return matchesSearch;
        return matchesSearch && batch.status === filter;
    });

    const getStatusColor = (status) => {
        if (darkMode) {
            switch (status) {
                case 'active': return 'bg-green-900/30 text-green-300';
                case 'completed': return 'bg-blue-900/30 text-blue-300';
                case 'cancelled': return 'bg-red-900/30 text-red-300';
                default: return 'bg-gray-800 text-gray-300';
            }
        } else {
            switch (status) {
                case 'active': return 'bg-green-100 text-green-800';
                case 'completed': return 'bg-blue-100 text-blue-800';
                case 'cancelled': return 'bg-red-100 text-red-800';
                default: return 'bg-gray-100 text-gray-800';
            }
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className={darkMode ? 'bg-gray-900' : ''}>
            <TeacherNavbar />
            <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8 px-4 sm:px-6 lg:px-8`}>
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <div>
                            <h1 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Batches</h1>
                            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Manage your classroom batches and students
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <Link
                                to="/teacher/batches/create"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Create New Batch
                            </Link>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search batches..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                                    darkMode 
                                        ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500' 
                                        : 'bg-white border-gray-300'
                                }`}
                            />
                        </div>
                        <div className="flex gap-4">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className={`border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                                    darkMode 
                                        ? 'bg-gray-800 border-gray-700 text-gray-100' 
                                        : 'bg-white border-gray-300'
                                }`}
                            >
                                <option value="all">All Batches</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                                onClick={fetchBatches}
                                className={`p-2 ${
                                    darkMode 
                                        ? 'text-gray-400 hover:text-red-400 hover:bg-gray-800' 
                                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                                } rounded-lg`}
                            >
                                <RefreshCcw className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'}`}>
                            {error}
                        </div>
                    )}

                    {!currentTeacher ? (
                        <div className="text-center py-12">
                            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Authentication Required</h3>
                            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Please log in to view your batches</p>
                        </div>
                    ) : (
                        <>
                            {/* Batches Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredBatches.map(batch => (
                                    <div key={batch._id} className={`${
                                        darkMode 
                                            ? 'bg-gray-800 hover:shadow-gray-700' 
                                            : 'bg-white hover:shadow-md'
                                        } rounded-lg shadow-sm transition-shadow duration-200`}>
                                        <div className="p-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                                        {batch.name}
                                                    </h3>
                                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Code: {batch.batch_code}</p>
                                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Class: {batch.class}</p>
                                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                                                        Teacher: {currentTeacher?.name || 'Not assigned'}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                                                    {batch.status || 'Unknown'}
                                                </span>
                                            </div>

                                            <div className={`mt-4 flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                <Users className="h-4 w-4 mr-2" />
                                                {batch.students?.length || 0} Students
                                            </div>

                                            <div className="mt-6 flex justify-between items-center">
                                                <Link
                                                    to={`/teacher/batches/${batch._id}`}
                                                    className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'} text-sm font-medium`}
                                                >
                                                    View Details →
                                                </Link>
                                                <button
                                                    onClick={(e) => handleDeleteBatch(batch._id, e)}
                                                    className={`${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'} transition-colors`}
                                                    title="Delete Batch"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Empty State */}
                            {filteredBatches.length === 0 && (
                                <div className="text-center py-12">
                                    <BookOpen className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                                    <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                        {searchTerm 
                                            ? "No matching batches found" 
                                            : "You haven't created any batches yet"}
                                    </h3>
                                    <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {searchTerm 
                                            ? "Try adjusting your search terms"
                                            : "Get started by creating a new batch"}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BatchesList;
