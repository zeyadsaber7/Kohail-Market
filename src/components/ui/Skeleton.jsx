/** Generic pulse-animated placeholder block, used while data/images load. */
export default function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />;
}
