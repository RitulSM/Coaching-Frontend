import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User, LogIn, Menu, X } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import { useDarkMode } from '../utils/DarkModeContext';

function TeacherNavbar() {
    const [user, setUser] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { darkMode } = useDarkMode();

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
                    ? darkMode 
                        ? 'py-2 bg-gray-900 border-b border-gray-700 shadow-md' 
                        : 'py-2 bg-white border-b border-gray-200 shadow-md'
                    : darkMode 
                        ? 'py-4 bg-gray-900' 
                        : 'py-4 bg-white'
            }`}>
                <div className="container px-4 mx-auto max-w-7xl">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/teacher" className="flex items-center space-x-3 group">
                            <div className="flex justify-center items-center w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg transition-transform duration-300 group-hover:scale-105">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                                    TeacherPortal
                                </h1>
                                <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>For Passionate Educators</span>
                            </div>
                        </Link>

                        {/* Mobile menu button */}
                        <div className="flex md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`inline-flex items-center justify-center p-2 rounded-md ${
                                    darkMode 
                                        ? 'text-gray-400 hover:text-red-400 hover:bg-gray-800' 
                                        : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'
                                }`}
                            >
                                {isMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>

                        {/* Desktop navigation */}
                        <div className="hidden items-center space-x-6 md:flex">
                            {user && [
                                ['My Batches', '/teacher/batches'],
                                ['Create Batch', '/teacher/batches/create']
                            ].map(([name, path]) => (
                                <Link
                                    key={path}
                                    to={path}
                                    className={`relative font-medium ${darkMode ? 'text-gray-300 hover:text-red-400' : 'text-gray-700 hover:text-red-600'} transition-colors`}
                                >
                                    <span className="relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full">
                                        {name}
                                    </span>
                                </Link>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center space-x-4">
                            <DarkModeToggle />
                            
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <div className={`flex items-center p-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'} rounded-full border`}>
                                        <div className="flex justify-center items-center w-8 h-8 bg-red-50 rounded-full">
                                            <User className="w-4 h-4 text-red-600" />
                                        </div>
                                        <span className={`ml-2 text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{user.name || "Teacher"}</span>
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        className={`flex items-center px-4 py-2 space-x-2 ${
                                            darkMode 
                                                ? 'text-gray-300 bg-gray-800 border-gray-700 hover:bg-red-900 hover:text-red-400 hover:border-red-800' 
                                                : 'text-gray-700 bg-gray-50 border-gray-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100'
                                        } rounded-lg border transition-colors duration-300`}
                                    >
                                        <span className="text-sm font-medium">Logout</span>
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        to="/teacher/login"
                                        className={`flex items-center px-4 py-2 space-x-2 ${
                                            darkMode 
                                                ? 'text-gray-300 bg-gray-800 border-gray-700 hover:bg-red-900 hover:text-red-400 hover:border-red-800' 
                                                : 'text-gray-700 bg-gray-50 border-gray-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100'
                                        } rounded-lg border transition-colors duration-300`}
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

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className={`md:hidden pt-2 pb-3 ${darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
                            {user && (
                                <div className={`p-4 mb-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg`}>
                                    <div className="flex items-center mb-3">
                                        <div className="flex justify-center items-center w-8 h-8 bg-red-50 rounded-full">
                                            <User className="w-4 h-4 text-red-600" />
                                        </div>
                                        <span className={`ml-2 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                            {user.name || "Teacher"}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        {[
                                            ['My Batches', '/teacher/batches'],
                                            ['Create Batch', '/teacher/batches/create']
                                        ].map(([name, path]) => (
                                            <Link
                                                key={path}
                                                to={path}
                                                onClick={() => setIsMenuOpen(false)}
                                                className={`block px-3 py-2 rounded-md font-medium ${
                                                    darkMode
                                                        ? 'text-gray-300 hover:bg-gray-700 hover:text-red-400'
                                                        : 'text-gray-700 hover:bg-gray-100 hover:text-red-600'
                                                }`}
                                            >
                                                {name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {!user && (
                                <div className="px-4 py-3 space-y-2">
                                    <Link
                                        to="/teacher/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center justify-center px-4 py-3 space-x-2 font-medium rounded-lg ${
                                            darkMode
                                                ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                                                : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                                        }`}
                                    >
                                        <LogIn className="w-4 h-4 mr-1" />
                                        <span>Login</span>
                                    </Link>
                                    
                                    <Link
                                        to="/teacher/signup"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center px-4 py-3 space-x-2 font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                                    >
                                        <User className="w-4 h-4 mr-1" />
                                        <span>Signup</span>
                                    </Link>
                                </div>
                            )}
                            
                            <div className="mt-3 px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className={`mr-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Theme:</span>
                                    <DarkModeToggle />
                                </div>
                                
                                {user && (
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className={`flex items-center px-4 py-2 text-red-500 rounded-lg ${
                                            darkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                                        }`}
                                    >
                                        <LogOut className="w-4 h-4 mr-1" />
                                        <span>Logout</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
            <div className={`${isScrolled ? 'h-20' : 'h-24'} transition-all duration-300`}></div>
        </header>
    );
}

export default TeacherNavbar;