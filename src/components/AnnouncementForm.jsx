import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDarkMode } from '../utils/DarkModeContext';

function AnnouncementForm({ batchId, onAnnouncementCreated, announcementToEdit, onAnnouncementUpdated, onCancelEdit }) {
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const { darkMode } = useDarkMode();

    useEffect(() => {
        if (announcementToEdit) {
            setFormData({
                title: announcementToEdit.title,
                content: announcementToEdit.content
            });
            setIsEditing(true);
        } else {
            setFormData({
                title: '',
                content: ''
            });
            setIsEditing(false);
        }
    }, [announcementToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const teacherUserStr = localStorage.getItem('teacherUser');
            if (!teacherUserStr) {
                throw new Error('Teacher authentication required');
            }

            const teacherUser = JSON.parse(teacherUserStr);
            
            if (isEditing) {
                // Update existing announcement
                const response = await axios.put(
                    `http://localhost:3000/admin/batches/${batchId}/announcements/${announcementToEdit._id}`,
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${teacherUser.id}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data.success) {
                    setFormData({ title: '', content: '' });
                    setIsEditing(false);
                    if (onAnnouncementUpdated) {
                        onAnnouncementUpdated(response.data.announcement);
                    }
                }
            } else {
                // Create new announcement
                const response = await axios.post(
                    `http://localhost:3000/admin/batches/${batchId}/announcements`,
                    {
                        ...formData,
                        teacher_id: teacherUser.id
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${teacherUser.id}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data.success) {
                    setFormData({ title: '', content: '' });
                    if (onAnnouncementCreated) {
                        onAnnouncementCreated(response.data.announcement);
                    }
                }
            }
        } catch (error) {
            console.error('Announcement operation error:', error);
            setError(error.response?.data?.message || `Error ${isEditing ? 'updating' : 'creating'} announcement`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({ title: '', content: '' });
        setIsEditing(false);
        if (onCancelEdit) {
            onCancelEdit();
        }
    };

    return (
        <div className={`p-6 ${darkMode ? 'text-white bg-gray-800' : 'bg-white'} rounded-lg shadow-sm`}>
            <h3 className={`mb-4 text-lg font-medium ${darkMode ? 'text-gray-200' : ''}`}>{isEditing ? 'Edit Announcement' : 'Create Announcement'}</h3>
            {error && (
                <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-md">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className={`block px-3 py-2 mt-1 w-full rounded-md border ${
                            darkMode 
                                ? 'text-white bg-gray-700 border-gray-600 focus:border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500'
                        }`}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Content
                    </label>
                    <textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={4}
                        className={`block px-3 py-2 mt-1 w-full rounded-md border ${
                            darkMode 
                                ? 'text-white bg-gray-700 border-gray-600 focus:border-red-500 focus:ring-red-500' 
                                : 'border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500'
                        }`}
                        required
                    />
                </div>
                <div className="flex space-x-3">
                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className={`inline-flex justify-center px-4 py-2 text-sm font-medium ${
                                darkMode
                                    ? 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600'
                                    : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                            } rounded-md border shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Announcement' : 'Create Announcement')}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AnnouncementForm;
