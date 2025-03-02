import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User2Icon } from 'lucide-react';

function StudentNavbar() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.token && parsedUser.name && parsedUser.role) {
                    setUserData(parsedUser);
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <BookOpen className="h-8 w-8 text-indigo-600" />
                        <span className="text-2xl font-bold text-gray-900">EduCoach</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-4">
                        {userData ? (
                            // Show for logged in users
                            <>
                                <Link to="/student/batches" className="text-gray-600 hover:text-indigo-600">
                                    My Batches
                                </Link>
                                <Link to="/student/join-batch" className="text-gray-600 hover:text-indigo-600">
                                    Join Batch
                                </Link>
                                <div className="flex items-center space-x-4 ml-4 border-l pl-4">
                                    <span className="text-gray-700 flex items-center justify-center gap-1.5"><User2Icon className='h-5 w-5'/> {userData.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-red-500 hover:text-red-600 flex items-center space-x-1"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            // Show for non-logged in users
                            <>
                                <Link to="/user/login" className="text-gray-600 hover:text-indigo-600">
                                    Login
                                </Link>
                                <Link to="/user/signup" className="text-gray-600 hover:text-indigo-600">
                                    Sign Up
                                </Link>
                                <Link
                                    to="/teacher"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                >
                                    Teacher Portal
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default StudentNavbar;
