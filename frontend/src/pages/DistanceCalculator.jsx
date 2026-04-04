import { useState } from "react";
import { getPincodeDetail } from "../api";
import Skeleton from "../components/Skeleton";

// Haversine formula
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Free geocoding via Nominatim
async function geocodePincode(pincode) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json&limit=1`
  );
  const data = await res.json();
  if (data.length === 0) throw new Error(`Could not geocode PIN ${pincode}`);
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

export default function DistanceCalculator() {
  const [pin1, setPin1] = useState("");
  const [pin2, setPin2] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (pin1.length < 6 || pin2.length < 6) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const [details1, details2, geo1, geo2] = await Promise.all([
        getPincodeDetail(pin1),
        getPincodeDetail(pin2),
        geocodePincode(pin1),
        geocodePincode(pin2),
      ]);

      const distance = haversine(geo1.lat, geo1.lng, geo2.lat, geo2.lng);

      setResult({
        from: details1[0] || { pincode: pin1, officeName: "Unknown" },
        to: details2[0] || { pincode: pin2, officeName: "Unknown" },
        geo1,
        geo2,
        distance,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not calculate distance. Please check PIN codes."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono text-saffron/70 uppercase tracking-widest">
            Tool
          </span>
          <div className="h-px flex-1 bg-saffron/20" />
        </div>
        <h1 className="font-display font-bold text-4xl" style={{ color: "var(--text-primary)" }}>
          Distance Calculator
        </h1>
        <p className="mt-2 font-body" style={{ color: "var(--text-muted)" }}>
          Estimate the straight-line distance between two Indian PIN codes
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleCalculate} className="animate-fade-up-delay-1 mb-10">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {/* FROM */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
              From PIN Code
            </label>
            <input
              type="text"
              className="input text-xl font-mono tracking-widest"
              placeholder="e.g. 110001"
              value={pin1}
              onChange={(e) => setPin1(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
            />
          </div>

          {/* TO */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
              To PIN Code
            </label>
            <input
              type="text"
              className="input text-xl font-mono tracking-widest"
              placeholder="e.g. 400001"
              value={pin2}
              onChange={(e) => setPin2(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary w-full text-base py-3"
          disabled={loading || pin1.length < 6 || pin2.length < 6}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path
                  fill="currentColor"
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Calculating…
            </span>
          ) : (
            "📏 Calculate Distance"
          )}
        </button>
      </form>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4 animate-fade-up">
          <div className="card p-6">
            <Skeleton width="60%" height="2rem" className="mb-3" />
            <Skeleton width="40%" height="1rem" className="mb-6" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton height="5rem" />
              <Skeleton height="5rem" />
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="card p-6 flex items-center gap-4 animate-fade-up" style={{ borderColor: "rgba(239, 68, 68, 0.3)", background: "rgba(239, 68, 68, 0.05)" }}>
          <span className="text-3xl">🚫</span>
          <div>
            <div className="font-display font-semibold text-red-400">Error</div>
            <div className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{error}</div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="space-y-6 animate-fade-up">
          {/* Distance headline */}
          <div className="card p-8 text-center">
            <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
              Estimated Distance
            </div>
            <div className="font-display font-bold text-5xl sm:text-6xl text-saffron mb-2">
              {result.distance.toFixed(1)}
              <span className="text-2xl ml-1" style={{ color: "var(--text-muted)" }}>km</span>
            </div>
            <div className="text-sm" style={{ color: "var(--text-faint)" }}>
              Straight-line (as the crow flies)
            </div>
          </div>

          {/* Location cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* FROM card */}
            <div className="card p-6" style={{ borderColor: "rgba(0, 168, 150, 0.3)" }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 rounded-full bg-teal/20 flex items-center justify-center text-teal text-xs font-bold">A</span>
                <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>From</span>
              </div>
              <div className="font-mono text-2xl font-bold text-saffron mb-1">{result.from.pincode}</div>
              <div className="font-display font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                {result.from.officeName}
              </div>
              <div className="space-y-1.5 text-sm">
                {result.from.districtName && (
                  <div>
                    <span style={{ color: "var(--text-faint)" }}>District: </span>
                    <span style={{ color: "var(--text-secondary)" }}>{result.from.districtName}</span>
                  </div>
                )}
                {result.from.stateName && (
                  <div>
                    <span style={{ color: "var(--text-faint)" }}>State: </span>
                    <span style={{ color: "var(--text-secondary)" }}>{result.from.stateName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* TO card */}
            <div className="card p-6" style={{ borderColor: "rgba(240, 165, 0, 0.3)" }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-bold">B</span>
                <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>To</span>
              </div>
              <div className="font-mono text-2xl font-bold text-saffron mb-1">{result.to.pincode}</div>
              <div className="font-display font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                {result.to.officeName}
              </div>
              <div className="space-y-1.5 text-sm">
                {result.to.districtName && (
                  <div>
                    <span style={{ color: "var(--text-faint)" }}>District: </span>
                    <span style={{ color: "var(--text-secondary)" }}>{result.to.districtName}</span>
                  </div>
                )}
                {result.to.stateName && (
                  <div>
                    <span style={{ color: "var(--text-faint)" }}>State: </span>
                    <span style={{ color: "var(--text-secondary)" }}>{result.to.stateName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !result && !error && (
        <div className="text-center py-16 animate-fade-up-delay-2">
          <div className="text-7xl mb-4">📏</div>
          <div className="font-display text-xl" style={{ color: "var(--text-faint)" }}>
            Enter two PIN codes to calculate the distance
          </div>
        </div>
      )}
    </div>
  );
}
