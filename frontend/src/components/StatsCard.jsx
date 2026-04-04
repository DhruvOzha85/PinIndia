export default function StatsCard({ label, value, icon, delay = 0, accent = "saffron" }) {
  const accentMap = {
    saffron: "from-saffron/20 to-transparent border-saffron/30 text-saffron",
    teal: "from-teal/20 to-transparent border-teal/30 text-teal",
    gold: "from-gold/20 to-transparent border-gold/30 text-gold",
    purple: "from-purple-500/20 to-transparent border-purple-500/30 text-purple-400",
  };
  const style = accentMap[accent] || accentMap.saffron;

  return (
    <div
      className={`card p-6 bg-gradient-to-br ${style} animate-fade-up`}
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span
          className="text-xs font-mono px-2 py-1 rounded-md"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-card)",
            color: "var(--text-muted)",
          }}
        >
          LIVE
        </span>
      </div>
      <div className="font-display font-bold text-3xl mb-1" style={{ color: "var(--text-primary)" }}>
        {value !== undefined && value !== null
          ? Number(value).toLocaleString("en-IN")
          : "—"}
      </div>
      <div className="font-body text-sm" style={{ color: "var(--text-muted)" }}>{label}</div>
    </div>
  );
}
