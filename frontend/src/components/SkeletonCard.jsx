import Skeleton from "./Skeleton";

export default function SkeletonCard() {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <Skeleton width="2.5rem" height="2.5rem" rounded="rounded-lg" />
        <Skeleton width="3rem" height="1.25rem" rounded="rounded-md" />
      </div>
      <Skeleton width="60%" height="2rem" className="mb-2" />
      <Skeleton width="45%" height="0.875rem" />
    </div>
  );
}
