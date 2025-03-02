import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, BookOpen,  Search,  RefreshCcw } from 'lucide-react';
import axios from 'axios';
import TeacherNavbar from '../../components/TeacherNavbar';

function BatchesList() {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [currentTeacher, setCurrentTeacher] = useState(null);

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
            const response = await axios.get('http://localhost:3000/admin/batches');
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

    const filteredBatches = batches.filter(batch => {
        const matchesSearch = batch.batch_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            batch.teacher_id?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filter === 'all') return matchesSearch;
        return matchesSearch && batch.status === filter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div>
            <TeacherNavbar />
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Batches</h1>
                            <p className="mt-1 text-sm text-gray-500">
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
                                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                        </div>
                        <div className="flex gap-4">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            >
                                <option value="all">All Batches</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                                onClick={fetchBatches}
                                className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50"
                            >
                                <RefreshCcw className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {!currentTeacher ? (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-medium text-gray-900">Authentication Required</h3>
                            <p className="mt-2 text-gray-500">Please log in to view your batches</p>
                        </div>
                    ) : (
                        <>
                            {/* Batches Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredBatches.map(batch => (
                                    <div key={batch._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <div className="p-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {batch.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">Code: {batch.batch_code}</p>
                                                    <p className="text-sm text-gray-500">Class: {batch.class}</p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Teacher: {currentTeacher?.name || 'Not assigned'}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                                                    {batch.status || 'Unknown'}
                                                </span>
                                            </div>

                                            <div className="mt-4 flex items-center text-sm text-gray-500">
                                                <Users className="h-4 w-4 mr-2" />
                                                {batch.students?.length || 0} Students
                                            </div>

                                            <div className="mt-6 flex justify-between items-center">
                                                <Link
                                                    to={`/teacher/batches/${batch._id}`} // Update this line
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                >
                                                    View Details →
                                                </Link>
                                                <button
                                                    onClick={() => {/* Add manage students handler */}}
                                                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    <Users className="h-4 w-4 mr-1" />
                                                    Manage
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Empty State - Updated message */}
                            {filteredBatches.length === 0 && (
                                <div className="text-center py-12">
                                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        {searchTerm 
                                            ? "No matching batches found" 
                                            : "You haven't created any batches yet"}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {searchTerm 
                                            ? "Try adjusting your search" 
                                            : "Create your first batch to get started"}
                                    </p>
                                    {!searchTerm && (
                                        <div className="mt-6">
                                            <Link
                                                to="/teacher/batches/create"
                                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                                            >
                                                <Plus className="h-5 w-5 mr-2" />
                                                Create New Batch
                                            </Link>
                                        </div>
                                    )}
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
