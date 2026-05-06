export function Skeleton({ className }) {
  return <div className={`shimmer rounded ${className}`} />;
}

export function ContentCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="shimmer h-40 w-full" />
      <div className="p-4 space-y-3">
        <div className="shimmer h-4 w-3/4 rounded" />
        <div className="shimmer h-3 w-1/3 rounded" />
        <div className="shimmer h-3 w-full rounded" />
        <div className="shimmer h-3 w-2/3 rounded" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="shimmer h-3.5 rounded w-24" />
        </td>
      ))}
    </tr>
  );
}
