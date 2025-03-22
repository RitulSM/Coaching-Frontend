import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AnnouncementForm({ batchId, onAnnouncementCreated, announcementToEdit, onAnnouncementUpdated, onCancelEdit }) {
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);

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
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">{isEditing ? 'Edit Announcement' : 'Create Announcement'}</h3>
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                        Content
                    </label>
                    <textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={4}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500"
                        required
                    />
                </div>
                <div className="flex space-x-3">
                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
