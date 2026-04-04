export default function Skeleton({ width, height, rounded = "rounded-lg", className = "" }) {
  return (
    <div
      className={`skeleton ${rounded} ${className}`}
      style={{
        width: width || "100%",
        height: height || "1rem",
      }}
    />
  );
}
