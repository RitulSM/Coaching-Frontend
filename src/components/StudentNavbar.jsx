import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User2Icon, Menu, X } from 'lucide-react';

function StudentNavbar() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        // Check all possible user types in localStorage
        const checkUserData = () => {
            const userTypes = ['user', 'teacherUser', 'parentUser', 'parentData'];
            let foundUser = null;

            for (const type of userTypes) {
                const storedData = localStorage.getItem(type);
                if (storedData) {
                    try {
                        foundUser = JSON.parse(storedData);
                        break;
                    } catch (error) {
                        console.error(`Error parsing ${type} data:`, error);
                    }
                }
            }

            setUserData(foundUser);
        };

        checkUserData();
    }, []);

    const handleLogout = () => {
        // Clear all possible user data from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('teacherUser');
        localStorage.removeItem('parentUser');
        localStorage.removeItem('parentData');
        
        setUserData(null);
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <BookOpen className="h-8 w-8 text-indigo-600" />
                        <span className="text-2xl font-bold text-gray-900">EduCoach</span>
                    </Link>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {userData ? (
                            <>
                                {userData.role === 'student' && (
                                    <>
                                        <Link to="/student/batches" className="text-gray-600 hover:text-indigo-600">
                                            My Batches
                                        </Link>
                                        <Link to="/student/join-batch" className="text-gray-600 hover:text-indigo-600">
                                            Join Batch
                                        </Link>
                                    </>
                                )}
                                {userData.role === 'admin' && (
                                    <Link to="/teacher/batches" className="text-gray-600 hover:text-indigo-600">
                                        Manage Batches
                                    </Link>
                                )}
                                {userData.role === 'parent' && (
                                    <Link to="/parent/dashboard" className="text-gray-600 hover:text-indigo-600">
                                        Dashboard
                                    </Link>
                                )}
                                <div className="flex items-center space-x-4 ml-4 border-l pl-4">
                                    <span className="text-gray-700 flex items-center gap-1.5">
                                        <User2Icon className='h-5 w-5'/>
                                        {userData.name}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-red-500 cursor-pointer hover:text-red-600 flex items-center space-x-1"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/user/login" className="text-gray-600 hover:text-indigo-600">
                                    Login
                                </Link>
                                <Link to="/user/register" className="text-gray-600 hover:text-indigo-600">
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

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200">
                        <div className="pt-2 pb-3 space-y-1">
                            {userData ? (
                                <>
                                    <div className="px-4 py-2 border-b border-gray-200">
                                        <div className="flex items-center space-x-2 text-gray-700">
                                            <User2Icon className="h-5 w-5" />
                                            <span>{userData.name}</span>
                                        </div>
                                    </div>
                                    
                                    {userData.role === 'student' && (
                                        <>
                                            <Link 
                                                to="/student/batches" 
                                                className="block px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                My Batches
                                            </Link>
                                            <Link 
                                                to="/student/join-batch" 
                                                className="block px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Join Batch
                                            </Link>
                                        </>
                                    )}
                                    
                                    {userData.role === 'admin' && (
                                        <Link 
                                            to="/teacher/batches" 
                                            className="block px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Manage Batches
                                        </Link>
                                    )}
                                    
                                    {userData.role === 'parent' && (
                                        <Link 
                                            to="/parent/dashboard" 
                                            className="block px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                    )}
                                    
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 flex items-center space-x-2"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/user/login" 
                                        className="block px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        to="/user/register" 
                                        className="block px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                    <Link 
                                        to="/teacher" 
                                        className="block px-4 py-2 text-indigo-600 font-medium hover:bg-indigo-50"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Teacher Portal
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default StudentNavbar;
