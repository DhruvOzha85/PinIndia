import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getPincodeDetail } from "../api";
import Skeleton from "../components/Skeleton";

const RECENT_KEY = "pinIndia-recentSearches";
const MAX_RECENT = 5;

function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
  } catch {
    return [];
  }
}

function saveRecentSearch(pincode, officeName) {
  const current = getRecentSearches();
  const filtered = current.filter((r) => r.pincode !== String(pincode));
  const updated = [{ pincode: String(pincode), officeName, ts: Date.now() }, ...filtered].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  return updated;
}

const officeTypeLabel = {
  HO: { label: "Head Office", color: "text-gold" },
  SO: { label: "Sub Office", color: "text-teal" },
  BO: { label: "Branch Office", color: "text-purple-400" },
};

function DetailCard({ record, index }) {
  const typeInfo = officeTypeLabel[record.officeType] || { label: record.officeType, color: "" };

  return (
    <div
      className="card p-6 animate-fade-up"
      style={{ animationDelay: `${index * 80}ms`, opacity: 0 }}
    >
      <div className="flex items-start justify-between mb-4 gap-4">
        <div>
          <div className="font-mono text-3xl font-bold text-saffron">{record.pincode}</div>
          <div className="font-display font-semibold text-lg mt-1" style={{ color: "var(--text-primary)" }}>{record.officeName}</div>
        </div>
        <span className={`tag border bg-white/5 border-white/10 ${typeInfo.color} text-xs`}>
          {typeInfo.label}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {[
          ["Delivery Status", record.deliveryStatus],
          ["Taluk", record.taluk],
          ["District", record.districtName],
          ["State", record.stateName],
          ["Division", record.divisionName],
          ["Region", record.regionName],
          ["Circle", record.circleName],
          ["Telephone", record.telephone],
          ["Related Sub Office", record.relatedSubOffice],
          ["Related Head Office", record.relatedHeadOffice],
        ]
          .filter(([, v]) => v && v !== "nan" && v !== "NA")
          .map(([label, value]) => (
            <div key={label}>
              <div className="text-xs font-mono uppercase tracking-wider mb-0.5" style={{ color: "var(--text-faint)" }}>{label}</div>
              <div style={{ color: "var(--text-secondary)" }}>{value}</div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default function PincodeLookup() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [recent, setRecent] = useState(getRecentSearches);

  const doSearch = (pin) => {
    if (!pin || pin.length < 3) return;
    setLoading(true);
    setError("");
    setSearched(true);
    setSearchParams({ q: pin });
    getPincodeDetail(pin)
      .then((data) => {
        setResults(data);
        if (data.length > 0) {
          const updated = saveRecentSearch(pin, data[0].officeName);
          setRecent(updated);
        }
      })
      .catch((e) => {
        setResults([]);
        setError(e.response?.data?.message || "PIN code not found. Please check and try again.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setInput(q);
      doSearch(q);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    doSearch(input.trim());
  };


  const clearRecent = () => {
    localStorage.removeItem(RECENT_KEY);
    setRecent([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono text-saffron/70 uppercase tracking-widest">Lookup</span>
          <div className="h-px flex-1 bg-saffron/20" />
        </div>
        <h1 className="font-display font-bold text-4xl" style={{ color: "var(--text-primary)" }}>PIN Code Lookup</h1>
        <p className="mt-2 font-body" style={{ color: "var(--text-muted)" }}>
          Enter any 6-digit Indian PIN code to get full postal details
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="animate-fade-up-delay-1 mb-4">
        <div className="flex gap-3">
          <input
            type="text"
            className="input text-xl font-mono tracking-widest"
            placeholder="e.g. 380001"
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            pattern="[0-9]{6}"
          />
          <button
            type="submit"
            className="btn-primary text-base px-7 whitespace-nowrap"
            disabled={loading || input.length < 3}
          >
            {loading ? "…" : "Search"}
          </button>
        </div>
        <p className="text-xs mt-2 font-mono" style={{ color: "var(--text-faint)" }}>6 digits · e.g. 380001 for Ahmedabad GPO</p>
      </form>

      {/* Recent Searches */}
      {recent.length > 0 && (
        <div className="mb-8 animate-fade-up-delay-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
              Recent
            </span>
            <button
              onClick={clearRecent}
              className="text-xs font-mono uppercase tracking-widest hover:text-saffron transition-colors"
              style={{ color: "var(--text-faint)" }}
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recent.map((r) => (
              <button
                key={r.pincode}
                onClick={() => {
                  setInput(r.pincode);
                  doSearch(r.pincode);
                }}
                className="card px-3 py-1.5 text-sm font-mono flex items-center gap-2 hover:border-saffron/40 transition-all group"
              >
                <span className="text-saffron group-hover:underline">{r.pincode}</span>
                {r.officeName && (
                  <span style={{ color: "var(--text-faint)" }} className="text-xs hidden sm:inline truncate max-w-[120px]">
                    {r.officeName}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Skeleton width="120px" height="2rem" className="mb-2" />
                  <Skeleton width="200px" height="1.25rem" />
                </div>
                <Skeleton width="80px" height="1.5rem" rounded="rounded-md" />
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {Array.from({ length: 6 }).map((_, j) => (
                  <div key={j}>
                    <Skeleton width="60px" height="0.625rem" className="mb-1" rounded="rounded" />
                    <Skeleton width={`${60 + Math.random() * 40}%`} height="0.875rem" rounded="rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div
          className="card p-6 flex items-center gap-4 animate-fade-up"
          style={{ borderColor: "rgba(239, 68, 68, 0.3)", background: "rgba(239, 68, 68, 0.05)" }}
        >
          <span className="text-3xl">🚫</span>
          <div>
            <div className="font-display font-semibold text-red-400">Not Found</div>
            <div className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{error}</div>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && !error && results.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              {results.length} office{results.length > 1 ? "s" : ""} found for{" "}
              <span className="font-mono text-saffron">{input}</span>
            </span>
          </div>
          <div className="space-y-4">
            {results.map((r, i) => (
              <DetailCard key={r._id || i} record={r} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state before search */}
      {!loading && !searched && (
        <div className="text-center py-16 animate-fade-up-delay-2">
          <div className="text-7xl mb-4">📮</div>
          <div className="font-display text-xl" style={{ color: "var(--text-faint)" }}>Enter a PIN code above to get started</div>
        </div>
      )}
    </div>
  );
}
