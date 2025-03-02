import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut } from 'lucide-react';

function ParentNavbar() {
    const [parentData, setParentData] = useState(null);
    const navigate = useNavigate();

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
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link to="/parent/dashboard" className="flex items-center">
                            <BookOpen className="h-8 w-8 text-indigo-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">
                                Parent Dashboard
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700">{parentData?.name}</span>
                        <button
                            onClick={handleLogout}
                            className="text-red-500 hover:text-red-600 flex items-center space-x-1"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default ParentNavbar;
