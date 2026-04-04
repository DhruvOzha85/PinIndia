import { Link } from "react-router-dom";

const apis = [
  { method: "GET", path: "/api/states", desc: "All distinct states" },
  { method: "GET", path: "/api/states/:state/districts", desc: "Districts by state" },
  { method: "GET", path: "/api/states/:state/districts/:district/taluks", desc: "Taluks by district" },
  { method: "GET", path: "/api/pincodes", desc: "Paginated & filtered PIN codes" },
  { method: "GET", path: "/api/search?q=", desc: "Debounced full-text search" },
  { method: "GET", path: "/api/pincode/:pincode", desc: "Detail by PIN code" },
  { method: "GET", path: "/api/stats", desc: "Dashboard statistics" },
  { method: "GET", path: "/api/stats/state-distribution", desc: "State-wise count for bar chart" },
  { method: "GET", path: "/api/stats/delivery-distribution", desc: "Delivery vs Non-Delivery pie chart" },
  { method: "GET", path: "/api/export", desc: "Download filtered data as CSV" },
];

const stack = [
  { icon: "⚡", name: "Node.js + Express", desc: "REST API backend" },
  { icon: "🍃", name: "MongoDB Atlas", desc: "Cloud document database" },
  { icon: "⚛️", name: "React 18", desc: "Frontend UI framework" },
  { icon: "🎨", name: "Tailwind CSS", desc: "Utility-first styling" },
  { icon: "📊", name: "Recharts", desc: "Composable chart library" },
  { icon: "🔀", name: "React Router v6", desc: "Client-side routing" },
];

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-12 animate-fade-up">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono text-saffron/70 uppercase tracking-widest">About</span>
          <div className="h-px flex-1 bg-saffron/20" />
        </div>
        <h1 className="font-display font-bold text-4xl mb-3" style={{ color: "var(--text-primary)" }}>PinIndia</h1>
        <p className="text-lg leading-relaxed max-w-2xl" style={{ color: "var(--text-secondary)" }}>
          A full-stack explorer for India's complete postal PIN code database —
          covering all states, districts, taluks and over 150,000 post offices.
        </p>
      </div>

      {/* CTA Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-12 animate-fade-up-delay-1">
        <Link to="/dashboard" className="card p-5 hover:border-saffron/40 transition-all group no-underline">
          <div className="text-2xl mb-2">📊</div>
          <div className="font-display font-semibold group-hover:text-saffron transition-colors" style={{ color: "var(--text-primary)" }}>Dashboard</div>
          <div className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Stats & charts</div>
        </Link>
        <Link to="/explore" className="card p-5 hover:border-teal/40 transition-all group no-underline">
          <div className="text-2xl mb-2">🗺️</div>
          <div className="font-display font-semibold group-hover:text-teal transition-colors" style={{ color: "var(--text-primary)" }}>Explore</div>
          <div className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Filter & browse</div>
        </Link>
        <Link to="/pincode" className="card p-5 hover:border-gold/40 transition-all group no-underline">
          <div className="text-2xl mb-2">📮</div>
          <div className="font-display font-semibold group-hover:text-gold transition-colors" style={{ color: "var(--text-primary)" }}>PIN Lookup</div>
          <div className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Instant details</div>
        </Link>
      </div>

      {/* Tech Stack */}
      <div className="mb-12 animate-fade-up-delay-2">
        <h2 className="font-display font-bold text-2xl mb-5" style={{ color: "var(--text-primary)" }}>Tech Stack</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {stack.map((s) => (
            <div key={s.name} className="card p-4 flex items-center gap-4">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <div className="font-display font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{s.name}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Reference */}
      <div className="animate-fade-up-delay-3">
        <h2 className="font-display font-bold text-2xl mb-5" style={{ color: "var(--text-primary)" }}>API Reference</h2>
        <div className="card overflow-hidden">
          <div>
            {apis.map((api, i) => (
              <div
                key={api.path}
                className="px-5 py-3.5 flex items-center gap-4 flex-wrap"
                style={{ borderBottom: i < apis.length - 1 ? "1px solid var(--border-subtle)" : "none" }}
              >
                <span className="tag bg-saffron/15 text-saffron border border-saffron/30 shrink-0">
                  {api.method}
                </span>
                <code className="font-mono text-sm flex-1 min-w-0 truncate" style={{ color: "var(--text-secondary)" }}>{api.path}</code>
                <span className="text-sm hidden sm:block" style={{ color: "var(--text-muted)" }}>{api.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 text-center animate-fade-up-delay-4" style={{ borderTop: "1px solid var(--border-card)" }}>
        <p className="text-sm font-body" style={{ color: "var(--text-faint)" }}>
          Build By Dhruv
        </p>
      </div>
    </div>
  );
}
