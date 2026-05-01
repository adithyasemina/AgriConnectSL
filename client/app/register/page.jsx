"use client";

import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#e8eee8] lg:grid lg:grid-cols-2">
      <section className="flex min-h-screen items-center justify-center bg-[url('/leaf-bg.jpg')] bg-cover bg-center px-4 py-8 lg:bg-none">
        <div className="w-full max-w-[390px] rounded-[34px] bg-white px-8 py-10 shadow-2xl">
          <Link
            href="/login"
            className="grid h-10 w-10 place-items-center rounded-full bg-[#dce9df] text-2xl text-[#3f8151] shadow"
          >
            ‹
          </Link>

          <div className="relative mt-5">
            <div className="absolute right-2 top-[-10px] text-6xl">🌿</div>

            <h1 className="text-center text-3xl font-bold text-[#3f8151]">
              Register
            </h1>
            <p className="mt-1 text-center text-sm text-gray-400">
              Create your new account
            </p>
          </div>

          <form className="mt-8 space-y-4">
            <div className="flex items-center gap-3 rounded-lg bg-[#dce9df] px-4 py-3">
              <span>👤</span>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
              />
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-[#dce9df] px-4 py-3">
              <span>✉️</span>
              <input
                type="email"
                placeholder="user@mail.com"
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
              />
              <span className="text-green-500">✓</span>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-[#dce9df] px-4 py-3">
              <span>🔒</span>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
              />
              <span>👁</span>
            </div>

            <button className="w-full rounded-full bg-[#3f8151] py-4 text-sm font-bold text-white hover:bg-[#326942]">
              Login
            </button>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-gray-400">
                <input type="checkbox" defaultChecked className="accent-[#3f8151]" />
                Remember Me
              </label>

              <Link href="#" className="font-semibold text-[#3f8151]">
                Forgot Password ?
              </Link>
            </div>
          </form>

          <div className="my-9 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-500">Or continue with</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="flex justify-center gap-5">
            <button className="grid h-12 w-12 place-items-center rounded-full bg-white text-xl shadow-md">
              f
            </button>
            <button className="grid h-12 w-12 place-items-center rounded-full bg-white text-xl shadow-md">
              G
            </button>
            <button className="grid h-12 w-12 place-items-center rounded-full bg-white text-xl shadow-md">
              
            </button>
          </div>

          <p className="mt-10 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#3f8151] underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>

      <section className="hidden lg:block bg-[url('/leaf-bg.jpg')] bg-cover bg-center" />
    </main>
  );
}