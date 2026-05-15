const contentItems = [
  {
    title: "Paddy Disease Prevention Guide",
    category: "Knowledge Hub",
    status: "Published",
    updated: "Today",
  },
  {
    title: "Soil Testing Awareness Program",
    category: "Broadcast Alert",
    status: "Draft",
    updated: "Yesterday",
  },
  {
    title: "Fertilizer Recommendation Notice",
    category: "Government Notice",
    status: "Published",
    updated: "2 days ago",
  },
  {
    title: "Pest Outbreak Warning",
    category: "Urgent Alert",
    status: "Published",
    updated: "5 days ago",
  },
];

export default function AdminContentPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-[2rem] border border-blue-600 bg-white p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-600">
            Content
          </p>
          <h1 className="mt-3 text-4xl font-black text-blue-600">
            Content Management
          </h1>
          <p className="mt-2 font-semibold text-blue-600">
            Manage knowledge hub articles, broadcast alerts, and farming
            notices.
          </p>
        </div>

        <button className="rounded-2xl border border-blue-600 bg-blue-600 px-5 py-3 font-black text-white">
          Create Content
        </button>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <ContentStat title="Articles" value="34" />
        <ContentStat title="Alerts" value="12" />
        <ContentStat title="Drafts" value="06" />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-[2rem] border border-blue-600 bg-white p-6 xl:col-span-2">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-black text-blue-600">
              Content Library
            </h2>

            <select className="rounded-2xl border border-blue-600 bg-white px-4 py-3 font-semibold text-blue-600 outline-none">
              <option>All Categories</option>
              <option>Knowledge Hub</option>
              <option>Broadcast Alert</option>
              <option>Government Notice</option>
            </select>
          </div>

          <div className="space-y-4">
            {contentItems.map((item) => (
              <div
                key={item.title}
                className="flex flex-col gap-4 rounded-3xl border border-blue-600 bg-white p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="font-black text-blue-600">{item.title}</h3>
                  <p className="mt-1 font-semibold text-blue-600">
                    {item.category} • Updated {item.updated}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge text={item.status} />
                  <button className="rounded-xl border border-blue-600 bg-white px-4 py-2 font-black text-blue-600 hover:bg-blue-600 hover:text-white">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-blue-600 bg-white p-6">
          <h2 className="text-2xl font-black text-blue-600">Create New</h2>
          <p className="mt-1 font-semibold text-blue-600">
            Select a content type to create.
          </p>

          <div className="mt-6 space-y-3">
            <CreateButton title="Knowledge Article" />
            <CreateButton title="Broadcast Alert" />
            <CreateButton title="Urgent Warning" />
            <CreateButton title="Soil Notice" />
          </div>
        </div>
      </section>
    </div>
  );
}

function ContentStat({ title, value }: { title: string; value: string }) {
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

function CreateButton({ title }: { title: string }) {
  return (
    <button className="w-full rounded-3xl border border-blue-600 bg-white px-5 py-4 text-left font-black text-blue-600 hover:bg-blue-600 hover:text-white">
      {title}
    </button>
  );
}