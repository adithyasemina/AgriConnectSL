'use client';

import { useState } from 'react';

/**
 * Reusable InputField with:
 * - Optional left icon
 * - Teal glow on focus
 * - Password show/hide toggle (when type="password")
 * - Error state UI
 */
export default function InputField({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  icon,
  autoComplete,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 tracking-wide"
        >
          {label}
          {required && <span className="text-[#00D2BE] ml-1">*</span>}
        </label>
      )}

      <div className="relative group">
        {/* Soft teal glow ring on focus */}
        <div
          className={`pointer-events-none absolute -inset-[1.5px] rounded-xl bg-gradient-to-r from-[#00D2BE] via-emerald-400 to-[#00D2BE] opacity-0 blur-sm transition-opacity duration-300 ${
            focused && !error ? 'opacity-40' : ''
          }`}
        />

        <div className="relative">
          {icon && (
            <div
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                focused ? 'text-[#00D2BE]' : 'text-gray-500'
              }`}
            >
              {icon}
            </div>
          )}

          <input
            id={name}
            name={name}
            type={inputType}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            required={required}
            autoComplete={autoComplete}
            className={`w-full bg-white/[0.04] border rounded-xl text-white text-sm sm:text-base placeholder:text-gray-500 py-3.5 ${
              icon ? 'pl-12' : 'pl-4'
            } ${isPassword ? 'pr-12' : 'pr-4'} transition-all duration-300 ease-out focus:outline-none focus:bg-white/[0.07] ${
              error
                ? 'border-red-500/50 focus:border-red-400/60'
                : 'border-white/10 focus:border-[#00D2BE]/50'
            }`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00D2BE] transition-colors duration-200"
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5 animate-in">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}