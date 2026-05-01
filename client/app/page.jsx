export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6fbf4] text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-green-100 bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-600 text-xl">
              🌱
            </div>
            <span className="text-xl font-bold tracking-tight">
              AgriConnect
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="hover:text-green-700">Features</a>
            <a href="#how" className="hover:text-green-700">How it works</a>
            <a href="#products" className="hover:text-green-700">Products</a>
          </div>

          <button className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700">
            Login
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-10 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-green-300/30 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-semibold text-green-700 shadow-sm">
              Fresh farm products, direct to buyers
            </div>

            <h1 className="max-w-xl text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Connect Farmers & Buyers Easily
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              AgriConnect helps farmers sell fresh products directly to buyers.
              No middlemen, fair prices, and faster access to local produce.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button className="rounded-full bg-green-600 px-8 py-4 font-bold text-white shadow-xl shadow-green-600/25 transition hover:-translate-y-0.5 hover:bg-green-700">
                Get Started
              </button>

              <button className="rounded-full border border-slate-200 bg-white px-8 py-4 font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-green-300">
                Explore Products
              </button>
            </div>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-extrabold">500+</p>
                <p className="text-sm text-slate-500">Farmers</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold">1K+</p>
                <p className="text-sm text-slate-500">Buyers</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold">24h</p>
                <p className="text-sm text-slate-500">Delivery</p>
              </div>
            </div>
          </div>

          {/* Hero Card */}
          <div className="relative">
            <div className="rounded-[2rem] border border-green-100 bg-white p-4 shadow-2xl shadow-green-900/10">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-green-600 to-lime-500 p-8 text-white">
                <p className="text-sm font-semibold uppercase tracking-widest text-green-100">
                  Today&apos;s Fresh Pick
                </p>

                <h2 className="mt-4 text-4xl font-extrabold">
                  Organic Vegetables
                </h2>

                <p className="mt-4 max-w-sm text-green-50">
                  Freshly harvested vegetables from trusted local farmers near you.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
                    <p className="text-sm text-green-50">Price</p>
                    <p className="text-2xl font-bold">Rs. 250/kg</p>
                  </div>

                  <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
                    <p className="text-sm text-green-50">Available</p>
                    <p className="text-2xl font-bold">120 kg</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-4 rounded-3xl bg-white p-5 shadow-xl">
              <p className="text-sm text-slate-500">Farmer Rating</p>
              <p className="text-2xl font-extrabold">⭐ 4.9</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center">
          <p className="font-bold text-green-700">Why AgriConnect?</p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight">
            Simple, fast, and farmer-friendly
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: "🧑‍🌾",
              title: "Direct Selling",
              text: "Farmers can list products and sell directly to buyers.",
            },
            {
              icon: "💰",
              title: "Fair Prices",
              text: "Better income for farmers and better value for buyers.",
            },
            {
              icon: "🚚",
              title: "Fast Delivery",
              text: "Fresh products delivered quickly from nearby farmers.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-green-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 text-4xl">{item.icon}</div>
              <h3 className="text-xl font-extrabold">{item.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 max-w-2xl">
            <p className="font-bold text-green-700">How it works</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight">
              From farm to customer in 3 steps
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              "Farmer adds fresh products",
              "Buyer places an order",
              "Product gets delivered fast",
            ].map((step, index) => (
              <div key={step} className="rounded-3xl bg-[#f6fbf4] p-8">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="text-xl font-extrabold">{step}</h3>
                <p className="mt-3 text-slate-600">
                  Easy process designed for farmers and customers.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-[2rem] bg-slate-950 px-8 py-16 text-center text-white md:px-16">
          <h2 className="text-4xl font-extrabold tracking-tight">
            Ready to grow your farming business?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Join AgriConnect and start selling fresh products directly to buyers.
          </p>

          <button className="mt-8 rounded-full bg-green-500 px-8 py-4 font-bold text-white transition hover:bg-green-600">
            Create Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <p className="font-bold">AgriConnect 🌱</p>
          <p className="text-sm text-slate-500">
            © 2026 AgriConnect. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}