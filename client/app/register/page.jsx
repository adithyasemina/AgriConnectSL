'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import Button from '../components/Button';

const PROVINCE_DISTRICTS = {
  Western: ['Colombo', 'Gampaha', 'Kalutara'],
  Central: ['Kandy', 'Matale', 'Nuwara Eliya'],
  Southern: ['Galle', 'Matara', 'Hambantota'],
  Northern: ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
  Eastern: ['Batticaloa', 'Ampara', 'Trincomalee'],
  'North Western': ['Kurunegala', 'Puttalam'],
  'North Central': ['Anuradhapura', 'Polonnaruwa'],
  Uva: ['Badulla', 'Moneragala'],
  Sabaragamuwa: ['Ratnapura', 'Kegalle'],
};

const PROVINCE_OPTIONS = Object.keys(PROVINCE_DISTRICTS).map((p) => ({
  value: p,
  label: p,
}));

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    province: '',
    district: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const districtOptions = useMemo(() => {
    if (!formData.province) return [];
    return (PROVINCE_DISTRICTS[formData.province] || []).map((d) => ({
      value: d,
      label: d,
    }));
  }, [formData.province]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'province') next.district = '';
      return next;
    });

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};

    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';

    if (!formData.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = 'Enter a valid email';

    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 8)
      errs.password = 'At least 8 characters';

    if (!formData.province) errs.province = 'Select a province';
    if (!formData.district) errs.district = 'Select a district';

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        ...formData,
        role: 'farmer',
      };

      // API connect karanna methana
      await new Promise((r) => setTimeout(r, 1300));

      console.log('Register submit:', payload);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Join Agri Connect"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Nuwan"
            autoComplete="given-name"
            required
            error={fieldErrors.firstName}
          />

          <InputField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Perera"
            autoComplete="family-name"
            required
            error={fieldErrors.lastName}
          />
        </div>

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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
          error={fieldErrors.password}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            label="Province"
            name="province"
            value={formData.province}
            onChange={handleChange}
            options={PROVINCE_OPTIONS}
            placeholder="Select province"
            required
            error={fieldErrors.province}
          />

          <SelectField
            label="District"
            name="district"
            value={formData.district}
            onChange={handleChange}
            options={districtOptions}
            placeholder={formData.province ? 'Select district' : 'Pick province first'}
            disabled={!formData.province}
            required
            error={fieldErrors.district}
          />
        </div>

        <Button type="submit" loading={loading}>
          Create account
          {!loading && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          )}
        </Button>

        <p className="text-center text-sm text-gray-400">
          Have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-[#00D2BE] hover:text-emerald-300 hover:underline"
          >
            Sign in instead
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}