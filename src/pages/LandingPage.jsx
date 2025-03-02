import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight,  BookOpen, Award, Clock, Users, MessageSquare, Zap } from "lucide-react"
import StudentNavbar from "../components/StudentNavbar";

const features = [
  {
    title: "Expert Instructors",
    description: "Learn from experienced educators who specialize in your subject area",
    icon: <Award className="h-8 w-8 text-indigo-600" />,
  },
  {
    title: "Interactive Learning",
    description: "Engage with course materials through quizzes, exercises, and live sessions",
    icon: <Zap className="h-8 w-8 text-indigo-600" />,
  },
  {
    title: "Study Groups",
    description: "Connect with peers for collaborative learning and problem-solving",
    icon: <Users className="h-8 w-8 text-indigo-600" />,
  },
  {
    title: "Practice Tests",
    description: "Prepare for exams with our comprehensive practice materials",
    icon: <BookOpen className="h-8 w-8 text-indigo-600" />,
  },
  {
    title: "Flexible Schedule",
    description: "Access course materials anytime, anywhere to fit your learning pace",
    icon: <Clock className="h-8 w-8 text-indigo-600" />,
  },
  {
    title: "Personal Guidance",
    description: "Get personalized feedback and support from dedicated mentors",
    icon: <MessageSquare className="h-8 w-8 text-indigo-600" />,
  },
]

function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData)); 
    }
  }, []);


  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNavbar />


      <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-indigo-700 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:w-2/3">
            <h2 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
              <span className="block">Achieve Academic</span>
              <span className="block text-indigo-300">Excellence</span>
            </h2>

            <p className="mt-6 max-w-lg text-xl text-indigo-100">
              Personalized coaching to help you excel in your studies. 
              Our expert educators and tailored learning paths will guide you to success.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              {isLoggedIn ? (
                <Link
                  to="/student/batches"
                  className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
                >
                  Go to My Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/user/signup"
                    className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
                  >
                    Start Learning
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/student/batches"
                    className="flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                  >
                    Explore Courses
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>


      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '10k+', label: 'Students' },
            { number: '95%', label: 'Success Rate' },
            { number: '50+', label: 'Expert Teachers' },
            { number: '100+', label: 'Courses' }
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-bold text-indigo-600">{stat.number}</p>
              <p className="mt-2 text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>


      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose EduCoach?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-indigo-50 p-3 rounded-full mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="my-24">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Popular Courses</h3>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Course 1 */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="h-48 bg-indigo-200 flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-indigo-600" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">Mathematics</span>
                <span className="text-sm font-medium text-gray-600">4.9 ★</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Advanced Calculus</h4>
              <p className="text-gray-600 text-sm mb-4">Master derivatives, integrals, and applications with our comprehensive course.</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-indigo-600">12 Weeks</span>
                <Link to="/course/calculus" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View Details →</Link>
              </div>
            </div>
          </div>
          
          {/* Course 2 */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="h-48 bg-green-200 flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-green-600" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">Physics</span>
                <span className="text-sm font-medium text-gray-600">4.8 ★</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Mechanics & Dynamics</h4>
              <p className="text-gray-600 text-sm mb-4">Understand the fundamental principles of motion, forces, and energy.</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-600">10 Weeks</span>
                <Link to="/course/physics" className="text-green-600 hover:text-green-800 text-sm font-medium">View Details →</Link>
              </div>
            </div>
          </div>
          
          {/* Course 3 */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="h-48 bg-purple-200 flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-purple-600" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">Chemistry</span>
                <span className="text-sm font-medium text-gray-600">4.7 ★</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Organic Chemistry</h4>
              <p className="text-gray-600 text-sm mb-4">Explore carbon compounds, reactions, and laboratory techniques.</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-purple-600">14 Weeks</span>
                <Link to="/course/chemistry" className="text-purple-600 hover:text-purple-800 text-sm font-medium">View Details →</Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <Link to="/courses" className="inline-flex items-center justify-center px-6 py-3 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 text-base font-medium rounded-md">
            View All Courses
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Testimonials section - improved light mode styling */}
      <div className="my-24 from-indigo-50 to-blue-50 bg-gradient-to-r rounded-2xl shadow-md p-8">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Student Success Stories</h3>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Testimonial 1 */}
          <div className="bg-white shadow-lg rounded-xl p-8">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-black italic mb-6">"EduCoach helped me improve my math scores from C to A+. The personalized attention and practice tests were exactly what I needed. My confidence has skyrocketed!"</p>
              </div>
              <div className="flex items-center mt-4">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-800 font-bold">AP</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Anisha Patel</p>
                  <p className="text-sm text-gray-600">Mathematics Student</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Testimonial 2 */}
          <div className="bg-white shadow-lg rounded-xl p-8">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-black italic mb-6">"The study groups and interactive sessions made learning physics enjoyable. I got accepted to my dream university thanks to the preparation I received at EduCoach."</p>
              </div>
              <div className="flex items-center mt-4">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-800 font-bold">MK</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Michael Kim</p>
                  <p className="text-sm text-gray-600">Physics Student</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-indigo-700 rounded-2xl p-12 text-center text-white mt-20">
        <h3 className="text-3xl font-bold mb-6">Ready to Transform Your Academic Journey?</h3>
        <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of students who have achieved their academic goals with EduCoach.</p>
        <Link
          to="/user/signup"
          className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
        >
          Start Your Free Trial
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;