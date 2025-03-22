import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, BookOpen, Award, Clock, Users, MessageSquare, Zap, Play, GraduationCap } from "lucide-react"
import StudentNavbar from "../components/StudentNavbar";

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData)); 
    }
  }, []);


  return (
    <div className="min-h-screen bg-white">
      <StudentNavbar />

      {/* Hero Section - New Design */}
      <main className="container px-4 py-12 mx-auto md:py-24">
        <div className="grid grid-cols-1 gap-12 items-center lg:grid-cols-2">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Let's Learn New Course & Gain More Skills
            </h1>
            <p className="text-lg text-gray-600 md:text-xl">
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
                  <p className="text-xl font-bold">50+</p>
                  <p className="text-gray-600">Expert Mentors</p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xl font-bold">50+</p>
                  <p className="text-gray-600">Batches</p>
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
                    className="flex gap-2 items-center text-gray-700 transition-colors hover:text-blue-600"
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
            <div className="absolute top-4 right-4 p-3 bg-white rounded-xl shadow-lg">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div className="absolute bottom-4 left-4 p-4 bg-white rounded-xl shadow-lg">
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">Online Learning</p>
                  <p className="text-sm text-gray-600">Best Way to Learn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Why Choose EduCoach Section */}
      <div className="py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl">
          <h2 className="mb-12 text-3xl font-bold text-center">Why Choose EduCoach?</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-xl shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 mb-4 bg-blue-50 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Testimonials section - with new styling */}
      <div className="py-12 my-24 bg-gray-50">
        <h3 className="mb-12 text-3xl font-bold text-center text-gray-800">Student Success Stories</h3>
        <div className="grid grid-cols-1 gap-8 px-4 mx-auto max-w-7xl md:grid-cols-2">
          {/* Testimonial 1 */}
          <div className="p-8 bg-white rounded-xl shadow-lg">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="mb-6 italic text-black">"EduCoach helped me improve my math scores from C to A+. The personalized attention and practice tests were exactly what I needed. My confidence has skyrocketed!"</p>
              </div>
              <div className="flex items-center mt-4">
                <div className="flex justify-center items-center w-12 h-12 bg-blue-100 rounded-full">
                  <span className="font-bold text-blue-800">AP</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Anisha Patel</p>
                  <p className="text-sm text-gray-600">Mathematics Student</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Testimonial 2 */}
          <div className="p-8 bg-white rounded-xl shadow-lg">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="mb-6 italic text-black">"The study groups and interactive sessions made learning physics enjoyable. I got accepted to my dream university thanks to the preparation I received at EduCoach."</p>
              </div>
              <div className="flex items-center mt-4">
                <div className="flex justify-center items-center w-12 h-12 bg-blue-100 rounded-full">
                  <span className="font-bold text-blue-800">MK</span>
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

      {/* CTA section with updated design */}
      <div className="container px-4 mx-auto mb-20">
        <div className="p-12 text-center text-white bg-blue-600 rounded-2xl">
          <h3 className="mb-6 text-3xl font-bold">Ready to Transform Your Academic Journey?</h3>
          <p className="mx-auto mb-8 max-w-2xl text-xl">Join thousands of students who have achieved their academic goals with EduCoach.</p>
          <Link
            to="/user/signup"
            className="inline-flex justify-center items-center px-8 py-4 text-lg font-medium text-blue-600 bg-white rounded-full border border-white hover:bg-blue-50"
          >
            Start Learning
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;