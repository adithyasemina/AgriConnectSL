const users = [
  {
    name: "Nimal Perera",
    email: "nimal@gmail.com",
    role: "Farmer",
    district: "Kurunegala",
    status: "Active",
  },
  {
    name: "Kamal Fernando",
    email: "kamalofficer@gmail.com",
    role: "Officer",
    district: "Colombo",
    status: "Active",
  },
  {
    name: "Saman Kumara",
    email: "saman@gmail.com",
    role: "Farmer",
    district: "Kandy",
    status: "Pending",
  },
  {
    name: "Admin User",
    email: "admin@gmail.com",
    role: "Admin",
    district: "System",
    status: "Active",
  },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-[2rem] border border-blue-600 bg-white p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-600">
            Users
          </p>
          <h1 className="mt-3 text-4xl font-black text-blue-600">
            User Management
          </h1>
          <p className="mt-2 font-semibold text-blue-600">
            Manage farmers, officers, and admin accounts.
          </p>
        </div>

        <button className="rounded-2xl border border-blue-600 bg-blue-600 px-5 py-3 font-black text-white">
          Add Officer
        </button>
      </section>

      <section className="grid gap-5 sm:grid-cols-3">
        <MiniStat title="Farmers" value="620" />
        <MiniStat title="Officers" value="18" />
        <MiniStat title="Admins" value="01" />
      </section>

      <section className="rounded-[2rem] border border-blue-600 bg-white p-4 md:p-6">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-black text-blue-600">All Users</h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search users..."
              className="rounded-2xl border border-blue-600 bg-white px-4 py-3 font-semibold text-blue-600 outline-none placeholder:text-blue-600"
            />

            <select className="rounded-2xl border border-blue-600 bg-white px-4 py-3 font-semibold text-blue-600 outline-none">
              <option>All Roles</option>
              <option>Farmer</option>
              <option>Officer</option>
              <option>Admin</option>
            </select>
          </div>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-blue-600 text-left text-blue-600">
                <th className="py-4 font-black">Name</th>
                <th className="py-4 font-black">Email</th>
                <th className="py-4 font-black">Role</th>
                <th className="py-4 font-black">District</th>
                <th className="py-4 font-black">Status</th>
                <th className="py-4 text-right font-black">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.email} className="border-b border-blue-600">
                  <td className="py-4 font-bold text-blue-600">
                    {user.name}
                  </td>
                  <td className="py-4 font-semibold text-blue-600">
                    {user.email}
                  </td>
                  <td className="py-4">
                    <Badge text={user.role} />
                  </td>
                  <td className="py-4 font-semibold text-blue-600">
                    {user.district}
                  </td>
                  <td className="py-4">
                    <Badge text={user.status} />
                  </td>
                  <td className="py-4 text-right">
                    <button className="rounded-xl border border-blue-600 bg-white px-4 py-2 font-black text-blue-600 hover:bg-blue-600 hover:text-white">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 md:hidden">
          {users.map((user) => (
            <div
              key={user.email}
              className="rounded-3xl border border-blue-600 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-black text-blue-600">{user.name}</h3>
                  <p className="mt-1 font-semibold text-blue-600">
                    {user.email}
                  </p>
                </div>

                <Badge text={user.status} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge text={user.role} />
                <Badge text={user.district} />
              </div>

              <button className="mt-4 w-full rounded-2xl border border-blue-600 bg-blue-600 px-4 py-3 font-black text-white">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function MiniStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[2rem] border border-blue-600 bg-white p-6 text-blue-600">
      <p className="font-bold">{title}</p>
      <h2 className="mt-2 text-4xl font-black">{value}</h2>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="rounded-full border border-blue-600 bg-white px-3 py-1 text-xs font-black text-blue-600">
      {text}
    </span>
  );
}