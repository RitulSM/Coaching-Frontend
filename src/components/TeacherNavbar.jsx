import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User } from 'lucide-react';

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
        navigate('/teacher/login');
    };

    return (
        <div >
        <nav className={`sticky w-full z-50 transition-all duration-300 ${
            isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg py-3' : 'bg-white/80 py-4'
        }`}>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-500 via-red-400 to-orange-400"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <Link to="/teacher" className="flex items-center group">
                        <div className="bg-red-50 p-2 rounded-lg transition-all group-hover:bg-red-100 group-hover:scale-110 duration-300">
                            <BookOpen className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="ml-3">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                                TeacherPortal
                            </h1>
                            <span className="text-xs text-gray-500 font-medium">For Passionate Educators</span>
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        {[
                            ['My Batches', '/teacher/batches'],
                            ['Create Batch', '/teacher/batches/create'],
                            ['Materials', '/teacher/materials'],
                            ['Resources', '/teacher/resources']
                        ].map(([name, path]) => (
                            <Link
                                key={path}
                                to={path}
                                className="text-gray-600 hover:text-red-600 transition-colors relative group font-medium"
                            >
                                {name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all group-hover:w-full duration-300"></span>
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center space-x-6">
                        {user && (
                            <>
                                <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                                    <div className="bg-red-100 p-1 rounded-full">
                                        <User className="h-5 w-5 text-red-600" />
                                    </div>
                                    <span className="text-gray-700 font-medium">{user.name || "Teacher"}</span>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors group"
                                >
                                    <span>Logout</span>
                                    <LogOut className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
        </div>
    );
}

export default TeacherNavbar;
