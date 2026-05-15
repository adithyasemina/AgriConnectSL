"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuMenu, LuX, LuLeaf } from "react-icons/lu";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const navLinks = [
    { name: "Knowledge Area", href: "#knowledge" },
    { name: "Contact", href: "#contact" },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <LuLeaf className="h-5 w-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            AgriConnect
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => handleNavigation("/account")}
            className="rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-400"
          >
            Log in
          </button>

          <button
            onClick={() => handleNavigation("/account")}
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg"
          >
            Sign up
          </button>
        </div>

        {/* Mobile Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <LuX size={24} /> : <LuMenu size={24} />}
        </button>
      </div>

      {/* Mobile Full Screen Menu */}
      <div
        className={`fixed left-0 top-[73px] z-40 h-screen w-full bg-white transition-all duration-300 md:hidden ${
          isOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex h-full flex-col px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-3 text-lg font-semibold text-slate-800 transition hover:bg-blue-50 hover:text-blue-600"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => handleNavigation("/account")}
              className="w-full rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-400"
            >
              Log in
            </button>

            <button
              onClick={() => handleNavigation("/account")}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
