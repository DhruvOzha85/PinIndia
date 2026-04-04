import { useEffect, useState, useCallback } from "react";
import FilterPanel from "../components/FilterPanel";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import { getPincodes, searchPincodes, getExportUrl } from "../api";
import { useDebounce } from "../hooks/useDebounce";

export default function Explore() {
  const [filters, setFilters] = useState({ state: "", district: "", taluk: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch suggestions
  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length < 2) {
      setSuggestions([]);
      return;
    }
    searchPincodes(debouncedSearch)
      .then(setSuggestions)
      .catch(() => setSuggestions([]));
  }, [debouncedSearch]);

  // Fetch table data
  const fetchData = useCallback(() => {
    setLoading(true);
    const params = { page, limit };
    if (filters.state) params.state = filters.state;
    if (filters.district) params.district = filters.district;
    if (filters.taluk) params.taluk = filters.taluk;

    getPincodes(params)
      .then(({ data, total }) => {
        setRows(data);
        setTotal(total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters, page, limit]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSuggestionClick = (item) => {
    setFilters({ state: item.stateName || "", district: item.districtName || "", taluk: item.taluk || "" });
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const exportUrl = getExportUrl({
    ...(filters.state && { state: filters.state }),
    ...(filters.district && { district: filters.district }),
    ...(filters.taluk && { taluk: filters.taluk }),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono text-saffron/70 uppercase tracking-widest">Browse</span>
          <div className="h-px flex-1 bg-saffron/20" />
        </div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display font-bold text-4xl" style={{ color: "var(--text-primary)" }}>Explore</h1>
            <p className="mt-1 font-body" style={{ color: "var(--text-muted)" }}>
              Filter and browse India's complete PIN code database
            </p>
          </div>
          <a
            href={exportUrl}
            download
            className="btn-primary flex items-center gap-2 text-sm no-underline"
          >
            <span>↓</span> Download CSV
          </a>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 animate-fade-up-delay-1">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--text-faint)" }}>🔍</span>
          <input
            type="text"
            className="input pl-10"
            placeholder="Search by PIN code, office name, district, state…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onFocus={() => suggestions.length && setShowSuggestions(true)}
          />
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            className="absolute top-full left-0 right-0 z-30 mt-1 card overflow-hidden shadow-2xl"
            style={{ border: "1px solid var(--input-border)" }}
          >
            {suggestions.map((s, i) => (
              <button
                key={s._id || i}
                onMouseDown={() => handleSuggestionClick(s)}
                className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-saffron/10 transition-colors"
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
              >
                <div>
                  <span className="font-mono text-saffron mr-3">{s.pincode}</span>
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{s.officeName}</span>
                </div>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{s.districtName}, {s.stateName}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 animate-fade-up-delay-1">
        <FilterPanel filters={filters} onChange={handleFilterChange} />
      </div>

      {/* Results count */}
      <div className="flex items-center gap-3 mb-4 animate-fade-up-delay-2">
        <span className="text-sm font-body" style={{ color: "var(--text-muted)" }}>
          {loading ? "Loading…" : `${total.toLocaleString("en-IN")} records found`}
        </span>
        {(filters.state || filters.district || filters.taluk) && (
          <div className="flex items-center gap-2 flex-wrap">
            {filters.state && (
              <span className="tag bg-saffron/10 text-saffron border border-saffron/20">
                {filters.state}
              </span>
            )}
            {filters.district && (
              <span className="tag bg-teal/10 text-teal border border-teal/20">
                {filters.district}
              </span>
            )}
            {filters.taluk && (
              <span className="tag bg-gold/10 text-gold border border-gold/20">
                {filters.taluk}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="animate-fade-up-delay-2 mb-6">
        <DataTable rows={rows} loading={loading} />
      </div>

      {/* Pagination */}
      <div className="animate-fade-up-delay-3">
        <Pagination page={page} total={total} limit={limit} onChange={setPage} />
      </div>
    </div>
  );
}
