import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDarkMode } from '../utils/DarkModeContext';

function TestResultsDebug({ batchId, studentId, isParentView = false }) {
    const [apiResponse, setApiResponse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const { darkMode } = useDarkMode();

    useEffect(() => {
        // Get user information from localStorage
        const storageKey = isParentView ? 'parentData' : 'user';
        try {
            const userData = localStorage.getItem(storageKey);
            if (userData) {
                setUserInfo(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    }, [isParentView]);

    const fetchTestResults = async () => {
        setLoading(true);
        setError('');
        
        try {
            // Different storage key based on whether it's parent or student view
            const storageKey = isParentView ? 'parentData' : 'user';
            const userData = localStorage.getItem(storageKey);
            
            if (!userData) {
                throw new Error('Authentication required');
            }

            const parsedUserData = JSON.parse(userData);
            const token = parsedUserData.token || parsedUserData.id;
            
            const endpoint = isParentView 
                ? `http://localhost:3000/user/parent/batches/${batchId}/tests`
                : `http://localhost:3000/user/student/batches/${batchId}/tests`;
            
            const queryParams = isParentView 
                ? { params: { studentId } }
                : {};
            
            const response = await axios.get(
                endpoint,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    ...queryParams
                }
            );

            setApiResponse(response.data);
        } catch (error) {
            console.error('Error fetching tests:', error);
            setError(error.response?.data?.message || error.message || 'Failed to fetch tests');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            
            {apiResponse && (
                <div className="mb-4">
                    <h3 className={`mb-2 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>API Response</h3>
                    <pre className={`overflow-auto p-2 max-h-96 text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100'} rounded`}>
                        {JSON.stringify(apiResponse, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}

export default TestResultsDebug; 