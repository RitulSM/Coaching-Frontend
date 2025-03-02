import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import axios from 'axios';
import TeacherNavbar from '../../components/TeacherNavbar';

function BatchCreation() {
    const [formData, setFormData] = useState({
        name: '', // Add name field
        batch_code: '',
        class: '', // Add class field
        teacher_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const teacherData = localStorage.getItem('teacherUser');
        if (teacherData) {
            const teacher = JSON.parse(teacherData);
            setFormData(prev => ({
                ...prev,
                teacher_id: teacher.id
            }));
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const teacherData = localStorage.getItem('teacherUser');
            if (!teacherData) {
                throw new Error('Teacher authentication required');
            }

            const { token } = JSON.parse(teacherData);
            const response = await axios.post(
                'http://localhost:3000/admin/batches',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data?.success) {
                setSuccess('Batch created successfully!');
                setTimeout(() => navigate('/teacher/batches'), 2000);
            }
        } catch (error) {
            console.error('Batch creation error:', error);
            setError(error.response?.data?.message || 'Failed to create batch');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <TeacherNavbar />
            <div className="w-full px-4 sm:px-6 md:px-8 py-8">
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-red-600 px-6 py-6">
                        <div className="flex justify-center mb-4">
                            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-md">
                                <User className="h-8 w-8 text-red-600" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-white text-center">
                            Create New Batch
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        
                        {success && (
                            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
                                {success}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Batch Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    name: e.target.value
                                }))}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                                placeholder="Enter batch name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Batch Code
                            </label>
                            <input
                                type="text"
                                name="batch_code"
                                value={formData.batch_code}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    batch_code: e.target.value.toUpperCase()
                                }))}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                                placeholder="Enter batch code (e.g., BATCH001)"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Class
                            </label>
                            <input
                                type="text"
                                name="class"
                                value={formData.class}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    class: e.target.value
                                }))}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                                placeholder="Enter class name"
                            />
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/teacher/batches')}
                                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors
                                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Creating...' : 'Create Batch'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default BatchCreation;