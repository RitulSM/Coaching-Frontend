import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, BookOpen, Award, Clock, Users, MessageSquare, Zap, Play, GraduationCap } from "lucide-react"
import StudentNavbar from "../components/StudentNavbar";
import { useDarkMode } from "../utils/DarkModeContext";

const features = [
  {
    title: "Expert Instructors",
    description: "Learn from experienced educators who specialize in your subject area",
    icon: <Award className="w-8 h-8 text-blue-600" />,
  },
  {
    title: "Interactive Learning",
    description: "Engage with course materials through quizzes, exercises, and live sessions",
    icon: <Zap className="w-8 h-8 text-blue-600" />,
  },
  {
    title: "Study Groups",
    description: "Connect with peers for collaborative learning and problem-solving",
    icon: <Users className="w-8 h-8 text-blue-600" />,
  },
  {
    title: "Practice Tests",
    description: "Prepare for exams with our comprehensive practice materials",
    icon: <BookOpen className="w-8 h-8 text-blue-600" />,
  },
  {
    title: "Flexible Schedule",
    description: "Access course materials anytime, anywhere to fit your learning pace",
    icon: <Clock className="w-8 h-8 text-blue-600" />,
  },
  {
    title: "Personal Guidance",
    description: "Get personalized feedback and support from dedicated mentors",
    icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
  },
]

function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const { darkMode } = useDarkMode();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData)); 
    }
  }, []);


  return (
    <div className={`min-h-screen overflow-x-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <StudentNavbar />

      {/* Hero Section - New Design */}
      <main className="container px-4 py-12 mx-auto md:py-24">
        <div className="grid grid-cols-1 gap-12 items-center lg:grid-cols-2">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <h1 className={`text-4xl font-bold leading-tight md:text-6xl ${darkMode ? 'text-gray-100' : ''}`}>
              Let's Learn New Course & Gain More Skills
            </h1>
            <p className={`text-lg md:text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Personalized coaching to help you excel in your studies. 
              Our expert educators and tailored learning paths will guide you to success.
            </p>
            
            {/* Stats and Features */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className={`text-xl font-bold ${darkMode ? 'text-gray-100' : ''}`}>50+</p>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Expert Mentors</p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className={`text-xl font-bold ${darkMode ? 'text-gray-100' : ''}`}>50+</p>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Batches</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="flex gap-6 items-center">
              {isLoggedIn ? (
                <Link
                  to="/student/batches"
                  className="px-8 py-3 font-semibold text-white bg-blue-600 rounded-full transition-colors hover:bg-blue-700"
                >
                  Go to My Courses
                </Link>
              ) : (
                <>
                  <Link
                    to="/user/signup"
                    className="px-8 py-3 font-semibold text-white bg-blue-600 rounded-full transition-colors hover:bg-blue-700"
                  >
                    Start Learning
                  </Link>
                  <Link 
                    to="/student/batches"
                    className={`flex gap-2 items-center transition-colors ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
                  >
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Play className="w-5 h-5 text-blue-600" />
                    </div>
                    Explore Courses
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full transform scale-110 translate-x-10 translate-y-10 -z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt="Student learning"
              className="object-cover w-full rounded-2xl"
            />
            
            {/* Floating Elements */}
            <div className={`absolute top-4 right-4 p-3 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div className={`absolute bottom-4 left-4 p-4 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className={`font-semibold ${darkMode ? 'text-gray-100' : ''}`}>Online Learning</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Best Way to Learn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container px-4 mx-auto">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className={`text-3xl font-bold md:text-4xl mb-4 ${darkMode ? 'text-gray-100' : ''}`}>
              Our Unique Learning Features
            </h2>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              We provide innovative tools and methods to enhance your educational journey
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-xl transition-all hover:shadow-md ${darkMode ? 'bg-gray-700 hover:bg-gray-700/80' : 'bg-white hover:bg-gray-50'}`}
              >
                <div className="p-3 mb-4 bg-blue-50 rounded-full w-fit">
                  {feature.icon}
                </div>
                <h3 className={`mb-2 text-xl font-bold ${darkMode ? 'text-gray-100' : ''}`}>{feature.title}</h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap justify-between items-center mb-12">
            <div>
              <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-gray-100' : ''}`}>Popular Course Categories</h2>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Explore our most sought-after learning paths
              </p>
            </div>
            <Link 
              to="/student/batches" 
              className={`flex items-center mt-4 lg:mt-0 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
            >
              View All Categories
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Course Category Cards */}
            {[
              { name: "Mathematics", count: 15, icon: <div className="p-3 bg-red-100 rounded-lg"><BookOpen className="w-6 h-6 text-red-600" /></div> },
              { name: "Science", count: 12, icon: <div className="p-3 bg-green-100 rounded-lg"><Zap className="w-6 h-6 text-green-600" /></div> },
              { name: "English", count: 10, icon: <div className="p-3 bg-blue-100 rounded-lg"><MessageSquare className="w-6 h-6 text-blue-600" /></div> },
              { name: "Computer Science", count: 8, icon: <div className="p-3 bg-purple-100 rounded-lg"><Users className="w-6 h-6 text-purple-600" /></div> },
            ].map((category, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-xl transition-all hover:shadow-md ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
              >
                {category.icon}
                <h3 className={`mt-4 mb-2 text-xl font-bold ${darkMode ? 'text-gray-100' : ''}`}>{category.name}</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{category.count} courses</p>
                <Link 
                  to="/student/batches" 
                  className={`flex items-center mt-4 transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  Explore
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 ${darkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-600 bg-gray-50'}`}>
        <div className="container px-4 mx-auto">
          <div className="flex flex-col justify-between md:flex-row">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center">
                <BookOpen className="mr-2 w-8 h-8 text-blue-600" />
                <span className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>EduCoach</span>
              </div>
              <p className="mt-2 max-w-xs">
                Empowering students to achieve academic excellence through personalized learning.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
              {/* Quick Links */}
              <div>
                <h3 className={`mb-4 text-sm font-semibold uppercase ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Quick Links</h3>
                <ul className="space-y-2">
                  {['Home', 'About', 'Courses', 'Contact'].map((link) => (
                    <li key={link}>
                      <a 
                        href="#" 
                        className={`transition-colors ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Help */}
              <div>
                <h3 className={`mb-4 text-sm font-semibold uppercase ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Help</h3>
                <ul className="space-y-2">
                  {['FAQs', 'Support', 'Privacy Policy', 'Terms of Service'].map((link) => (
                    <li key={link}>
                      <a 
                        href="#" 
                        className={`transition-colors ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className={`pt-8 mt-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className="text-center">
              &copy; {new Date().getFullYear()} EduCoach. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage