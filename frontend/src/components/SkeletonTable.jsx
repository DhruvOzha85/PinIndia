import Skeleton from "./Skeleton";

export default function SkeletonTable({ rows = 8 }) {
  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 flex gap-4 border-b" style={{ borderColor: "var(--border-card)" }}>
        {[80, 160, 60, 80, 100, 100, 100].map((w, i) => (
          <Skeleton key={i} width={`${w}px`} height="0.75rem" rounded="rounded" />
        ))}
      </div>
      {/* Rows */}
      <div>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="px-5 py-4 flex gap-4 border-b"
            style={{
              borderColor: "var(--border-subtle)",
              animationDelay: `${i * 60}ms`,
            }}
          >
            <Skeleton width="70px" height="0.875rem" rounded="rounded" />
            <Skeleton width="auto" height="0.875rem" className="flex-1" rounded="rounded" />
            <Skeleton width="50px" height="1.25rem" rounded="rounded-md" />
            <Skeleton width="80px" height="1.25rem" rounded="rounded-md" />
            <Skeleton width="90px" height="0.875rem" rounded="rounded" />
            <Skeleton width="90px" height="0.875rem" rounded="rounded" />
            <Skeleton width="90px" height="0.875rem" rounded="rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
