'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import Button from '../components/Button';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error on input
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = 'Enter a valid email address';
    if (!formData.password) errs.password = 'Password is required';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      // ────────────────────────────────────────────────
      // 🔌 API INTEGRATION POINT
      // Replace this with your auth call, e.g.:
      // const res = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      // if (!res.ok) throw new Error('Invalid credentials');
      // const data = await res.json();
      // router.push('/dashboard');
      // ────────────────────────────────────────────────
      await new Promise((r) => setTimeout(r, 1200)); // simulated delay
      console.log('Login submit:', formData);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your harvest, orders, and conversations."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Top-level error banner */}
        {error && (
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <InputField
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
          required
          error={fieldErrors.email}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          }
        />

        <InputField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          error={fieldErrors.password}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          }
        />

        {/* Remember me + forgot password row */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <label className="flex items-center gap-2.5 cursor-pointer group select-none">
            <div className="relative">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="peer sr-only"
              />
              <div className="w-5 h-5 rounded-md border border-white/20 bg-white/5 peer-checked:bg-[#00D2BE] peer-checked:border-[#00D2BE] transition-all duration-200 flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-[#00D2BE]/60 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#0A0A0A]">
                <svg
                  className="w-3 h-3 text-[#0A0A0A] opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ opacity: formData.remember ? 1 : 0 }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
              Remember me
            </span>
          </label>

          <Link
            href="/forgot-password"
            className="text-sm text-[#00D2BE] hover:text-emerald-300 transition-colors duration-200 hover:underline underline-offset-4"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={loading}>
          Sign in
          {!loading && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          )}
        </Button>

        {/* Link to register */}
        <p className="text-center text-sm text-gray-400">
          Dont have an account?{' '}
          <Link
            href="/register"
            className="font-semibold text-[#00D2BE] hover:text-emerald-300 transition-colors duration-200 hover:underline underline-offset-4"
          >
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}