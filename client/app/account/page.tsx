"use client";

import { api } from "@/lib/api";
import { saveAuthData, UserRole } from "@/lib/auth";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";

const locations = {
  Central: ["Kandy", "Matale", "Nuwara Eliya"],
  Eastern: ["Ampara", "Batticaloa", "Trincomalee"],
  "North Central": ["Anuradhapura", "Polonnaruwa"],
  Northern: ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
  "North Western": ["Kurunegala", "Puttalam"],
  Sabaragamuwa: ["Kegalle", "Ratnapura"],
  Southern: ["Galle", "Hambantota", "Matara"],
  Uva: ["Badulla", "Monaragala"],
  Western: ["Colombo", "Gampaha", "Kalutara"],
};

type ProvinceName = keyof typeof locations;

type AuthUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  province?: string;
  district?: string;
  isActive?: boolean;
};

type AuthResponse = {
  message: string;
  token: string;
  role: UserRole;
  user: AuthUser;
};

type AuthErrorResponse = {
  message?: string;
  error?: string;
};

const AUTH_TOAST_ID = "auth-toast";

const EyeIcon = () => (
  <svg
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
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<ProvinceName | "">(
    ""
  );
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [isSignUpWaiting, setIsSignUpWaiting] = useState(false);
  const [isSignInWaiting, setIsSignInWaiting] = useState(false);

  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToastError = (message: string) => {
    toast.error(message, {
      id: AUTH_TOAST_ID,
    });
  };

  const showToastSuccess = (message: string) => {
    toast.success(message, {
      id: AUTH_TOAST_ID,
    });
  };

  const showRegisterPanel = () => {
    toast.dismiss(AUTH_TOAST_ID);
    setIsRightPanelActive(true);
  };

  const showLoginPanel = () => {
    toast.dismiss(AUTH_TOAST_ID);
    setIsRightPanelActive(false);
  };

  const handleProvinceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvince(e.target.value as ProvinceName);
    setSelectedDistrict("");
  };

  const redirectByRole = (role: UserRole) => {
    if (role === "admin") {
      router.push("/admin");
    } else if (role === "officer") {
      router.push("/officer");
    } else {
      router.push("/farmer");
    }
  };

  const getErrorMessage = (
    error: unknown,
    fallbackMessage: string
  ): string => {
    const axiosError = error as AxiosError<AuthErrorResponse>;

    return (
      axiosError.response?.data?.error ||
      axiosError.response?.data?.message ||
      fallbackMessage
    );
  };

  const handleSignUpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSignUpWaiting) return;

    const form = e.currentTarget;

    toast.dismiss(AUTH_TOAST_ID);
    setIsSignUpWaiting(true);

    const formData = new FormData(form);

    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      showToastError("Passwords do not match.");
      setIsSignUpWaiting(false);
      return;
    }

    if (!selectedProvince || !selectedDistrict) {
      showToastError("Please select your province and district.");
      setIsSignUpWaiting(false);
      return;
    }

    try {
      await api.post("/api/auth/register-farmer", {
        firstName,
        lastName,
        email,
        password,
        province: selectedProvince,
        district: selectedDistrict,
      });

      showToastSuccess("Registration successful. Please login.");

      setSelectedProvince("");
      setSelectedDistrict("");
      setShowSignUpPassword(false);
      setShowConfirmPassword(false);

      form.reset();

      setIsRightPanelActive(false);
    } catch (error) {
      const message = getErrorMessage(error, "Registration failed.");
      showToastError(message);
    } finally {
      setIsSignUpWaiting(false);
    }
  };

  const handleSignInSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSignInWaiting) return;

    toast.dismiss(AUTH_TOAST_ID);
    setIsSignInWaiting(true);

    const formData = new FormData(e.currentTarget);

    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    try {
      const res = await api.post<AuthResponse>("/api/auth/login", {
        email,
        password,
      });

      saveAuthData({
        token: res.data.token,
        role: res.data.role,
        user: res.data.user,
      });

      showToastSuccess(`Welcome ${res.data.user.firstName}!`);

      redirectByRole(res.data.role);
    } catch (error) {
      const message = getErrorMessage(error, "Login failed.");
      showToastError(message);
    } finally {
      setIsSignInWaiting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="rounded-2xl border border-green-100 bg-white px-6 py-4 shadow-sm">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-white font-sans">
      <div className="relative h-full w-full bg-white">
        {/* SIGN UP FORM */}
        <div
          className={`absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center bg-white px-8 transition-all duration-700 ease-in-out sm:px-16 md:w-[40%] lg:px-24 ${
            isRightPanelActive
              ? "z-50 translate-x-0 opacity-100 md:translate-x-[150%]"
              : "pointer-events-none z-10 translate-x-0 opacity-0"
          }`}
        >
          <form
            className="hide-scrollbar flex max-h-screen w-full max-w-md flex-col items-center justify-center overflow-y-auto px-2 py-8 text-center"
            onSubmit={handleSignUpSubmit}
          >
            <h1 className="mb-1 text-3xl font-bold text-black md:text-4xl">
              Join Agri<span className="text-green-600">Connect</span>
            </h1>

            <span className="mb-4 text-sm text-gray-500">
              Create your farmer account in seconds
            </span>

            <div className="flex w-full gap-2">
              <input
                name="firstName"
                type="text"
                placeholder="First Name"
                className="my-2 w-1/2 rounded-md bg-gray-200 px-4 py-3 text-black focus:outline-none focus:ring-1 focus:ring-green-600"
                required
              />

              <input
                name="lastName"
                type="text"
                placeholder="Last Name"
                className="my-2 w-1/2 rounded-md bg-gray-200 px-4 py-3 text-black focus:outline-none focus:ring-1 focus:ring-green-600"
                required
              />
            </div>

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              className="my-2 w-full rounded-md bg-gray-200 px-4 py-3 text-black focus:outline-none focus:ring-1 focus:ring-green-600"
              required
            />

            <div className="relative w-full">
              <input
                name="password"
                type={showSignUpPassword ? "text" : "password"}
                placeholder="Password"
                className="my-2 w-full rounded-md bg-gray-200 px-4 py-3 pr-12 text-black focus:outline-none focus:ring-1 focus:ring-green-600"
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
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="my-2 w-full rounded-md bg-gray-200 px-4 py-3 pr-12 text-black focus:outline-none focus:ring-1 focus:ring-green-600"
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
              className="my-2 w-full rounded-md bg-gray-200 px-4 py-3 text-black focus:outline-none focus:ring-1 focus:ring-green-600"
            >
              <option value="" disabled>
                Select Province
              </option>

              {Object.keys(locations).map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>

            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedProvince}
              required
              className={`my-2 w-full rounded-md bg-gray-200 px-4 py-3 text-black focus:outline-none focus:ring-1 focus:ring-green-600 ${
                !selectedProvince ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              <option value="" disabled>
                Select District
              </option>

              {selectedProvince &&
                locations[selectedProvince].map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
            </select>

            <button
              type="submit"
              disabled={isSignUpWaiting}
              className={`mt-4 w-full rounded-md bg-green-600 py-4 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-[1.01] active:scale-[0.99] ${
                isSignUpWaiting ? "cursor-wait opacity-70" : ""
              }`}
            >
              {isSignUpWaiting ? "Creating Account..." : "Sign Up"}
            </button>

            <p className="mt-2 pb-4 text-sm text-gray-600 md:hidden">
              Already have an account?{" "}
              <button
                type="button"
                onClick={showLoginPanel}
                className="font-bold text-green-600"
              >
                Sign In
              </button>
            </p>
          </form>
        </div>

        {/* SIGN IN FORM */}
        <div
          className={`absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center bg-white px-8 transition-all duration-700 ease-in-out sm:px-16 md:w-[40%] lg:px-24 ${
            isRightPanelActive
              ? "pointer-events-none z-10 translate-x-0 opacity-0"
              : "z-50 translate-x-0 opacity-100 md:z-20"
          }`}
        >
          <form
            className="flex w-full max-w-md flex-col items-center justify-center px-2 text-center"
            onSubmit={handleSignInSubmit}
          >
            <h1 className="mb-4 text-3xl font-bold text-black md:text-4xl">
              Login Agri<span className="text-green-600">Connect</span>
            </h1>

            <span className="mb-4 text-sm text-gray-500">
              Sign in With Email & Password
            </span>

            <input
              name="email"
              type="email"
              placeholder="Enter Your Email"
              className="my-2 w-full rounded-md bg-gray-200 px-4 py-4 text-black focus:outline-none focus:ring-1 focus:ring-green-600"
              required
            />

            <div className="relative w-full">
              <input
                name="password"
                type={showSignInPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="my-2 w-full rounded-md bg-gray-200 px-4 py-4 pr-12 text-black focus:outline-none focus:ring-1 focus:ring-green-600"
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

            <a
              href="#"
              className="ml-3 w-full text-left text-sm text-gray-900 hover:text-gray-800"
            >
              Forget Password?
            </a>

            <button
              type="submit"
              disabled={isSignInWaiting}
              className={`mt-2 w-full rounded-md bg-green-600 py-4 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-[1.01] active:scale-[0.99] ${
                isSignInWaiting ? "cursor-wait opacity-70" : ""
              }`}
            >
              {isSignInWaiting ? "Checking..." : "Sign In"}
            </button>

            <p className="mt-2 text-sm text-gray-600 md:hidden">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={showRegisterPanel}
                className="font-bold text-green-600"
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>

        {/* OVERLAY */}
        <div
          className={`absolute left-1/2 top-0 z-50 hidden h-full w-1/2 overflow-hidden transition-transform duration-700 ease-in-out md:left-[40%] md:block md:w-[60%] ${
            isRightPanelActive
              ? "-translate-x-full md:-translate-x-[66.666667%]"
              : "translate-x-0"
          }`}
        >
          <div
            className={`relative -left-full h-full w-[200%] bg-white text-white transition-transform duration-700 ease-in-out md:-left-[66.666667%] md:w-[166.666667%] ${
              isRightPanelActive
                ? "translate-x-1/2 md:translate-x-[40%]"
                : "translate-x-0"
            }`}
          >
            <div
              className={`absolute left-0 top-0 flex h-full w-1/2 flex-col items-start justify-end bg-[linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.3)),url('/images/hero4.jpg')] bg-cover bg-center px-12 pb-25 text-left transition-all duration-700 md:w-[60%] lg:px-24 ${
                isRightPanelActive ? "z-20 opacity-100" : "z-10 opacity-0"
              }`}
            >
              <h1 className="mb-2 text-5xl font-bold">Welcome Back!</h1>

              <p className="mb-2 max-w-lg text-base font-medium">
                Access your AgriConnect account to connect with the local farming
                community and grow your business.
              </p>

              <button
                type="button"
                onClick={showLoginPanel}
                className="mt-2 w-48 rounded-md bg-green-600 py-4 text-sm font-bold uppercase tracking-wider text-white"
              >
                LOGIN NOW
              </button>
            </div>

            <div
              className={`absolute right-0 top-0 flex h-full w-1/2 flex-col items-end justify-end bg-[linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.3)),url('/images/hero1.png')] bg-cover bg-center px-12 pb-25 text-right transition-all duration-700 md:w-[60%] lg:px-24 ${
                isRightPanelActive ? "z-10 opacity-0" : "z-20 opacity-100"
              }`}
            >
              <h1 className="mb-2 text-5xl font-bold">Join AgriConnect</h1>

              <p className="mb-2 max-w-lg text-base font-medium">
                Step into the future of agriculture. Create your account today and
                empower local agribusiness.
              </p>

              <button
                type="button"
                onClick={showRegisterPanel}
                className="mt-2 w-48 rounded-md bg-green-600 py-4 text-sm font-bold uppercase tracking-wider text-white"
              >
                JOIN NOW
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}