export default function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-up">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center mb-4">
          <Icon size={22} className="text-muted" />
        </div>
      )}
      <h3 className="font-display font-semibold text-text mb-1">{title}</h3>
      {desc && <p className="text-sm text-sub max-w-xs">{desc}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
