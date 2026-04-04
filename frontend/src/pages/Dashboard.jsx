import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import StatsCard from "../components/StatsCard";
import SkeletonCard from "../components/SkeletonCard";
import Skeleton from "../components/Skeleton";
import { getStats, getStateDistribution, getDeliveryDistribution } from "../api";
const PIE_COLORS = ["#FF6B35", "#00A896"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const displayName = payload[0].name || label;

  return (
    <div
      className="rounded-xl px-4 py-2.5 shadow-xl"
      style={{
        background: "var(--tooltip-bg)",
        border: "1px solid var(--tooltip-border)",
      }}
    >
      <div className="text-xs font-mono mb-1" style={{ color: "var(--text-muted)" }}>{displayName}</div>
      <div className="font-display font-bold text-saffron">
        {Number(payload[0]?.value).toLocaleString("en-IN")}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [stateDist, setStateDist] = useState([]);
  const [allStateDist, setAllStateDist] = useState([]);
  const [deliveryDist, setDeliveryDist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStats(), getStateDistribution(), getDeliveryDistribution()])
      .then(([s, sd, dd]) => {
        setStats(s);
        setAllStateDist(sd);
        setStateDist(sd.slice(0, 15));
        setDeliveryDist(dd);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pieData = deliveryDist
    ? [
        { name: "Delivery", value: deliveryDist.delivery },
        { name: "Non-Delivery", value: deliveryDist.nonDelivery },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono text-saffron/70 uppercase tracking-widest">Overview</span>
          <div className="h-px flex-1 bg-saffron/20" />
        </div>
        <h1 className="font-display font-bold text-4xl" style={{ color: "var(--text-primary)" }}>
          Dashboard
        </h1>
        <p className="mt-2 font-body" style={{ color: "var(--text-muted)" }}>
          Real-time statistics across India's postal network
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatsCard label="Total PIN Codes" value={stats?.totalPincodes} icon="📮" accent="saffron" delay={0} />
            <StatsCard label="Total States" value={stats?.totalStates} icon="🗺️" accent="teal" delay={100} />
            <StatsCard label="Delivery Offices" value={stats?.deliveryOffices} icon="✅" accent="gold" delay={200} />
            <StatsCard label="Non-Delivery Offices" value={stats?.nonDeliveryOffices} icon="📦" accent="purple" delay={300} />
          </>
        )}
      </div>


      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 card p-6 animate-fade-up-delay-2">
          <div className="mb-5">
            <h2 className="font-display font-semibold text-lg" style={{ color: "var(--text-primary)" }}>State-wise Distribution</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Top 15 states by number of PIN codes</p>
          </div>
          {loading ? (
            <div className="space-y-3" style={{ height: 340 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} height="1.5rem" width={`${90 - i * 8}%`} />
              ))}
            </div>
          ) : (
            <div style={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stateDist} margin={{ top: 0, right: 0, left: -10, bottom: 60 }}>
                  <XAxis
                    dataKey="state"
                    tick={{ fill: "var(--text-faint)", fontSize: 10, fontFamily: "JetBrains Mono" }}
                    angle={-40}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    tick={{ fill: "var(--text-faint)", fontSize: 10, fontFamily: "JetBrains Mono" }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,107,53,0.05)" }} />
                  <Bar dataKey="count" fill="#FF6B35" radius={[4, 4, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="card p-6 flex flex-col animate-fade-up-delay-3">
          <div className="mb-5">
            <h2 className="font-display font-semibold text-lg" style={{ color: "var(--text-primary)" }}>Delivery Status</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Delivery vs Non-Delivery offices</p>
          </div>
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Skeleton width="180px" height="180px" rounded="rounded-full" />
            </div>
          ) : (
            <>
              <div className="flex-1" style={{ minHeight: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="45%"
                      outerRadius={90}
                      innerRadius={50}
                      dataKey="value"
                      paddingAngle={3}
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend
                      formatter={(value) => (
                        <span style={{ color: "var(--text-secondary)", fontSize: 12, fontFamily: "DM Sans" }}>
                          {value}
                        </span>
                      )}
                    />
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {deliveryDist && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-saffron/10 border border-saffron/20 rounded-xl p-3 text-center">
                    <div className="font-display font-bold text-xl text-saffron">
                      {((deliveryDist.delivery / (deliveryDist.delivery + deliveryDist.nonDelivery)) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Delivery</div>
                  </div>
                  <div className="bg-teal/10 border border-teal/20 rounded-xl p-3 text-center">
                    <div className="font-display font-bold text-xl text-teal">
                      {((deliveryDist.nonDelivery / (deliveryDist.delivery + deliveryDist.nonDelivery)) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Non-Delivery</div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
