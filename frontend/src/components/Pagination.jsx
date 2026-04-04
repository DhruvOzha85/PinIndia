export default function Pagination({ page, total, limit, onChange }) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const delta = 2;
    const left = Math.max(1, page - delta);
    const right = Math.min(totalPages, page + delta);

    if (left > 1) {
      pages.push(1);
      if (left > 2) pages.push("...");
    }
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages) {
      if (right < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <span className="text-sm font-body" style={{ color: "var(--text-muted)" }}>
        Showing{" "}
        <span style={{ color: "var(--text-secondary)" }}>
          {Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)}
        </span>{" "}
        of <span style={{ color: "var(--text-secondary)" }}>{total.toLocaleString("en-IN")}</span> records
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            border: "1px solid var(--border-card)",
            color: "var(--text-muted)",
          }}
        >
          ←
        </button>

        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-sm" style={{ color: "var(--text-faint)" }}>
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-mono transition-all ${
                p === page
                  ? "bg-saffron text-white border border-saffron"
                  : ""
              }`}
              style={
                p === page
                  ? {}
                  : {
                      border: "1px solid var(--border-card)",
                      color: "var(--text-muted)",
                    }
              }
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            border: "1px solid var(--border-card)",
            color: "var(--text-muted)",
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}
