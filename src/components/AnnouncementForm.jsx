import React, { useState } from 'react';
import axios from 'axios';

function AnnouncementForm({ batchId, onAnnouncementCreated }) {
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            console.log('Teacher data:', teacherUser); // Debug log

            const response = await axios.post(
                `http://localhost:3000/admin/batches/${batchId}/announcements`,
                {
                    ...formData,
                    teacher_id: teacherUser.id // Add teacher ID to request
                },
                {
                    headers: {
                        'Authorization': `Bearer ${teacherUser.id}`, // Use teacher ID as token
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setFormData({ title: '', content: '' });
                onAnnouncementCreated(response.data.announcement);
            }
        } catch (error) {
            console.error('Announcement creation error:', error);
            setError(error.response?.data?.message || 'Error creating announcement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Create Announcement</h3>
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
                <button
                    type="submit"
                    disabled={loading}
                    className={`inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Creating...' : 'Create Announcement'}
                </button>
            </form>
        </div>
    );
}

export default AnnouncementForm;
