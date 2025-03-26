import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Menu, X } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import { useDarkMode } from '../utils/DarkModeContext';

function ParentNavbar() {
    const [parentData, setParentData] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { darkMode } = useDarkMode();

    useEffect(() => {
        const storedData = localStorage.getItem('parentData');
        if (!storedData) {
            navigate('/parent/login');
            return;
        }
        setParentData(JSON.parse(storedData));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('parentData');
        navigate('/parent/login');
    };

    return (
        <nav className={`${darkMode ? 'bg-gray-900' : 'bg-white'} ${darkMode ? 'shadow-gray-800' : 'shadow-md'} sticky top-0 z-50`}>
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/parent/dashboard" className="flex items-center">
                            <BookOpen className="w-8 h-8 text-indigo-600" />
                            <span className={`ml-2 text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                Parent Dashboard
                            </span>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`inline-flex items-center justify-center p-2 rounded-md ${
                                darkMode 
                                    ? 'text-gray-400 hover:text-indigo-400 hover:bg-gray-800' 
                                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100'
                            }`}
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
                        <DarkModeToggle />
                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{parentData?.name}</span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-1 text-red-500 hover:text-red-600"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className={`md:hidden ${darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
                        <div className="pt-2 pb-3 space-y-1">
                            <div className={`px-4 py-2 ${darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
                                <div className={`flex items-center space-x-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <span>{parentData?.name}</span>
                                </div>
                            </div>
                            <div className="px-4 py-2 flex items-center">
                                <span className={`mr-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Theme:</span>
                                <DarkModeToggle />
                            </div>
                            <button
                                onClick={handleLogout}
                                className={`w-full text-left px-4 py-2 text-red-500 ${darkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'} flex items-center space-x-2`}
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default ParentNavbar;
