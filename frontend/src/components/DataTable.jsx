import { useNavigate } from "react-router-dom";
import SkeletonTable from "./SkeletonTable";

const officeTypeColor = {
  HO: "bg-gold/15 text-gold border-gold/30",
  SO: "bg-teal/15 text-teal border-teal/30",
  BO: "bg-purple-500/15 text-purple-300 border-purple-500/30",
};

const deliveryColor = {
  Delivery: "bg-green-500/15 text-green-400 border-green-500/30",
  "Non-Delivery": "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function DataTable({ rows, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return <SkeletonTable rows={8} />;
  }

  if (!rows?.length) {
    return (
      <div className="card flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">🗺️</div>
        <div className="font-display font-semibold text-lg" style={{ color: "var(--text-secondary)" }}>No records found</div>
        <div className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Try adjusting your filters or search query</div>
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm min-w-[700px]">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border-card)" }}>
            {["PIN Code", "Office Name", "Type", "Delivery", "Taluk", "District", "State"].map(
              (h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3.5 font-mono text-xs uppercase tracking-widest whitespace-nowrap"
                  style={{ color: "var(--text-muted)" }}
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row._id || i}
              className="transition-colors cursor-pointer group"
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
              onClick={() => navigate(`/pincode?q=${row.pincode}`)}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <td className="px-5 py-3.5 font-mono font-medium text-saffron group-hover:underline whitespace-nowrap">
                {row.pincode}
              </td>
              <td className="px-5 py-3.5 max-w-[200px] truncate" style={{ color: "var(--text-secondary)" }}>{row.officeName}</td>
              <td className="px-5 py-3.5">
                <span
                  className={`tag border ${
                    officeTypeColor[row.officeType] || "bg-white/10 border-white/10"
                  }`}
                  style={{ color: officeTypeColor[row.officeType] ? undefined : "var(--text-muted)" }}
                >
                  {row.officeType || "—"}
                </span>
              </td>
              <td className="px-5 py-3.5">
                <span
                  className={`tag border ${
                    deliveryColor[row.deliveryStatus] || "bg-white/10 border-white/10"
                  }`}
                  style={{ color: deliveryColor[row.deliveryStatus] ? undefined : "var(--text-muted)" }}
                >
                  {row.deliveryStatus || "—"}
                </span>
              </td>
              <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: "var(--text-muted)" }}>{row.taluk || "—"}</td>
              <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: "var(--text-muted)" }}>{row.districtName || "—"}</td>
              <td className="px-5 py-3.5 whitespace-nowrap" style={{ color: "var(--text-faint)" }}>{row.stateName || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
