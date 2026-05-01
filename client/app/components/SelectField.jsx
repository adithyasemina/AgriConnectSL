'use client';

import { useState } from 'react';

/**
 * Reusable SelectField - matches InputField styling language
 * Used for Province, District, and Role dropdowns
 */
export default function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  required = false,
  error,
  icon,
  disabled = false,
  ...props
}) {
  const [focused, setFocused] = useState(false);

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
        {/* Teal glow ring on focus */}
        <div
          className={`pointer-events-none absolute -inset-[1.5px] rounded-xl bg-gradient-to-r from-[#00D2BE] via-emerald-400 to-[#00D2BE] opacity-0 blur-sm transition-opacity duration-300 ${
            focused && !error ? 'opacity-40' : ''
          }`}
        />

        <div className="relative">
          {icon && (
            <div
              className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                focused ? 'text-[#00D2BE]' : 'text-gray-500'
              }`}
            >
              {icon}
            </div>
          )}

          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            required={required}
            disabled={disabled}
            className={`w-full appearance-none bg-white/[0.04] border rounded-xl text-white text-sm sm:text-base py-3.5 ${
              icon ? 'pl-12' : 'pl-4'
            } pr-10 transition-all duration-300 ease-out focus:outline-none focus:bg-white/[0.07] disabled:opacity-50 disabled:cursor-not-allowed ${
              error
                ? 'border-red-500/50 focus:border-red-400/60'
                : 'border-white/10 focus:border-[#00D2BE]/50'
            } ${!value ? 'text-gray-500' : 'text-white'}`}
            {...props}
          >
            <option value="" disabled className="bg-[#0A0A0A] text-gray-500">
              {placeholder}
            </option>
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-[#0A0A0A] text-white"
              >
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom chevron */}
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00D2BE] transition-colors duration-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
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