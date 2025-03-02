import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, LogOut, ChevronRight, BookmarkCheck, GraduationCap, FileText, Library, ArrowRight, Heart, Shield, Clock, Plus } from 'lucide-react';

const teacherFeatures = [
  {
    title: 'Student Management',
    description: 'Effortlessly track attendance, manage profiles, and organize student groups with our intuitive interface.',
    icon: <User className="h-8 w-8 text-red-500" />
  },
  {
    title: 'Grade Tracking',
    description: 'Record, analyze, and visualize student performance with customizable assessment tools and progress reports.',
    icon: <BookmarkCheck className="h-8 w-8 text-red-500" />
  },
  {
    title: 'Curriculum Planning',
    description: 'Design and organize your lesson plans, course content, and educational objectives with our planning tools.',
    icon: <GraduationCap className="h-8 w-8 text-red-500" />
  },
  {
    title: 'Resource Library',
    description: 'Access a comprehensive collection of teaching materials, activities, and worksheets for every subject and grade level.',
    icon: <Library className="h-8 w-8 text-red-500" />
  }
];

// Added testimonials for social proof
const testimonials = [
  {
    name: "Sarah Thompson",
    role: "High School Science Teacher",
    quote: "TeacherPortal has transformed how I manage my classroom. The grade tracking feature saves me hours each week!",
    avatar: "/api/placeholder/60/60"
  },
  {
    name: "Michael Rodriguez",
    role: "Elementary School Educator",
    quote: "The curriculum planning tools are incredibly intuitive. I've been able to create more engaging lessons for my students.",
    avatar: "/api/placeholder/60/60"
  },
  {
    name: "Jessica Chen",
    role: "Middle School Math Teacher",
    quote: "The resource library has been a lifesaver! No more endless searching for quality materials.",
    avatar: "/api/placeholder/60/60"
  }
];

// Added stats for credibility
const stats = [
  { number: "10,000+", label: "Active Teachers", icon: <User className="h-6 w-6 text-red-400" /> },
  { number: "500+", label: "School Districts", icon: <Shield className="h-6 w-6 text-red-400" /> },
  { number: "25M+", label: "Hours Saved", icon: <Clock className="h-6 w-6 text-red-400" /> },
  { number: "98%", label: "Satisfaction Rate", icon: <Heart className="h-6 w-6 text-red-400" /> }
];

function TeacherLandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [teacher, setTeacher] = useState(null);
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
    const token = localStorage.getItem('teacherToken');
    if (token) {
      setIsLoggedIn(true);
      
      // Add a check to prevent parsing undefined
      const teacherUserData = localStorage.getItem('teacherUser');
      if (teacherUserData) {
        try {
          const teacherData = JSON.parse(teacherUserData);
          setTeacher(teacherData);
        } catch (error) {
          console.error("Error parsing teacher data:", error);
          // Handle the error gracefully - could reset token if data is corrupt
          // localStorage.removeItem('teacherToken');
          // setIsLoggedIn(false);
        }
      } else {
        // Handle case where token exists but no user data is found
        console.warn("Teacher token found but no user data");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('teacherToken');
    localStorage.removeItem('teacherUser');
    setIsLoggedIn(false);
    setTeacher(null);
    navigate('/teacher');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Enhanced Navbar with Animation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg py-3' : 'bg-white/80 py-4'}`}>
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
            
            <div className="flex items-center space-x-6">
              {isLoggedIn && teacher ? (
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                    <div className="bg-red-100 p-1 rounded-full">
                      <User className="h-5 w-5 text-red-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{teacher.name || "Teacher"}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors group"
                  >
                    <span>Logout</span>
                    <LogOut className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              ) : (
                <>
                  <Link 
                    to="/teacher/login" 
                    className="text-gray-600 hover:text-red-600 transition-colors font-medium relative group"
                  >
                    Login
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all group-hover:w-full duration-300"></span>
                  </Link>
                  <Link 
                    to="/teacher/signup" 
                    className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-500 text-white px-5 py-2 rounded-lg transition-all duration-300 shadow-sm font-medium hover:shadow-md hover:scale-105"
                  >
                    <span className="relative z-10">Sign Up</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-600 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100 duration-300"></span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section with Parallax Effect */}
      <section className="pt-32 pb-32 relative overflow-hidden">
        {/* Animated Decorative Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-red-100 rounded-full opacity-50 blur-3xl animate-pulse"></div>
        <div className="absolute -top-10 right-20 w-40 h-40 bg-yellow-100 rounded-full opacity-30 blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-100 rounded-full opacity-40 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 left-40 w-60 h-60 bg-pink-100 rounded-full opacity-30 blur-3xl"></div>
        
        {/* Abstract Shapes */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 border-4 border-red-200 rounded-xl opacity-20 transform rotate-12"></div>
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 border-4 border-orange-200 rounded-full opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-block bg-red-50 p-5 rounded-2xl mb-8 shadow-md transform transition-transform hover:scale-110 duration-300">
              <BookOpen className="h-16 w-16 text-red-600" />
            </div>
            <h2 className="text-5xl sm:text-6xl font-extrabold text-gray-900 tracking-tight">
              <span className="block">Teaching Made Simple</span>
              <span className="block mt-3 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                All Your Tools in One Place
              </span>
            </h2>
            <p className="mt-8 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Streamline your teaching workflow with our comprehensive platform 
              designed specifically for educators like you. Save time, reduce stress, 
              and focus on what matters most — your students.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              {isLoggedIn ? (
                <Link 
                  to="/teacher/batches/create" 
                  className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg font-medium text-lg group hover:scale-105"
                >
                  <span>Create Batch</span>
                  <Plus className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <>
                  <Link 
                    to="/teacher/signup" 
                    className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg font-medium text-lg group hover:scale-105 w-full sm:w-auto justify-center"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link 
                    to="/teacher/demo" 
                    className="inline-flex items-center border-2 border-red-500 text-red-600 px-8 py-4 rounded-lg transition-all duration-300 font-medium text-lg hover:bg-red-50 w-full sm:w-auto justify-center"
                  >
                    <span>Watch Demo</span>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Added Stats Section */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center transform transition-transform hover:scale-105 duration-300 border border-gray-100">
                <div className="flex justify-center mb-3">
                  {stat.icon}
                </div>
                <h4 className="text-2xl md:text-3xl font-bold text-gray-900">{stat.number}</h4>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section with Cards */}
      <section className="py-20 bg-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(#f9f9f9_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-red-100 text-red-600 font-semibold text-sm mb-4">POWERFUL TOOLKIT</span>
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">Made by Teachers, for Teachers</h3>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides everything you need to manage your classroom effectively 
              and deliver exceptional educational experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teacherFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="bg-red-50 p-4 rounded-xl inline-block mb-6 group-hover:bg-red-100 transition-colors transform group-hover:scale-110 duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <Link to={`/teacher/features/${feature.title.toLowerCase().replace(/\s+/g, '-')}`} className="inline-flex items-center text-red-600 mt-4 font-medium group">
                  <span>Learn more</span>
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Added Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-red-100 text-red-600 font-semibold text-sm mb-4">TESTIMONIALS</span>
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">Loved by Educators Worldwide</h3>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              See what teachers like you are saying about TeacherPortal
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-red-100"
                  />
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500"></div>
        

        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-sm p-1 rounded-full inline-block mb-6">
            <div className="bg-white px-6 py-2 rounded-full">
              <span className="font-bold text-red-600">Limited Time Offer</span>
            </div>
          </div>
          <h3 className="text-3xl sm:text-4xl font-bold text-white">Ready to Transform Your Teaching Experience?</h3>
          <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto">
            Join thousands of educators who have simplified their workflow and enhanced student engagement.
            Start your journey today with a 30-day free trial.
          </p>
        </div>
      </section>

      {/* Enhanced Modern Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center mb-6">
                <BookOpen className="h-8 w-8 text-red-400 mr-3" />
                <span className="text-2xl font-bold">TeacherPortal</span>
              </div>
              <p className="text-gray-400 mb-6">
                Empowering educators with innovative tools to transform the classroom experience.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.090-.193-7.715-2.157-10.141-5.126-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14v-.617c.961-.689 1.8-1.56 2.46-2.548z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/teacher/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/teacher/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/teacher/integrations" className="text-gray-400 hover:text-white transition-colors">Integrations</Link></li>
                <li><Link to="/teacher/updates" className="text-gray-400 hover:text-white transition-colors">Updates</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/teacher/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/teacher/help-center" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/teacher/tutorials" className="text-gray-400 hover:text-white transition-colors">Tutorials</Link></li>
                <li><Link to="/teacher/documentation" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/teacher/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/teacher/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/teacher/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/teacher/legal" className="text-gray-400 hover:text-white transition-colors">Legal</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} TeacherPortal. All rights reserved.
            </p>
            <div className="mt-4 space-x-4">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default TeacherLandingPage;