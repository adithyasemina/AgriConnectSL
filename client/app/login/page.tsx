"use client";

import { useState, ChangeEvent, FormEvent } from "react";

// Sri Lanka Provinces and Districts Data
const locations = {
  "Central": ["Kandy", "Matale", "Nuwara Eliya"],
  "Eastern": ["Ampara", "Batticaloa", "Trincomalee"],
  "North Central": ["Anuradhapura", "Polonnaruwa"],
  "Northern": ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
  "North Western": ["Kurunegala", "Puttalam"],
  "Sabaragamuwa": ["Kegalle", "Ratnapura"],
  "Southern": ["Galle", "Hambantota", "Matara"],
  "Uva": ["Badulla", "Monaragala"],
  "Western": ["Colombo", "Gampaha", "Kalutara"]
};

type ProvinceName = keyof typeof locations;

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.223-3.592m3.31-2.13A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.132 5.411M15 12a3 3 0 00-3-3m0 0a3 3 0 00-3 3m3-3l9 9m-9-9L3 3"
    />
  </svg>
);

export default function AuthPage() {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  // State for location selection
  const [selectedProvince, setSelectedProvince] = useState<ProvinceName | "">("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  // Button loading states
  const [isSignUpWaiting, setIsSignUpWaiting] = useState(false);
  const [isSignInWaiting, setIsSignInWaiting] = useState(false);

  // Password show/hide states
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Simple toggle functions (Timers ain kala 1 animation ekak enna)
  const showRegisterPanel = () => setIsRightPanelActive(true);
  const showLoginPanel = () => setIsRightPanelActive(false);

  const handleProvinceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvince(e.target.value as ProvinceName);
    setSelectedDistrict("");
  };

  const handleSignUpSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSignUpWaiting(true);
    setTimeout(() => setIsSignUpWaiting(false), 2000);
  };

  const handleSignInSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSignInWaiting(true);
    setTimeout(() => setIsSignInWaiting(false), 2000);
  };

  return (
    <div className="w-full h-screen bg-white font-sans overflow-hidden">
      <div className="relative w-full h-full bg-white">
        
        {/* ================= SIGN UP FORM (40% Width) ================= */}
        <div
          className={`absolute top-0 left-0 h-full w-full md:w-[40%] flex flex-col justify-center items-center px-8 sm:px-16 lg:px-24 transition-all duration-700 ease-in-out bg-white ${
            isRightPanelActive
              ? "translate-x-0 md:translate-x-[150%] opacity-100 z-50"
              : "translate-x-0 opacity-0 z-10 pointer-events-none"
          }`}
        >
          <form className="flex flex-col items-center justify-center w-full max-w-md text-center max-h-screen overflow-y-auto py-8 px-2 hide-scrollbar" onSubmit={handleSignUpSubmit}>
            <h1 className="text-3xl md:text-4xl font-bold mb-1 text-black">
              Join Agri<span className="text-green-600">Connect</span>
            </h1>
            <span className="text-sm text-gray-500 mb-4">Create your account in seconds</span>

            <div className="w-full flex gap-2">
              <input type="text" placeholder="First Name" className="w-1/2 bg-gray-200 border-none px-4 py-3 my-2 rounded-md focus:outline-none focus:ring-1 focus:ring-green-600 text-black" required />
              <input type="text" placeholder="Last Name" className="w-1/2 bg-gray-200 border-none px-4 py-3 my-2 rounded-md focus:outline-none focus:ring-1 focus:ring-green-600 text-black" required />
            </div>

            <input type="email" placeholder="Email Address" className="w-full bg-gray-200 border-none px-4 py-3 my-2 rounded-md focus:outline-none focus:ring-1 focus:ring-green-600 text-black" required />

            <div className="relative w-full">
              <input
                type={showSignUpPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-gray-200 border-none px-4 pr-12 py-3 my-2 rounded-md focus:outline-none focus:ring-1 focus:ring-green-600 text-black"
                required
              />
              <button
                type="button"
                onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                {showSignUpPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <div className="relative w-full">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full bg-gray-200 border-none px-4 pr-12 py-3 my-2 rounded-md focus:outline-none focus:ring-1 focus:ring-green-600 text-black"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <select
              value={selectedProvince}
              onChange={handleProvinceChange}
              required
              className="appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke-width%3D%222%22%20stroke%3D%22%239CA3AF%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19.5%208.25l-7.5%207.5-7.5-7.5%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1rem_center] bg-[length:1.25rem_1.25rem] bg-no-repeat pr-12 w-full bg-gray-200 border-none px-4 py-3 my-2 rounded-md focus:outline-none focus:ring-1 focus:ring-green-600 text-black"
            >
              <option value="" disabled>Select Province</option>
              {Object.keys(locations).map((province) => <option key={province} value={province}>{province}</option>)}
            </select>

            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedProvince}
              required
              className={`appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke-width%3D%222%22%20stroke%3D%22%239CA3AF%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19.5%208.25l-7.5%207.5-7.5-7.5%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1rem_center] bg-[length:1.25rem_1.25rem] bg-no-repeat pr-12 w-full border-none px-4 py-3 my-2 rounded-md focus:outline-none focus:ring-1 focus:ring-green-600 text-black ${
                !selectedProvince ? "bg-gray-200 cursor-not-allowed" : "bg-gray-200"
              }`}
            >
              <option value="" disabled>Select District</option>
              {selectedProvince && locations[selectedProvince].map((district: string) => <option key={district} value={district}>{district}</option>)}
            </select>

            <button type="submit" disabled={isSignUpWaiting} className={`mt-4 w-full rounded-md bg-green-600 text-white py-4 text-sm font-bold tracking-wider uppercase transition-transform hover:scale-101 active:scale-99 ${isSignUpWaiting ? "opacity-70 cursor-wait" : ""}`}>
              {isSignUpWaiting ? "Creating Account..." : "Sign Up"}
            </button>

            <p className="mt-6 text-sm text-gray-600 md:hidden pb-4">
              Already have an account? <button type="button" onClick={showLoginPanel} className="text-green-600 font-bold">Sign In</button>
            </p>
          </form>
        </div>

        {/* ================= SIGN IN FORM (40% Width) ================= */}
        <div
          className={`absolute top-0 left-0 h-full w-full md:w-[40%] flex flex-col justify-center items-center px-8 sm:px-16 lg:px-24 transition-all duration-700 ease-in-out bg-white ${
            isRightPanelActive
              ? "translate-x-0 opacity-0 z-10 pointer-events-none"
              : "translate-x-0 opacity-100 z-50 md:z-20"
          }`}
        >
          <form className="flex flex-col items-center justify-center w-full max-w-md text-center px-2" onSubmit={handleSignInSubmit}>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">Login Agri<span className="text-green-600">Connect</span></h1>          
            <span className="text-sm text-gray-500 mb-4">Sign in With Email & Password</span>
            
            <input type="email" placeholder="Enter Your Email" className="w-full bg-gray-200 border-none px-4 py-4 my-2 rounded-md focus:outline-none focus:ring-1 focus:ring-green-600 text-black" required />

            <div className="relative w-full">
              <input
                type={showSignInPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="w-full bg-gray-200 border-none px-4 pr-12 py-4 my-2 rounded-md focus:outline-none focus:ring-1 focus:ring-green-600 text-black"
                required
              />
              <button
                type="button"
                onClick={() => setShowSignInPassword(!showSignInPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                {showSignInPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <a href="#" className="text-sm text-left w-full text-gray-900 ml-3 hover:text-gray-800">Forget Password?</a>
            <button type="submit" disabled={isSignInWaiting} className={`mt-2 w-full rounded-md bg-green-600 text-white py-4 text-sm font-bold tracking-wider uppercase transition-transform hover:scale-101 active:scale-99 ${isSignInWaiting ? "opacity-70 cursor-wait" : ""}`}>
              {isSignInWaiting ? "Checking..." : "Sign In"}
            </button>
            <p className="text-sm text-gray-600 md:hidden mt-2">
              Don t have an account? <button type="button" onClick={showRegisterPanel} className="text-green-600 font-bold">Sign Up</button>
            </p>
          </form>
        </div>

        {/* ================= OVERLAY CONTAINER (60% Width) ================= */}
        <div
          className={`hidden md:block absolute top-0 left-1/2 md:left-[40%] w-1/2 md:w-[60%] h-full overflow-hidden transition-transform duration-700 ease-in-out z-50 ${
            isRightPanelActive ? "-translate-x-full md:-translate-x-[66.666667%]" : "translate-x-0"
          }`}
        >
          <div
            className={`bg-[#ffffff] relative -left-full md:-left-[66.666667%] h-full w-[200%] md:w-[166.666667%] transition-transform duration-700 ease-in-out text-white ${
              isRightPanelActive ? "translate-x-1/2 md:translate-x-[40%]" : "translate-x-0"
            }`}
          >
            {/* Left Content (Shows when Sign Up is active - login invite) */}
            <div className={`absolute top-0 left-0 w-1/2 md:w-[60%] h-full flex flex-col items-start justify-end pb-25 px-12 lg:px-24 text-left transition-all duration-700 bg-[linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url('/images/signin.jpeg')] bg-cover bg-center ${
              isRightPanelActive ? "opacity-100 z-20" : "opacity-0 z-10"
            }`}>
              <h1 className="text-5xl font-bold mb-2">Welcome Back!</h1>
              <p className="text-base font-medium mb-2 max-w-lg">Access your AgriConnect account to connect with the local farming community and grow your business.</p>
              <button type="button" onClick={showLoginPanel} className="mt-2 w-48 rounded-md bg-green-600 text-white py-4 text-sm font-bold tracking-wider uppercase">LOGIN NOW</button>
            </div>

            {/* Right Content (Shows when Sign In is active - join invite) */}
            <div className={`absolute top-0 right-0 w-1/2 md:w-[60%] h-full flex flex-col items-end justify-end pb-25 px-12 lg:px-24 text-right transition-all duration-700 bg-[linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url('/images/signup.png')] bg-cover bg-center ${
              isRightPanelActive ? "opacity-0 z-10" : "opacity-100 z-20"
            }`}>
              <h1 className="text-5xl font-bold mb-2">Join AgriConnect</h1>
              <p className="text-base font-medium mb-2 max-w-lg">Step into the future of agriculture. Create your account today and empower local agribusiness.</p>
              <button type="button" onClick={showRegisterPanel} className="mt-2 w-48 rounded-md bg-green-600 text-white py-4 text-sm font-bold tracking-wider uppercase">JOIN NOW</button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}