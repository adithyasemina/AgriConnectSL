'use client';

/**
 * Reusable Button component
 * Variants: primary (teal glow), secondary (outline), ghost
 * Supports loading state and is touch-friendly (min height 48px)
 */
export default function Button({
  children,
  type = 'button',
  onClick,
  loading = false,
  disabled = false,
  variant = 'primary',
  fullWidth = true,
  className = '',
  ...props
}) {
  const base =
    'group relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm sm:text-base px-6 py-3.5 min-h-[48px] overflow-hidden transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2BE]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#00D2BE] via-[#00D2BE] to-emerald-500 text-[#0A0A0A] shadow-lg shadow-[#00D2BE]/20 hover:shadow-2xl hover:shadow-[#00D2BE]/40 hover:scale-[1.015] active:scale-[0.98]',
    secondary:
      'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-[#00D2BE]/40 backdrop-blur-md',
    ghost:
      'bg-transparent text-gray-300 hover:text-[#00D2BE] hover:bg-white/5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {/* Shimmer sweep effect on primary hover */}
      {variant === 'primary' && (
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      )}

      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
              />
            </svg>
            <span>Please wait...</span>
          </>
        ) : (
          children
        )}
      </span>
    </button>
  );
}