import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, LogOut, ChevronRight, BookmarkCheck, GraduationCap, FileText, Library, ArrowRight, Heart, Shield, Clock, Plus, Play } from 'lucide-react';
import TeacherNavbar from '../components/TeacherNavbar';

const teacherFeatures = [
  {
    title: 'Student Management',
    description: 'Effortlessly track attendance, manage profiles, and organize student groups with our intuitive interface.',
    icon: <User className="w-8 h-8 text-red-600" />
  },
  {
    title: 'Grade Tracking',
    description: 'Record, analyze, and visualize student performance with customizable assessment tools and progress reports.',
    icon: <BookmarkCheck className="w-8 h-8 text-red-600" />
  },
  {
    title: 'Curriculum Planning',
    description: 'Design and organize your lesson plans, course content, and educational objectives with our planning tools.',
    icon: <GraduationCap className="w-8 h-8 text-red-600" />
  },
  {
    title: 'Resource Library',
    description: 'Access a comprehensive collection of teaching materials, activities, and worksheets for every subject and grade level.',
    icon: <Library className="w-8 h-8 text-red-600" />
  }
];


// Added stats for credibility
const stats = [
  { number: "10,000+", label: "Active Teachers", icon: <User className="w-6 h-6 text-red-600" /> },
  { number: "500+", label: "School Districts", icon: <Shield className="w-6 h-6 text-red-600" /> },
  { number: "25M+", label: "Hours Saved", icon: <Clock className="w-6 h-6 text-red-600" /> },
  { number: "98%", label: "Satisfaction Rate", icon: <Heart className="w-6 h-6 text-red-600" /> }
];

function TeacherLandingPage() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();

  // Added scroll handler for navbar effects
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
    // Check for teacher user data
    const userData = localStorage.getItem('teacherUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Check for teacher token
    const token = localStorage.getItem('teacherToken');
    if (token) {
      setIsLoggedIn(true);
      
      // Add a check to prevent parsing undefined
      if (userData) {
        try {
          const teacherData = JSON.parse(userData);
          setTeacher(teacherData);
        } catch (error) {
          console.error("Error parsing teacher data:", error);
        }
      }
    }
    
    // Check for admin data
    try {
      const adminData = localStorage.getItem('admin');
      if (adminData) {
        const parsedAdminData = JSON.parse(adminData);
        if (parsedAdminData && parsedAdminData.token) {
          setIsLoggedIn(true);
          setAdmin(parsedAdminData);
        }
      }
    } catch (error) {
      console.error("Error parsing admin data:", error);
    }
  }, []);

  const handleLogout = () => {
    // Clear teacher data
    localStorage.removeItem('teacherToken');
    localStorage.removeItem('teacherUser');
    
    // Clear admin data
    localStorage.removeItem('admin');
    
    setIsLoggedIn(false);
    setUser(null);
    setTeacher(null);
    setAdmin(null);
    navigate('/teacher');
  };

  // Determine user display name and role
  const userName = admin?.name || user?.name || "User";
  const userRole = admin?.role ? (admin.role.charAt(0).toUpperCase() + admin.role.slice(1)) : "Teacher";

  return (
    <div className="min-h-screen font-sans bg-white">
      {/* Updated Navbar to match TeacherNavbar */}
      <TeacherNavbar />

      {/* Hero Section with New Design */}
      <main className="container px-4 pt-32 pb-16 mx-auto">
        <div className="grid grid-cols-1 gap-12 items-center lg:grid-cols-2">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Teaching Made Simple
              <span className="block mt-3 text-red-600">
                All Your Tools in One Place
              </span>
            </h1>
            <p className="text-lg text-gray-600 md:text-xl">
              Streamline your teaching workflow with our comprehensive platform 
              designed specifically for educators like you. Save time, reduce stress, 
              and focus on what matters most — your students.
            </p>
            
            {/* Stats and Features */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <User className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-xl font-bold">50+</p>
                  <p className="text-gray-600">Active Teachers</p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-xl font-bold">50+</p>
                  <p className="text-gray-600">Active Batches</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="flex flex-wrap gap-6 items-center">
              {isLoggedIn ? (
                <Link 
                  to="/teacher/batches/create" 
                  className="px-8 py-3 font-semibold text-white bg-red-600 rounded-full transition-colors hover:bg-red-700"
                >
                  <span>Create Batch</span>
                </Link>
              ) : (
                <>
                  <Link 
                    to="/teacher/batches" 
                    className="px-8 py-3 font-semibold text-white bg-red-600 rounded-full transition-colors hover:bg-red-700"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-red-100 rounded-full transform scale-110 translate-x-10 translate-y-10 -z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt="Teacher working"
              className="object-cover w-full rounded-2xl"
            />
            
            {/* Floating Elements */}
            <div className="absolute top-4 right-4 p-3 bg-white rounded-xl shadow-lg">
              <GraduationCap className="w-6 h-6 text-red-600" />
            </div>
            <div className="absolute bottom-4 left-4 p-4 bg-white rounded-xl shadow-lg">
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold">Online Teaching</p>
                  <p className="text-sm text-gray-600">Made Simple</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl">
          <h2 className="mb-12 text-3xl font-bold text-center">Made by Teachers, for Teachers</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {teacherFeatures.map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-xl shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 mb-4 bg-red-50 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section with updated design */}
      <div className="container px-4 mx-auto mb-20">
        <div className="p-12 text-center text-white bg-red-600 rounded-2xl">
          <h3 className="mb-6 text-3xl font-bold">Ready to Transform Your Teaching Experience?</h3>
          <p className="mx-auto mb-8 max-w-2xl text-xl">Join thousands of educators who have simplified their workflow and enhanced student engagement.</p>
          <Link
            to="/teacher/signup"
            className="inline-flex justify-center items-center px-8 py-4 text-lg font-medium text-red-600 bg-white rounded-full border border-white hover:bg-red-50"
          >
            Start Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>

    </div>
  );
}

export default TeacherLandingPage;