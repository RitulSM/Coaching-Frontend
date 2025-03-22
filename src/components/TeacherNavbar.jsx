import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User, LogIn } from 'lucide-react';

function TeacherNavbar() {
    const [user, setUser] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const userData = localStorage.getItem('teacherUser');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('teacherToken');
        localStorage.removeItem('teacherUser');
        setUser(null);
        navigate('/teacher/login');
    };

    return (
        <header>
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'py-2 bg-white border-b border-gray-200 shadow-md' 
                    : 'py-4 bg-white'
            }`}>
                <div className="container px-4 mx-auto max-w-7xl">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/teacher" className="flex items-center space-x-3 group">
                            <div className="flex justify-center items-center w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg transition-transform duration-300 group-hover:scale-105">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-xl font-bold text-gray-800">
                                    TeacherPortal
                                </h1>
                                <span className="text-xs font-medium text-gray-500">For Passionate Educators</span>
                            </div>
                        </Link>

                        <div className="hidden items-center space-x-10 md:flex">
                            {[
                                ['My Batches', '/teacher/batches'],
                                ['Create Batch', '/teacher/batches/create']
                            ].map(([name, path]) => (
                                <Link
                                    key={path}
                                    to={path}
                                    className="relative font-medium text-gray-700 transition-colors hover:text-red-600"
                                >
                                    <span className="relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full">
                                        {name}
                                    </span>
                                </Link>
                            ))}
                        </div>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center p-2 bg-gray-50 rounded-full border border-gray-100">
                                    <div className="flex justify-center items-center w-8 h-8 bg-red-50 rounded-full">
                                        <User className="w-4 h-4 text-red-600" />
                                    </div>
                                    <span className="ml-2 text-sm font-medium text-gray-800">{user.name || "Teacher"}</span>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center px-4 py-2 space-x-2 text-gray-700 bg-gray-50 rounded-lg border border-gray-100 transition-colors duration-300 hover:bg-red-50 hover:text-red-600 hover:border-red-100"
                                >
                                    <span className="text-sm font-medium">Logout</span>
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/teacher/login"
                                    className="flex items-center px-4 py-2 space-x-2 text-gray-700 bg-gray-50 rounded-lg border border-gray-100 transition-colors duration-300 hover:bg-red-50 hover:text-red-600 hover:border-red-100"
                                >
                                    <span className="text-sm font-medium">Login</span>
                                    <LogIn className="w-4 h-4" />
                                </Link>
                                <Link
                                    to="/teacher/signup"
                                    className="flex items-center px-4 py-2 space-x-2 text-white bg-red-600 rounded-lg transition-colors duration-300 hover:bg-red-700"
                                >
                                    <span className="text-sm font-medium">Signup</span>
                                    <User className="w-4 h-4" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            <div className="h-16"></div>
        </header>
    );
}

export default TeacherNavbar;