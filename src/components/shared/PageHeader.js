export default function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        {eyebrow && (
          <p className="text-[11px] font-mono text-sub uppercase tracking-widest mb-1">{eyebrow}</p>
        )}
        <h1 className="font-display font-bold text-2xl text-text">{title}</h1>
        {subtitle && <p className="text-sm text-sub mt-1 font-body">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
