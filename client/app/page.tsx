import Link from 'next/link';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <div className="w-full bg-white">
      <Navbar />

      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-[calc(100vh-64px)] flex items-center bg-gradient-to-br from-white via-green-50 to-white px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Smart Farming Support for{' '}
                  <span className="text-green-700">Sri Lankan Paddy Farmers</span>
                </h1>
              </div>

              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Leveraging AI-based disease detection, intelligent chatbot support, soil test
                appointment scheduling, and digital soil reports to transform paddy farming and
                bridge the communication gap between farmers and agricultural officers.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/account"
                  className="px-8 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors text-center"
                >
                  Get Started
                </Link>
                <Link
                  href="/account"
                  className="px-8 py-3 border-2 border-green-700 text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors text-center"
                >
                  Login
                </Link>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-sm">
                {/* Decorative background circles */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-100 rounded-full opacity-20 blur-3xl"></div>

                {/* Main card */}
                <div className="relative bg-white rounded-2xl shadow-xl p-8 border border-green-100">
                  <div className="flex flex-col gap-6">
                    {/* Icon */}
                    <div className="flex justify-center">
                      <div className="text-6xl">🌾</div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🤖</span>
                        <span className="text-gray-700 font-medium">AI Disease Detection</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💬</span>
                        <span className="text-gray-700 font-medium">Smart Chatbot</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🧪</span>
                        <span className="text-gray-700 font-medium">Soil Testing</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📊</span>
                        <span className="text-gray-700 font-medium">Digital Reports</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to improve your farming efficiency and get expert guidance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-8 border border-green-100 hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Disease Detection</h3>
              <p className="text-gray-600">
                Identify crop diseases instantly by uploading images. Get AI-powered diagnosis and
                treatment recommendations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-8 border border-green-100 hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Chatbot Support</h3>
              <p className="text-gray-600">
                Chat with our intelligent assistant to get instant answers about farming practices,
                pest control, and crop management.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-8 border border-green-100 hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">🧪</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Soil Test Appointments</h3>
              <p className="text-gray-600">
                Schedule soil testing appointments with agricultural officers. Get professional
                analysis of your soil quality.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-8 border border-green-100 hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Digital Soil Reports</h3>
              <p className="text-gray-600">
                Access comprehensive digital soil reports with detailed recommendations for
                fertilizer and crop selection.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-8 border border-green-100 hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">📢</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Broadcast Alerts</h3>
              <p className="text-gray-600">
                Receive timely alerts about weather, pest outbreaks, and agricultural advisories
                from experts.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-8 border border-green-100 hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Knowledge Hub</h3>
              <p className="text-gray-600">
                Learn best farming practices, seasonal tips, and expert advice through our
                comprehensive knowledge base.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-xl p-8 border border-green-100 h-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-700 text-white font-bold text-lg mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Register as Farmer</h3>
                <p className="text-gray-600">
                  Create your account and set up your farm profile with location and crop details.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 text-green-400 text-2xl">
                →
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-xl p-8 border border-green-100 h-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-700 text-white font-bold text-lg mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Upload or Request Service</h3>
                <p className="text-gray-600">
                  Upload crop images for disease detection or book a soil test appointment.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 text-green-400 text-2xl">
                →
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white rounded-xl p-8 border border-green-100 h-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-700 text-white font-bold text-lg mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Get Expert Guidance</h3>
                <p className="text-gray-600">
                  Receive AI recommendations or expert advice from agricultural officers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              For Everyone
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Designed for all stakeholders in paddy farming
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Farmer Role */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-8 border-2 border-green-200 hover:shadow-lg transition-shadow">
              <div className="text-6xl mb-4">👨‍🌾</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">For Farmers</h3>
              <p className="text-gray-600 mb-4">
                Get personalized guidance, AI-powered disease detection, and direct access to
                agricultural officers.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Upload crop images</li>
                <li>✓ Book soil tests</li>
                <li>✓ Receive alerts</li>
              </ul>
            </div>

            {/* Officer Role */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-8 border-2 border-green-200 hover:shadow-lg transition-shadow">
              <div className="text-6xl mb-4">👨‍💼</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">For Agricultural Officers</h3>
              <p className="text-gray-600 mb-4">
                Manage soil testing appointments, view reports, and communicate directly with
                farmers.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Schedule tests</li>
                <li>✓ Upload reports</li>
                <li>✓ Track farmers</li>
              </ul>
            </div>

            {/* Admin Role */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-8 border-2 border-green-200 hover:shadow-lg transition-shadow">
              <div className="text-6xl mb-4">👨‍💻</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">For Administrators</h3>
              <p className="text-gray-600 mb-4">
                Manage the system, oversee all users, maintain content, and ensure system health.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Manage users</li>
                <li>✓ Broadcast messages</li>
                <li>✓ Analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-green-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              About AgriConnect
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              AgriConnect is a comprehensive digital platform designed to revolutionize paddy
              farming support in Sri Lanka. We recognize the challenges faced by paddy farmers in
              accessing timely expert guidance and diagnostic services.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Our mission is to bridge the communication gap between farmers and agricultural
              officers while leveraging artificial intelligence to provide instant, accurate
              disease detection and recommendations. Through soil testing appointments, digital
              reports, and expert consultations, we empower farmers to make data-driven decisions
              that improve crop yield and sustainability.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Built as a Final Year Software Engineering Project, AgriConnect combines modern
              technology with deep understanding of Sri Lankan agriculture to create a platform
              that truly serves the farming community.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/account"
                className="px-8 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors"
              >
                Get Started Today
              </Link>
              <Link
                href="/account"
                className="px-8 py-3 border-2 border-green-700 text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 font-bold text-2xl mb-4">
                <span className="text-3xl">🌾</span>
                AgriConnect
              </div>
              <p className="text-gray-400">
                Empowering Sri Lankan paddy farmers with intelligent farming support.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                  Features
                </a>
                <br />
                <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">
                  How It Works
                </a>
                <br />
                <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </a>
              </div>
            </div>

            {/* Get Started */}
            <div>
              <h4 className="font-bold text-lg mb-4">Get Started</h4>
              <p className="text-gray-400 mb-4">
                Join farmers across Sri Lanka using AgriConnect.
              </p>
              <Link
                href="/account"
                className="inline-block px-6 py-2 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-center sm:text-left">
                &copy; 2024 AgriConnect. Final Year Software Engineering Project.
              </p>
              <p className="text-gray-400 text-center">
                Transforming Paddy Farming in Sri Lanka
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
