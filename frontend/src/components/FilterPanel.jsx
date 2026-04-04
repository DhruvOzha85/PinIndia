import { useEffect, useState } from "react";
import { getStates, getDistricts, getTaluks } from "../api";

export default function FilterPanel({ filters, onChange }) {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [taluks, setTaluks] = useState([]);
  const [loading, setLoading] = useState({ states: false, districts: false, taluks: false });

  useEffect(() => {
    setLoading((l) => ({ ...l, states: true }));
    getStates()
      .then(setStates)
      .finally(() => setLoading((l) => ({ ...l, states: false })));
  }, []);

  useEffect(() => {
    setDistricts([]);
    setTaluks([]);
    if (!filters.state) return;
    setLoading((l) => ({ ...l, districts: true }));
    getDistricts(filters.state)
      .then(setDistricts)
      .finally(() => setLoading((l) => ({ ...l, districts: false })));
  }, [filters.state]);

  useEffect(() => {
    setTaluks([]);
    if (!filters.state || !filters.district) return;
    setLoading((l) => ({ ...l, taluks: true }));
    getTaluks(filters.state, filters.district)
      .then(setTaluks)
      .finally(() => setLoading((l) => ({ ...l, taluks: false })));
  }, [filters.district]);

  const handleState = (e) => {
    onChange({ state: e.target.value, district: "", taluk: "" });
  };
  const handleDistrict = (e) => {
    onChange({ ...filters, district: e.target.value, taluk: "" });
  };
  const handleTaluk = (e) => {
    onChange({ ...filters, taluk: e.target.value });
  };
  const handleClear = () => onChange({ state: "", district: "", taluk: "" });

  return (
    <div className="card p-4 flex flex-col md:flex-row gap-3 items-end">
      {/* State */}
      <div className="flex-1 min-w-0">
        <label className="block text-xs font-mono mb-1.5 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          State
        </label>
        <select className="select" value={filters.state} onChange={handleState} disabled={loading.states}>
          <option value="">{loading.states ? "Loading…" : "All States"}</option>
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* District */}
      <div className="flex-1 min-w-0">
        <label className="block text-xs font-mono mb-1.5 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          District
        </label>
        <select
          className="select"
          value={filters.district}
          onChange={handleDistrict}
          disabled={!filters.state || loading.districts}
        >
          <option value="">
            {!filters.state ? "Select state first" : loading.districts ? "Loading…" : "All Districts"}
          </option>
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Taluk */}
      <div className="flex-1 min-w-0">
        <label className="block text-xs font-mono mb-1.5 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          Taluk
        </label>
        <select
          className="select"
          value={filters.taluk}
          onChange={handleTaluk}
          disabled={!filters.district || loading.taluks}
        >
          <option value="">
            {!filters.district ? "Select district first" : loading.taluks ? "Loading…" : "All Taluks"}
          </option>
          {taluks.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Clear */}
      {(filters.state || filters.district || filters.taluk) && (
        <button onClick={handleClear} className="btn-ghost whitespace-nowrap text-sm">
          ✕ Clear
        </button>
      )}
    </div>
  );
}
